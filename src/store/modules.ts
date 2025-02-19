import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InstalledModule, ModuleConfig } from '../types/module';
import JSZip from 'jszip';

interface ModuleState {
  modules: InstalledModule[];
  installModule: (file: File) => Promise<void>;
  toggleModuleStatus: (moduleId: string) => void;
  uninstallModule: (moduleId: string) => void;
  getModule: (moduleId: string) => InstalledModule | undefined;
}

export const useModuleStore = create<ModuleState>()(
  persist(
    (set, get) => ({
      modules: [],
      
      installModule: async (file: File) => {
        try {
          const zip = new JSZip();
          const contents = await zip.loadAsync(file);
          
          // Read config.json from the module
          const configFile = contents.file('config.json');
          if (!configFile) {
            throw new Error('Invalid module: config.json not found');
          }
          
          const configContent = await configFile.async('text');
          const config: ModuleConfig = JSON.parse(configContent);
          
          // Check if module is already installed
          const existingModule = get().modules.find(m => m.name === config.name);
          if (existingModule) {
            throw new Error(`Module ${config.name} is already installed`);
          }
          
          // Process storage updates
          if (config.storageUpdates) {
            for (const [storageKey, updates] of Object.entries(config.storageUpdates)) {
              const currentData = JSON.parse(localStorage.getItem(storageKey) || '{}');
              
              for (const update of updates) {
                switch (update.action) {
                  case 'add':
                    if (update.data) {
                      const pathParts = update.path.split('.');
                      let current = currentData;
                      for (let i = 0; i < pathParts.length - 1; i++) {
                        current[pathParts[i]] = current[pathParts[i]] || {};
                        current = current[pathParts[i]];
                      }
                      current[pathParts[pathParts.length - 1]] = update.data;
                    }
                    break;
                    
                  case 'update':
                    if (update.data) {
                      const pathParts = update.path.split('.');
                      let current = currentData;
                      for (let i = 0; i < pathParts.length - 1; i++) {
                        if (!current[pathParts[i]]) break;
                        current = current[pathParts[i]];
                      }
                      if (current[pathParts[pathParts.length - 1]] !== undefined) {
                        current[pathParts[pathParts.length - 1]] = update.data;
                      }
                    }
                    break;
                    
                  case 'delete':
                    const pathParts = update.path.split('.');
                    let current = currentData;
                    for (let i = 0; i < pathParts.length - 1; i++) {
                      if (!current[pathParts[i]]) break;
                      current = current[pathParts[i]];
                    }
                    delete current[pathParts[pathParts.length - 1]];
                    break;
                }
              }
              
              localStorage.setItem(storageKey, JSON.stringify(currentData));
            }
          }
          
          // Process file operations
          for (const fileOp of config.files) {
            const fileContent = contents.file(fileOp.path);
            if (fileContent) {
              const content = await fileContent.async('text');
              
              switch (fileOp.action) {
                case 'add':
                case 'update':
                  // In a real implementation, this would write to the filesystem
                  console.log(`Would ${fileOp.action} file: ${fileOp.path}`);
                  console.log('Content:', content);
                  break;
                  
                case 'delete':
                  // In a real implementation, this would delete from the filesystem
                  console.log(`Would delete file: ${fileOp.path}`);
                  break;
              }
            }
          }
          
          // Add module to installed list
          const newModule: InstalledModule = {
            id: Math.random().toString(36).substr(2, 9),
            name: config.name,
            version: config.version,
            description: config.description,
            author: config.author,
            installedAt: new Date().toISOString(),
            isActive: true,
            config
          };
          
          set(state => ({
            modules: [...state.modules, newModule]
          }));
          
        } catch (error) {
          console.error('Error installing module:', error);
          throw error;
        }
      },
      
      toggleModuleStatus: (moduleId: string) => {
        set(state => ({
          modules: state.modules.map(module =>
            module.id === moduleId
              ? { ...module, isActive: !module.isActive }
              : module
          )
        }));
      },
      
      uninstallModule: (moduleId: string) => {
        const module = get().modules.find(m => m.id === moduleId);
        if (!module) return;
        
        // Revert storage updates if possible
        if (module.config.storageUpdates) {
          for (const [storageKey, updates] of Object.entries(module.config.storageUpdates)) {
            const currentData = JSON.parse(localStorage.getItem(storageKey) || '{}');
            
            for (const update of updates) {
              switch (update.action) {
                case 'add':
                  // Delete added data
                  const addPathParts = update.path.split('.');
                  let addCurrent = currentData;
                  for (let i = 0; i < addPathParts.length - 1; i++) {
                    if (!addCurrent[addPathParts[i]]) break;
                    addCurrent = addCurrent[addPathParts[i]];
                  }
                  delete addCurrent[addPathParts[addPathParts.length - 1]];
                  break;
              }
            }
            
            localStorage.setItem(storageKey, JSON.stringify(currentData));
          }
        }
        
        // Remove module files
        for (const fileOp of module.config.files) {
          // In a real implementation, this would remove files from the filesystem
          console.log(`Would remove file: ${fileOp.path}`);
        }
        
        // Remove from installed modules
        set(state => ({
          modules: state.modules.filter(m => m.id !== moduleId)
        }));
      },
      
      getModule: (moduleId: string) => {
        return get().modules.find(m => m.id === moduleId);
      }
    }),
    {
      name: 'module-storage'
    }
  )
);