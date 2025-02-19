import React, { useState, useRef } from 'react';
import { useModuleStore } from '../../store/modules';
import { Package, Upload, ToggleLeft, ToggleRight, Trash2, Database, FileText } from 'lucide-react';
import type { InstalledModule } from '../../types/module';

export default function ModuleManager() {
  const {
    installedModules,
    installModule,
    toggleModuleStatus,
    uninstallModule
  } = useModuleStore();
  
  const [selectedModule, setSelectedModule] = useState<InstalledModule | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsInstalling(true);
      await installModule(file);
      event.target.value = '';
    } catch (error) {
      console.error('Failed to install module:', error);
      alert('Failed to install module. Please check the console for details.');
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Module List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Installed Modules
                    </h2>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      disabled={isInstalling}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isInstalling ? 'Installing...' : 'Install Module'}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".zip"
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-4">
                    {installedModules.map((module) => (
                      <div
                        key={module.id}
                        className="border rounded-lg p-4 hover:border-indigo-500 cursor-pointer transition-colors"
                        onClick={() => setSelectedModule(module)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            <Package className="h-5 w-5 text-gray-400" />
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {module.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                v{module.version}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleModuleStatus(module.id);
                              }}
                              className={`p-1 rounded-md ${
                                module.isActive
                                  ? 'text-green-600 hover:text-green-700'
                                  : 'text-gray-400 hover:text-gray-500'
                              }`}
                            >
                              {module.isActive ? (
                                <ToggleRight className="h-6 w-6" />
                              ) : (
                                <ToggleLeft className="h-6 w-6" />
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Are you sure you want to uninstall this module?')) {
                                  uninstallModule(module.id);
                                }
                              }}
                              className="p-1 rounded-md text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {installedModules.length === 0 && (
                      <div className="text-center py-8">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No modules installed
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Get started by installing a new module.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Module Details */}
            <div className="lg:col-span-1">
              {selectedModule ? (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Module Details
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Name</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedModule.name}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Version</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedModule.version}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Author</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedModule.author}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedModule.description}
                        </p>
                      </div>
                      
                      {selectedModule.dependencies && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Dependencies</h3>
                          <ul className="mt-1 text-sm text-gray-900 list-disc list-inside">
                            {selectedModule.dependencies.map((dep) => (
                              <li key={dep}>{dep}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedModule.database && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 flex items-center">
                            <Database className="h-4 w-4 mr-1" />
                            Database Schema
                          </h3>
                          <div className="mt-2 space-y-2">
                            {selectedModule.database.tables.map((table) => (
                              <div key={table.name} className="border rounded p-2">
                                <p className="font-medium">{table.name}</p>
                                <p className="text-xs text-gray-500">{table.description}</p>
                                <div className="mt-1">
                                  {table.columns.map((column) => (
                                    <div key={column.name} className="text-xs">
                                      <span className="font-medium">{column.name}</span>
                                      <span className="text-gray-500"> ({column.type})</span>
                                      {column.nullable && <span className="text-gray-400"> nullable</span>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          Files
                        </h3>
                        <div className="mt-2 space-y-1">
                          {selectedModule.files.map((file) => (
                            <div key={file.path} className="text-xs">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-xs mr-1 ${
                                file.action === 'create' ? 'bg-green-100 text-green-800' :
                                file.action === 'update' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {file.action}
                              </span>
                              {file.path}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Installation Date</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedModule.installedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No module selected
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select a module to view its details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}