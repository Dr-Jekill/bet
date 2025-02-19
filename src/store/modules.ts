import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ModuleSchema, InstalledModule } from '../types/module';
import JSZip from 'jszip';

interface ModuleState {
  installedModules: InstalledModule[];
  installModule: (moduleZip: File) => Promise<void>;
  toggleModuleStatus: (moduleId: string) => void;
  uninstallModule: (moduleId: string) => void;
  getModule: (moduleId: string) => InstalledModule | undefined;
}

export const useModuleStore = create<ModuleState>()(
  persist(
    (set, get) => ({
      installedModules: [],
      
      installModule: async (moduleZip: File) => {
        try {
          const zip = new JSZip();
          const contents = await zip.loadAsync(moduleZip);
          
          // Read and validate module.json
          const moduleConfigFile = contents.file('module.json');
          if (!moduleConfigFile) {
            throw new Error('Invalid module: module.json not found');
          }
          
          const moduleConfigText = await moduleConfigFile.async('text');
          const moduleConfig: ModuleSchema = JSON.parse(moduleConfigText);
          
          // Check if module is already installed
          if (get().installedModules.some(m => m.id === moduleConfig.id)) {
            throw new Error('Module is already installed');
          }
          
          // Process module files
          for (const file of moduleConfig.files) {
            const zipFile = contents.file(file.path);
            if (!zipFile) continue;
            
            const content = await zipFile.async('text');
            
            // Here you would implement the actual file operations
            // For now, we'll just log them
            console.log(`Would ${file.action} file at ${file.path}`);
            console.log('Content:', content);
          }
          
          // Add to installed modules
          const installedModule: InstalledModule = {
            ...moduleConfig,
            isActive: true,
            installedAt: new Date().toISOString()
          };
          
          set(state => ({
            installedModules: [...state.installedModules, installedModule]
          }));
          
        } catch (error) {
          console.error('Error installing module:', error);
          throw error;
        }
      },
      
      toggleModuleStatus: (moduleId: string) => {
        set(state => ({
          installedModules: state.installedModules.map(module => 
            module.id === moduleId 
              ? { ...module, isActive: !module.isActive }
              : module
          )
        }));
      },
      
      uninstallModule: (moduleId: string) => {
        // Here you would implement cleanup of installed files
        set(state => ({
          installedModules: state.installedModules.filter(
            module => module.id !== moduleId
          )
        }));
      },
      
      getModule: (moduleId: string) => {
        return get().installedModules.find(module => module.id === moduleId);
      }
    }),
    {
      name: 'modules-storage'
    }
  )
);