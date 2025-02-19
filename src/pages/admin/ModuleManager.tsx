import React, { useState, useRef } from 'react';
import { useModuleStore } from '../../store/modules';
import { Package, Upload, Trash2, Power, AlertCircle } from 'lucide-react';

export default function ModuleManager() {
  const { modules, installModule, toggleModuleStatus, uninstallModule } = useModuleStore();
  const [error, setError] = useState<string | null>(null);
  const [installing, setInstalling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setInstalling(true);
      setError(null);
      await installModule(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error installing module');
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-indigo-500" />
            <h1 className="text-2xl font-semibold text-gray-900">Module Manager</h1>
          </div>
          <div>
            <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Upload Module
              <input
                ref={fileInputRef}
                type="file"
                accept=".rar,.zip"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Installation Error
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {installing && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-md">
            <div className="flex items-center">
              <div className="mr-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
              </div>
              <p className="text-sm text-indigo-700">Installing module...</p>
            </div>
          </div>
        )}
      </div>

      {/* Installed Modules */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Installed Modules
          </h2>

          <div className="space-y-4">
            {modules.map((module) => (
              <div
                key={module.id}
                className="border rounded-lg p-4 transition-colors hover:border-indigo-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {module.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {module.description}
                    </p>
                    <div className="mt-2 space-x-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        v{module.version}
                      </span>
                      <span className="text-xs text-gray-500">
                        by {module.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        Installed: {new Date(module.installedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleModuleStatus(module.id)}
                      className={`p-2 rounded-md ${
                        module.isActive
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={module.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <Power className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to uninstall this module?')) {
                          uninstallModule(module.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      title="Uninstall"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {modules.length === 0 && (
              <div className="text-center py-6">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Modules Installed
                </h3>
                <p className="text-gray-500">
                  Upload a module package to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}