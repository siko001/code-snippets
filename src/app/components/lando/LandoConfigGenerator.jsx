'use client';

import { useState } from 'react';
import YamlSnippet from '../YamlSnippet';

export default function LandoConfigGenerator() {
    const [config, setConfig] = useState({
        name: 'mysite',
        php: '8.3',
        via: 'nginx',
        webroot: '.',
        xdebug: false,
        databaseType: 'mariadb',
        includePma: true
    });

    const generateConfig = () => {
        const pmaSection = config.includePma ? `
  pma:
    type: phpmyadmin
    hosts:
      - database` : '';

        return `name: ${config.name}
recipe: wordpress
config:
  php: '${config.php}'
  via: ${config.via}
  webroot: ${config.webroot}
  xdebug: ${config.xdebug ? 'true' : 'false'}
services:
  database:
    type: ${config.databaseType}${pmaSection}
tooling:
  wp:
    service: appserver
    description: Run wp-cli commands
    cmd: wp`;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
                    <input
                        type="text"
                        name="name"
                        value={config.name}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                        placeholder="e.g., mysite"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">PHP Version</label>
                    <select
                        name="php"
                        value={config.php}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                    >
                        <option value="8.3">PHP 8.3</option>
                        <option value="8.2">PHP 8.2</option>
                        <option value="8.1">PHP 8.1</option>
                        <option value="8.0">PHP 8.0</option>
                        <option value="7.4">PHP 7.4</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Web Server</label>
                    <select
                        name="via"
                        value={config.via}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                    >
                        <option value="nginx">Nginx</option>
                        <option value="apache">Apache</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Database</label>
                    <select
                        name="databaseType"
                        value={config.databaseType}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                    >
                        <option value="mariadb">MariaDB</option>
                        <option value="mysql">MySQL</option>
                        <option value="postgres">PostgreSQL</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="xdebug"
                        checked={config.xdebug}
                        onChange={handleInputChange}
                        className="rounded bg-gray-700 border-gray-600"
                    />
                    <span className="text-sm text-gray-300">Enable Xdebug</span>
                </label>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="includePma"
                        checked={config.includePma}
                        onChange={handleInputChange}
                        className="rounded bg-gray-700 border-gray-600"
                    />
                    <span className="text-sm text-gray-300">Include phpMyAdmin</span>
                </label>
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">Webroot</span>
                </div>
                <input
                    type="text"
                    name="webroot"
                    value={config.webroot}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md bg-gray-700 text-white"
                    placeholder="e.g., web"
                />
                <p className="text-xs text-gray-400 mt-1">
                    Relative path to your web root directory (e.g., '.', 'web', 'docroot')
                </p>
            </div>

            <div className="mt-6">
                <h4 className="text-lg font-medium text-white mb-2">Lando Configuration</h4>
                <p className="text-gray-300 text-sm mb-3">
                    Save this as <code className="bg-gray-700 px-1 py-0.5 rounded">.lando.yml</code> in your project root
                </p>
                <YamlSnippet code={generateConfig()} />
            </div>

            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mt-6">
                <h4 className="text-md font-medium text-blue-300 mb-2">After saving the configuration:</h4>
                <div className="space-y-2">
                    <p className="text-sm text-blue-200">1. Run <code className="bg-blue-900/50 px-1.5 py-0.5 rounded">lando start</code> to start your environment</p>
                    <p className="text-sm text-blue-200">2. Access your site at <code className="bg-blue-900/50 px-1.5 py-0.5 rounded">https://{config.name}.lndo.site</code></p>
                    {config.includePma && (
                        <p className="text-sm text-blue-200">3. Access phpMyAdmin at <code className="bg-blue-900/50 px-1.5 py-0.5 rounded">https://pma.{config.name}.lndo.site</code></p>
                    )}
                </div>
            </div>
        </div>
    );
}
