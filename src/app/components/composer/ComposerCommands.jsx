'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';

const COMMAND_TYPES = {
    INSTALL: 'install',
    UPDATE: 'update',
    REQUIRE: 'require',
    REMOVE: 'remove'
};

const ComposerCommands = () => {
    const [packageName, setPackageName] = useState('');
    const [packageVersion, setPackageVersion] = useState('');
    const [isDev, setIsDev] = useState(false);
    const [activeCommand, setActiveCommand] = useState(COMMAND_TYPES.INSTALL);

    const getCommand = () => {
        const baseCommand = `composer ${activeCommand}`;
        
        switch(activeCommand) {
            case COMMAND_TYPES.INSTALL:
                return 'composer install';
            case COMMAND_TYPES.UPDATE:
                return packageName 
                    ? `composer update ${packageName}${packageVersion ? `:${packageVersion}` : ''}`
                    : 'composer update';
            case COMMAND_TYPES.REQUIRE:
                return `composer require ${packageName}${packageVersion ? `:${packageVersion}` : ''}${isDev ? ' --dev' : ''}`;
            case COMMAND_TYPES.REMOVE:
                return `composer remove ${packageName}`;
            default:
                return 'composer';
        }
    };

    const commandDescription = {
        [COMMAND_TYPES.INSTALL]: 'Install dependencies from composer.json',
        [COMMAND_TYPES.UPDATE]: packageName 
            ? `Update ${packageName} to ${packageVersion || 'latest version'}`
            : 'Update all dependencies to their latest versions',
        [COMMAND_TYPES.REQUIRE]: 'Add a new package to your project',
        [COMMAND_TYPES.REMOVE]: 'Remove a package from your project'
    };

    const isPackageRequired = [COMMAND_TYPES.UPDATE, COMMAND_TYPES.REQUIRE, COMMAND_TYPES.REMOVE].includes(activeCommand);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold !text-blue-400 mb-4">
                Managment
            </h3>
            {/* Command Selector */}
            <div className="flex gap-2 overflow-x-auto  tab-bg py-1.5 px-2 rounded-lg">
                {Object.entries(COMMAND_TYPES).map(([key, value]) => (
                    <button
                        key={key}
                        onClick={() => setActiveCommand(value)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeCommand === value 
                                ? 'bg-blue-600 text-white' 
                                : 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                        }`}
                    >
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                    </button>
                ))}
            </div>

            {/* Command Display */}
            <div className="space-y-4">
                <div className=" rounded-lg">
                    <CodeSnippet 
                        code={getCommand()}
                        className="mb-2"
                        copyButton={true}
                        disabled={isPackageRequired && !packageName}
                    />
                    <p className="text-xs description">
                        {commandDescription[activeCommand]}
                    </p>
                </div>

                {/* Package Options */}
                <div className="  rounded-lg">
                    {isPackageRequired && (
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm mb-1">
                                {activeCommand === COMMAND_TYPES.UPDATE && 'Package (optional for update all)'}
                                {activeCommand !== COMMAND_TYPES.UPDATE && 'Package Name'}
                            </label>
                            <input
                                type="text"
                                value={packageName}
                                onChange={(e) => setPackageName(e.target.value)}
                                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                placeholder="vendor/package"
                            />
                        </div>
                    )}

                    {(activeCommand === COMMAND_TYPES.UPDATE || activeCommand === COMMAND_TYPES.REQUIRE) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-300 text-sm mb-1">
                                    Version (optional)
                                </label>
                                <input
                                    type="text"
                                    value={packageVersion}
                                    onChange={(e) => setPackageVersion(e.target.value)}
                                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                    placeholder={activeCommand === COMMAND_TYPES.UPDATE ? "1.0.0" : "^1.0"}
                                />
                            </div>
                            {activeCommand === COMMAND_TYPES.REQUIRE && (
                                <div className="flex items-end">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="devDependency"
                                            checked={isDev}
                                            onChange={(e) => setIsDev(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                                        />
                                        <label htmlFor="devDependency" className="ml-2 text-sm text-gray-300">
                                            Require as dev dependency
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComposerCommands;
