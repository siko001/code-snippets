'use client';

import { useState } from 'react';
import YamlSnippet from '../YamlSnippet';

const RECIPES = {
    wordpress: {
        name: 'WordPress',
        description: 'Standard WordPress setup with PHP, web server, and database',
        defaultWebroot: '.',
        defaultVia: 'nginx',
        services: (config) => {
            const pmaSection = config.includePma ? `
  pma:
    type: phpmyadmin
    hosts:
      - database` : '';
            
            return `  database:
    type: ${config.databaseType}${pmaSection}`;
        },
        tooling: `  wp:
    service: appserver
    description: Run wp-cli commands
    cmd: wp`
    },
    drupal9: {
        name: 'Drupal 9/10',
        description: 'Drupal 9/10 with Drush and Composer support',
        defaultWebroot: 'web',
        defaultVia: 'apache',
        services: (config) => {
            return `  database:
    type: ${config.databaseType}`;
        },
        tooling: `  drush:
    service: appserver
    cmd: /app/vendor/bin/drush
  composer:
    service: appserver
    cmd: /usr/local/bin/composer`
    },
    laravel: {
        name: 'Laravel',
        description: 'Laravel with Node.js and Composer',
        defaultWebroot: 'public',
        defaultVia: 'nginx',
        services: (config) => {
            return `  database:
    type: ${config.databaseType}
  node:
    type: node:18`;
        },
        tooling: `  artisan:
    service: appserver
    cmd: php artisan
  composer:
    service: appserver
    cmd: /usr/local/bin/composer`
    },
    custom: {
        name: 'Custom',
        description: 'Custom configuration',
        defaultWebroot: '.',
        defaultVia: 'nginx',
        services: () => '',
        tooling: ''
    }
};

export default function LandoConfigGenerator() {
    const [config, setConfig] = useState({
        name: 'mysite',
        recipe: 'wordpress',
        php: '8.3',
        via: RECIPES.wordpress.defaultVia,
        webroot: RECIPES.wordpress.defaultWebroot,
        xdebug: false,
        databaseType: 'mariadb',
        includePma: true,
        customConfig: '',
        customServices: '',
        customTooling: ''
    });

    const currentRecipe = RECIPES[config.recipe] || RECIPES.wordpress;

    const generateConfig = () => {
        const services = typeof currentRecipe.services === 'function' 
            ? currentRecipe.services(config)
            : currentRecipe.services || '';
            
        const tooling = currentRecipe.tooling || '';

        let yamlConfig = `name: ${config.name}
recipe: ${config.recipe}
`;

        // Add main config
        yamlConfig += `config:
  php: '${config.php}'
  via: ${config.via}
  webroot: ${config.webroot}
  xdebug: ${config.xdebug ? 'true' : 'false'}
`;

        // Add custom config if any
        if (config.customConfig) {
            yamlConfig += `  # Custom Configuration
${config.customConfig}
`;
        }

        // Add services
        yamlConfig += `services:${services}
`;

        // Add custom services if any
        if (config.customServices) {
            yamlConfig += `  # Custom Services
${config.customServices}
`;
        }

        // Add tooling
        if (tooling) {
            yamlConfig += `tooling:${tooling}
`;
        }

        // Add custom tooling if any
        if (config.customTooling) {
            yamlConfig += `  # Custom Tooling
${config.customTooling}
`;
        }

        return yamlConfig;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        setConfig(prev => {
            const newConfig = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };
            
            // Update dependent fields when recipe changes
            if (name === 'recipe' && RECIPES[value]) {
                const recipe = RECIPES[value];
                newConfig.via = recipe.defaultVia;
                newConfig.webroot = recipe.defaultWebroot;
            }
            
            return newConfig;
        });
    };

    return (
        <div className="space-y-6">
            <h3  className="text-xl font-semibold !text-blue-400 mb-4">Config</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium description mb-1">Project Name</label>
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
                    <label className="block text-sm font-medium description mb-1">Recipe</label>
                    <select
                        name="recipe"
                        value={config.recipe}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                    >
                        {Object.entries(RECIPES).map(([value, { name }]) => (
                            <option key={value} value={value}>{name}</option>
                        ))}
                    </select>
                    <p className="text-xs description mt-1">
                        {currentRecipe.description}
                    </p>
                </div>
                
                <div>
                    <label className="block text-sm font-medium description mb-1">PHP Version</label>
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
                    <label className="block text-sm font-medium description mb-1">Web Server</label>
                    <select
                        name="via"
                        value={config.via}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                    >
                        <option value="nginx">Nginx</option>
                        <option value="apache">Apache</option>
                        <option value="apache:2.4">Apache 2.4</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium description mb-1">Database</label>
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
                    <span className="text-sm description">Enable Xdebug</span>
                </label>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="includePma"
                        checked={config.includePma}
                        onChange={handleInputChange}
                        className="rounded bg-gray-700 border-gray-600"
                    />
                    <span className="text-sm description">Include phpMyAdmin</span>
                </label>
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium description">Webroot</span>
                </div>
                <input
                    type="text"
                    name="webroot"
                    value={config.webroot}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md bg-gray-700 text-white"
                    placeholder={currentRecipe.defaultWebroot}
                />
                <p className="text-xs description mt-1">
                    Relative path to your web root directory (e.g., '{currentRecipe.defaultWebroot}', 'web', 'public')
                </p>
            </div>

            <div className="mt-6">
                <h4 className="text-lg font-medium font-quicksand text-white mb-2">Lando Configuration</h4>
                <p className="description text-sm mb-3">
                    Save this as <code className="dark:bg-gray-700 bg-gray-200 px-1 py-0.5 rounded">.lando.yml</code> in your project root
                </p>
                <YamlSnippet code={generateConfig()} />
            </div>

            <div className="bg-blue-900/20 font-quicksand border border-blue-800 rounded-lg p-4 mt-6">
                <h4 className="text-md font-medium dark:text-blue-300 text-blue-500 mb-2">After saving the configuration:</h4>
                <div className="space-y-2">
                    <p className="text-sm dark:text-blue-200 text-blue-500">1. Run <code className="dark:bg-blue-900/50 bg-blue-300 px-1.5 py-0.5 rounded">lando start</code> to start your environment</p>
                    <p className="text-sm dark:text-blue-200 text-blue-500">2. Access your site at <code className="dark:bg-blue-900/50 bg-blue-300 px-1.5 py-0.5 rounded">https://{config.name}.lndo.site</code></p>
                    {config.includePma && (
                        <p className="text-sm dark:text-blue-200 text-blue-500">3. Access phpMyAdmin at <code className="dark:bg-blue-900/50 bg-blue-300 px-1.5 py-0.5 rounded">https://pma.{config.name}.lndo.site</code></p>
                    )}
                </div>
            </div>
        </div>
    );
}
