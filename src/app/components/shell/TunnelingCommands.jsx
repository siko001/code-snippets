'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';
import YamlSnippet from '../YamlSnippet';

export default function TunnelingCommands() {
    const [activeTab, setActiveTab] = useState('cloudflared');
    
    // Cloudflared state
    const [tunnelName, setTunnelName] = useState('example-laravel');
    const [credentialsFile, setCredentialsFile] = useState('/Users/neilmallia/.cloudflared/0dbf19d1-e12b-41f3-b1bb-303c95630c9a.json');
    const [tunnelUuid, setTunnelUuid] = useState('0dbf19d1-e12b-41f3-b1bb-303c95630c9a');
    // Tunnel run state
    const [useConfigFile, setUseConfigFile] = useState(false);
    const [tunnelToRun, setTunnelToRun] = useState('');
    const [configFilePath, setConfigFilePath] = useState('~/.cloudflared/config.yml');
    const [hostname1, setHostname1] = useState('admin.example.com');
    const [port1, setPort1] = useState('8000');
    const [hostname2, setHostname2] = useState('api.example.com');
    const [port2, setPort2] = useState('9000');
    const [hostname3, setHostname3] = useState('something.example.com');
    const [port3, setPort3] = useState('3000');
    const [tunnelName2, setTunnelName2] = useState('example-api');
    const [tunnelUuid2, setTunnelUuid2] = useState('UUID_API');
    const [configFile1, setConfigFile1] = useState('~/.cloudflared/example.yml');
    const [configFile2, setConfigFile2] = useState('~/.cloudflared/example-api.yml');
    
    // ngrok state
    const [ngrokPort, setNgrokPort] = useState('3000');
    const [ngrokProtocol, setNgrokProtocol] = useState('http');
    const [ngrokHost, setNgrokHost] = useState('localhost');

    const tabs = [
        { id: 'cloudflared', label: 'Cloudflared' },
        { id: 'ngrok', label: 'ngrok' }
    ];

    const cloudflaredTabs = [
        { id: 'login', label: 'Login' },
        { id: 'single', label: 'Single Tunnel' },
        { id: 'multiple', label: 'Multiple Hostnames' },
        { id: 'multitunnel', label: 'Multiple Tunnels' },
        { id: 'runtunnel', label: 'Run Tunnel' }
    ];

    const [activeCloudflaredTab, setActiveCloudflaredTab] = useState('login');

    const generateCloudflaredConfig = (type) => {
        const baseConfig = `tunnel: ${tunnelName}
credentials-file: ${credentialsFile}

ingress:`;

        if (type === 'single') {
            return `${baseConfig}
  - hostname: ${hostname1}
    service: http://localhost:${port1}
  - service: http_status:404`;
        } else if (type === 'multiple') {
            let config = `${baseConfig}
  - hostname: ${hostname1}
    service: http://localhost:${port1}`;
            
            if (hostname2) {
                config += `\n  - hostname: ${hostname2}\n    service: http://localhost:${port2}`;
            }
            if (hostname3) {
                config += `\n  - hostname: ${hostname3}\n    service: http://localhost:${port3}`;
            }
            config += `\n  - service: http_status:404`;
            return config;
        }
        return baseConfig;
    };

    const cloudflaredCommands = {
        login: {
            title: 'Cloudflared Login',
            description: 'Authenticate with Cloudflare to create and manage tunnels',
            command: 'cloudflared login',
            input: null
        },
        runtunnel: {
            title: 'Run Cloudflare Tunnel',
            description: 'Start a Cloudflare tunnel using a tunnel name/UUID or config file',
            command: 'cloudflared tunnel run <TUNNEL_NAME_OR_UUID>',
            input: null
        },
        single: {
            title: 'Single Tunnel Setup',
            description: 'Create a tunnel with a single hostname',
            command: `cloudflared tunnel create ${tunnelName}`,
            config: generateCloudflaredConfig('single'),
            input: (
                <div className="space-y-3 mt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Tunnel Name</label>
                        <input
                            type="text"
                            value={tunnelName}
                            onChange={(e) => setTunnelName(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., example-laravel"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Credentials File Path</label>
                        <input
                            type="text"
                            value={credentialsFile}
                            onChange={(e) => setCredentialsFile(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="/Users/username/.cloudflared/UUID.json"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Hostname</label>
                        <input
                            type="text"
                            value={hostname1}
                            onChange={(e) => setHostname1(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., admin.example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Local Port</label>
                        <input
                            type="text"
                            value={port1}
                            onChange={(e) => setPort1(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., 8000"
                        />
                    </div>
                </div>
            )
        },
        multiple: {
            title: 'Multiple Hostnames - Single Tunnel',
            description: 'Configure multiple hostnames in one tunnel',
            command: `cloudflared tunnel create ${tunnelName}`,
            config: generateCloudflaredConfig('multiple'),
            input: (
                <div className="space-y-3 mt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Tunnel Name</label>
                        <input
                            type="text"
                            value={tunnelName}
                            onChange={(e) => setTunnelName(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Credentials File Path</label>
                        <input
                            type="text"
                            value={credentialsFile}
                            onChange={(e) => setCredentialsFile(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Hostname 1</label>
                            <input
                                type="text"
                                value={hostname1}
                                onChange={(e) => setHostname1(e.target.value)}
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Port 1</label>
                            <input
                                type="text"
                                value={port1}
                                onChange={(e) => setPort1(e.target.value)}
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Hostname 2</label>
                            <input
                                type="text"
                                value={hostname2}
                                onChange={(e) => setHostname2(e.target.value)}
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Port 2</label>
                            <input
                                type="text"
                                value={port2}
                                onChange={(e) => setPort2(e.target.value)}
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Hostname 3 (optional)</label>
                            <input
                                type="text"
                                value={hostname3}
                                onChange={(e) => setHostname3(e.target.value)}
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Port 3</label>
                            <input
                                type="text"
                                value={port3}
                                onChange={(e) => setPort3(e.target.value)}
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                        </div>
                    </div>
                </div>
            )
        },
        multitunnel: {
            title: 'Multiple Tunnels Setup',
            description: 'Configure separate tunnels for different services',
            command: `cloudflared tunnel create ${tunnelName}\ncloudflared tunnel create ${tunnelName2}`,
            input: (
                <div className="space-y-3 mt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Credentials Base Path</label>
                        <input
                            type="text"
                            value={credentialsFile.includes('/') ? credentialsFile.substring(0, credentialsFile.lastIndexOf('/')) : credentialsFile}
                            onChange={(e) => {
                                const lastSlash = credentialsFile.lastIndexOf('/');
                                if (lastSlash > 0) {
                                    const filename = credentialsFile.substring(lastSlash + 1);
                                    setCredentialsFile(e.target.value + '/' + filename);
                                } else {
                                    setCredentialsFile(e.target.value);
                                }
                            }}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="/Users/username/.cloudflared"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Tunnel 1 Name</label>
                            <input
                                type="text"
                                value={tunnelName}
                                onChange={(e) => setTunnelName(e.target.value)}
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Tunnel 1 UUID</label>
                            <input
                                type="text"
                                value={tunnelUuid}
                                onChange={(e) => setTunnelUuid(e.target.value)}
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Config File 1</label>
                        <input
                            type="text"
                            value={configFile1}
                            onChange={(e) => setConfigFile1(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Hostname 1</label>
                            <input
                                type="text"
                                value={hostname1}
                                onChange={(e) => setHostname1(e.target.value)}
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Port 1</label>
                            <input
                                type="text"
                                value={port1}
                                onChange={(e) => setPort1(e.target.value)}
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Tunnel 2 Name</label>
                            <input
                                type="text"
                                value={tunnelName2}
                                onChange={(e) => setTunnelName2(e.target.value)}
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Tunnel 2 UUID</label>
                            <input
                                type="text"
                                value={tunnelUuid2}
                                onChange={(e) => setTunnelUuid2(e.target.value)}
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Config File 2</label>
                        <input
                            type="text"
                            value={configFile2}
                            onChange={(e) => setConfigFile2(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Hostname 2</label>
                            <input
                                type="text"
                                value={hostname2}
                                onChange={(e) => setHostname2(e.target.value)}
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Port 2</label>
                            <input
                                type="text"
                                value={port2}
                                onChange={(e) => setPort2(e.target.value)}
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                            />
                        </div>
                    </div>
                </div>
            )
        }
    };

    const generateMultiTunnelConfigs = () => {
        const basePath = credentialsFile.includes('/') 
            ? credentialsFile.substring(0, credentialsFile.lastIndexOf('/'))
            : '/Users/neilmallia/.cloudflared';
        const config1 = `tunnel: ${tunnelUuid}
credentials-file: ${basePath}/${tunnelUuid}.json

ingress:
  - hostname: ${hostname1}
    service: http://localhost:${port1}
  - service: http_status:404`;

        const config2 = `tunnel: ${tunnelUuid2}
credentials-file: ${basePath}/${tunnelUuid2}.json

ingress:
  - hostname: ${hostname2}
    service: http://localhost:${port2}
  - service: http_status:404`;

        return { config1, config2 };
    };

    const activeCloudflaredCommand = cloudflaredCommands[activeCloudflaredTab];

    return (
        <div className="w-full">
            <h3 className="text-xl font-semibold !text-blue-400 mb-4">Tunneling</h3>
            <div className="flex space-x-2 overflow-x-auto p-1.5 tab-bg rounded-lg mb-4 shadow-sm dark:shadow-none">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm whitespace-nowrap font-medium rounded-md transition-colors ${
                            activeTab === tab.id
                                ? 'bg-blue-600 text-white !cursor-default shadow-md'
                                : 'text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'cloudflared' && (
                <div>
                    <div className="flex space-x-2 overflow-x-auto p-1.5 tab-bg rounded-lg mb-4 shadow-sm dark:shadow-none">
                        {cloudflaredTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveCloudflaredTab(tab.id)}
                                className={`px-4 py-2 text-sm whitespace-nowrap font-medium rounded-md transition-colors ${
                                    activeCloudflaredTab === tab.id
                                        ? 'bg-blue-600 text-white !cursor-default shadow-md'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-1 component-bg rounded-lg">
                        <h4 className="text-lg font-quicksand font-medium mb-2">{activeCloudflaredCommand.title}</h4>
                        <div className="text-sm description mb-3">{activeCloudflaredCommand.description}</div>
                        {activeCloudflaredCommand.input}
                        {activeCloudflaredTab !== 'runtunnel' && (
                            <div className="mt-4">
                                <CodeSnippet code={activeCloudflaredCommand.command} language="bash" />
                            </div>
                        )}
                        {activeCloudflaredCommand.config && (
                            <div className="mt-4">
                                <div className="text-sm font-medium font-quicksand text-gray-300 mb-2">Config File (~/.cloudflared/config.yml):</div>
                                <YamlSnippet code={activeCloudflaredCommand.config} />
                            </div>
                        )}
                        {activeCloudflaredTab === 'multitunnel' && (
                            <div className="mt-4 space-y-4">
                                <div>
                                    <div className="text-sm font-medium description text-gray-300 mb-2">{configFile1}:</div>
                                    <YamlSnippet code={generateMultiTunnelConfigs().config1} />
                                </div>
                                <div>
                                    <div className="text-sm description font-medium text-gray-300 mb-2">{configFile2}:</div>
                                    <YamlSnippet code={generateMultiTunnelConfigs().config2} />
                                </div>
                                <div className="mt-4">
                                    <div className="text-sm font-medium description text-gray-300 mb-2">Run Commands:</div>
                                    <CodeSnippet code={`cloudflared tunnel --config ${configFile1} run\ncloudflared tunnel --config ${configFile2} run`} language="bash" />
                                </div>
                            </div>
                        )}
                        {activeCloudflaredTab === 'runtunnel' && (
                            <div className="space-y-4 mt-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="useConfigFile"
                                        checked={useConfigFile}
                                        onChange={(e) => setUseConfigFile(e.target.checked)}
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="useConfigFile" className="text-sm font-medium text-gray-300">
                                        Use config file
                                    </label>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Tunnel Name or UUID</label>
                                    <input
                                        type="text"
                                        value={tunnelToRun}
                                        onChange={(e) => setTunnelToRun(e.target.value)}
                                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                                        placeholder="tunnel-name or xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                    />
                                </div>
                                
                                {useConfigFile && (
                                    <div className="mt-3">
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Config File Path</label>
                                        <input
                                            type="text"
                                            value={configFilePath}
                                            onChange={(e) => setConfigFilePath(e.target.value)}
                                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                                            placeholder="~/.cloudflared/config.yml"
                                        />
                                    </div>
                                )}
                                
                                <div className="mt-4">
                                    <div className="text-sm font-medium description text-gray-300 mb-2">Run Command:</div>
                                    <CodeSnippet 
                                        code={useConfigFile 
                                            ? `cloudflared tunnel --config ${configFilePath} run ${tunnelToRun || '<TUNNEL_NAME_OR_UUID>'} `
                                            : `cloudflared tunnel run ${tunnelToRun || '<TUNNEL_NAME_OR_UILD>'}`}
                                        language="bash" 
                                    />
                                    <div className="mt-2 text-xs text-gray-400">
                                        {useConfigFile 
                                            ? 'This will run the tunnel using the specified config file and tunnel name/UUID.'
                                            : 'This will run the tunnel using the default config location (~/.cloudflared/config.yml) and the specified tunnel name/UUID.'
                                        }
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'ngrok' && (
                <div className="p-1 component-bg rounded-lg">
                    <h4 className="text-lg font-quicksand font-medium mb-2">ngrok HTTP Tunnel</h4>
                    <div className="text-sm description mb-3">
                        Create a secure tunnel to your local server using ngrok
                    </div>
                    <div className="space-y-3 mt-2">
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Protocol</label>
                                <select
                                    value={ngrokProtocol}
                                    onChange={(e) => setNgrokProtocol(e.target.value)}
                                    className="w-full p-2 rounded-md bg-gray-700 text-white"
                                >
                                    <option value="http">http</option>
                                    <option value="https">https</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Host</label>
                                <input
                                    type="text"
                                    value={ngrokHost}
                                    onChange={(e) => setNgrokHost(e.target.value)}
                                    className="w-full p-2 rounded-md bg-gray-700 text-white"
                                    placeholder="localhost"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Port</label>
                                <input
                                    type="text"
                                    value={ngrokPort}
                                    onChange={(e) => setNgrokPort(e.target.value)}
                                    className="w-full p-2 rounded-md bg-gray-700 text-white"
                                    placeholder="3000"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <CodeSnippet code={`ngrok ${ngrokProtocol} ${ngrokHost}:${ngrokPort}`} language="bash" />
                    </div>
                    <div className="mt-4 p-3 rounded-lg bg-gray-800 border border-gray-700">
                        <div className="text-sm font-medium description !text-blue-400 mb-2">Useful ngrok Commands:</div>
                        <div className="space-y-2 text-sm text-gray-300">
                            <div><code className="text-green-400">ngrok http 3000</code> - <span className="description">Basic HTTP tunnel</span></div>
                            <div><code className="text-green-400">ngrok http 3000 --hostname=your-domain.com</code> - <span className="description">Custom domain</span></div>
                            <div><code className="text-green-400">ngrok http 3000 --region=eu</code> - <span className="description">Specify region</span></div>
                            <div><code className="text-green-400">ngrok http 3000 --basic-auth="user:pass"</code> - <span className="description">Add basic auth</span></div>
                            <div><code className="text-green-400">ngrok config check</code> - <span className="description">Check configuration</span></div>
                            <div><code className="text-green-400">ngrok api tunnels list</code> - <span className="description">List active tunnels</span></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

