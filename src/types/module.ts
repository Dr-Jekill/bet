export interface ModuleConfig {
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies?: string[];
  storageUpdates?: {
    [key: string]: {
      action: 'add' | 'update' | 'delete';
      path: string;
      data?: any;
    }[];
  };
  files: {
    action: 'add' | 'update' | 'delete';
    path: string;
    content?: string;
  }[];
}

export interface InstalledModule {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  installedAt: string;
  isActive: boolean;
  config: ModuleConfig;
}