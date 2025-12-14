'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function AzureCommands() {
    const [activeTab, setActiveTab] = useState('login');
    const [activeDeployStep, setActiveDeployStep] = useState('step1');
    
    // Azure state
    const [subscriptionId, setSubscriptionId] = useState('{subscription-id}');
    const [subscriptionName, setSubscriptionName] = useState('{subscription-name}');
    const [resourceGroup, setResourceGroup] = useState('{resource-group}');
    const [webAppName, setWebAppName] = useState('{webapp-name}');
    const [projectPath, setProjectPath] = useState('{project-path}');
    const [environment, setEnvironment] = useState('staging');
    const [siteName, setSiteName] = useState('{site-name}');
    const [hostsFilePath, setHostsFilePath] = useState('{hosts-file-path}');
    
    // SSH Agent state
    const [sshDirectory, setSshDirectory] = useState('/home/site/.ssh');
    const [sshKeyName, setSshKeyName] = useState('{ssh-key-name}');

    const tabs = [
        { id: 'login', label: 'Login & Setup' },
        { id: 'tunnel', label: 'Create Tunnel' },
        { id: 'deploy', label: 'Deployment' },
        { id: 'ssh', label: 'SSH Agent' }
    ];

    const deploySteps = [
        { id: 'step1', label: 'Step 1: Login' },
        { id: 'step2', label: 'Step 2: Create Tunnel' },
        { id: 'step3', label: 'Step 3: Update Hosts' },
        { id: 'step4', label: 'Step 4: Deploy' }
    ];

    const commands = {
        login: {
            title: 'Azure Login',
            description: 'Authenticate and select subscription for Azure CLI operations',
            command: 'az login',
            additionalInfo: (
                <div className="mt-4 p-3 rounded-lg bg-gray-800 border border-gray-700">
                    <div className="text-sm font-medium   description      !text-blue-400 mb-2">After login:</div>
                    <div className="text-sm text-gray-300 font-quicksand space-y-1">
                        <div>1. Browser will open for authentication</div>
                        <div>2. Select your account and authenticate</div>
                        <div>3. Choose subscription: <code className="text-green-400">{subscriptionName}</code></div>
                    </div>
                </div>
            ),
            input: (
                <div className="space-y-3 mt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Subscription Name</label>
                        <input
                            type="text"
                            value={subscriptionName}
                            onChange={(e) => setSubscriptionName(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., Production Subscription"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Subscription ID (optional)</label>
                        <input
                            type="text"
                            value={subscriptionId}
                            onChange={(e) => setSubscriptionId(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., 9590d10c-b8bd-443a-b9f6-b24d93058568"
                        />
                    </div>
                </div>
            )
        },
        tunnel: {
            title: 'Create Remote Connection Tunnel',
            description: 'Create a tunnel to Azure Web App for remote debugging or deployment',
            command: `az webapp create-remote-connection --subscription ${subscriptionId} --resource-group ${resourceGroup} -n ${webAppName} &`,
            additionalInfo: (
                <div className="mt-4 p-3 rounded-lg bg-gray-800 border border-gray-700">
                    <div className="text-sm font-medium description !text-blue-400 mb-2">Important Notes:</div>
                    <div className="text-sm text-gray-300 font-quicksand space-y-2">
                        <div>• The port number changes every time you run this command</div>
                        <div>• Copy the port number from the output (e.g., <code className="text-green-400">127.0.0.1:&lt;port&gt;</code>)</div>
                        <div>• Paste this port in your project's hosts configuration file</div>
                        <div>• Keep this terminal running while using the tunnel</div>
                        <div>• To stop the tunnel, press <code className="text-green-400">Ctrl+C</code> or kill the process</div>
                    </div>
                </div>
            ),
            input: (
                <div className="space-y-3 mt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Subscription ID</label>
                        <input
                            type="text"
                            value={subscriptionId}
                            onChange={(e) => setSubscriptionId(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., 9590d10c-b8bd-443a-b9f6-b24d93058568"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Resource Group</label>
                        <input
                            type="text"
                            value={resourceGroup}
                            onChange={(e) => setResourceGroup(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., my-resource-group-rg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Web App Name</label>
                        <input
                            type="text"
                            value={webAppName}
                            onChange={(e) => setWebAppName(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., app-wp-stg-myapp"
                        />
                    </div>
                </div>
            )
        },
        deploy: {
            title: 'Deployment Process',
            description: 'Complete deployment workflow for Azure Web Apps'
        },
        ssh: {
            title: 'SSH Agent Management',
            description: 'Manage SSH agent and keys for Git operations on Azure App Services',
            command: `eval \`ssh-agent\`\nssh-add ${sshDirectory}/${sshKeyName}`,
            additionalInfo: (
                <div className="mt-4 p-3 rounded-lg bg-gray-800 border border-gray-700">
                    <div className="text-sm font-medium description !text-blue-400 mb-2">When to use:</div>
                    <div className="text-sm text-gray-300 font-quicksand space-y-2">
                        <div>• Use these commands when you need to perform Git operations (pull, push, clone) on Azure App Services</div>
                        <div>• Required when connecting to private Git repositories (GitHub, Bitbucket, GitLab, etc.)</div>
                        <div>• The SSH agent must be running before executing Git commands that require authentication</div>
                        <div>• These commands authenticate your SSH key with the Git provider for the current session</div>
                        <div>• The SSH key must already be configured in your Azure App Service (typically in <code className="text-green-400">/home/site/.ssh/</code>)</div>
                    </div>
                    <div className="text-sm font-medium description !text-blue-400 mb-2 mt-4">Notes:</div>
                    <div className="text-sm text-gray-300 font-quicksand space-y-2">
                        <div>• <code className="text-green-400">eval \`ssh-agent\`</code> starts the SSH agent and sets environment variables</div>
                        <div>• <code className="text-green-400">ssh-add</code> adds your private key to the SSH agent</div>
                        <div>• You need to run these commands in each new SSH session to Azure App Service</div>
                        <div>• Make sure your SSH public key is added to your Git provider (GitHub/Bitbucket) settings</div>
                    </div>
                </div>
            ),
            input: (
                <div className="space-y-3 mt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">SSH Directory</label>
                        <input
                            type="text"
                            value={sshDirectory}
                            onChange={(e) => setSshDirectory(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="/home/site/.ssh"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">SSH Key Name</label>
                        <input
                            type="text"
                            value={sshKeyName}
                            onChange={(e) => setSshKeyName(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., app-service-key"
                        />
                    </div>
                </div>
            )
        }
    };

    const getDeployCommand = () => {
        switch (activeDeployStep) {
            case 'step1':
                return 'az login';
            case 'step2':
                return `az webapp create-remote-connection --subscription ${subscriptionId} --resource-group ${resourceGroup} -n ${webAppName} &`;
            case 'step3':
                return `# Update ${hostsFilePath} with the port from Step 2\n# Example: localhost:12345`;
            case 'step4':
                return `cd ${projectPath}\ntrellis deploy ${environment} ${siteName}`;
            default:
                return '';
        }
    };

    const getDeployDescription = () => {
        switch (activeDeployStep) {
            case 'step1':
                return 'Authenticate with Azure CLI';
            case 'step2':
                return 'Create remote connection and note the port number';
            case 'step3':
                return 'Add the tunnel port to your hosts configuration';
            case 'step4':
                return 'Run deployment command in project directory';
            default:
                return '';
        }
    };

    const renderDeployInputs = () => {
        switch (activeDeployStep) {
            case 'step1':
                return null; // No inputs needed for login
            case 'step2':
                return (
                    <div className="space-y-3 mt-2 mb-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Subscription ID</label>
                                <input
                                    type="text"
                                    value={subscriptionId}
                                    onChange={(e) => setSubscriptionId(e.target.value)}
                                    className="w-full p-2 rounded-md bg-gray-700 text-white"
                                    placeholder="{subscription-id}"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Resource Group</label>
                                <input
                                    type="text"
                                    value={resourceGroup}
                                    onChange={(e) => setResourceGroup(e.target.value)}
                                    className="w-full p-2 rounded-md bg-gray-700 text-white"
                                    placeholder="{resource-group}"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Web App Name</label>
                            <input
                                type="text"
                                value={webAppName}
                                onChange={(e) => setWebAppName(e.target.value)}
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                                placeholder="{webapp-name}"
                            />
                        </div>
                    </div>
                );
            case 'step3':
                return (
                    <div className="space-y-3 mt-2 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Hosts File Path</label>
                            <input
                                type="text"
                                value={hostsFilePath}
                                onChange={(e) => setHostsFilePath(e.target.value)}
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                                placeholder="e.g., trellis/hosts/staging"
                            />
                        </div>
                    </div>
                );
            case 'step4':
                return (
                    <div className="space-y-3 mt-2 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Project Path</label>
                            <input
                                type="text"
                                value={projectPath}
                                onChange={(e) => setProjectPath(e.target.value)}
                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                                placeholder="e.g., /path/to/project"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Environment</label>
                                <select
                                    value={environment}
                                    onChange={(e) => setEnvironment(e.target.value)}
                                    className="w-full p-2 rounded-md bg-gray-700 text-white"
                                >
                                    <option value="staging">staging</option>
                                    <option value="production">production</option>
                                    <option value="development">development</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Site Name</label>
                                <input
                                    type="text"
                                    value={siteName}
                                    onChange={(e) => setSiteName(e.target.value)}
                                    className="w-full p-2 rounded-md bg-gray-700 text-white"
                                    placeholder="e.g., example.com"
                                />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const activeCommand = commands[activeTab];

    return (
        <div className="w-full">
            <h3 className="text-xl font-semibold !text-blue-400 mb-4">Azure</h3>
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

            <div className="p-1 component-bg rounded-lg">
                {activeTab === 'deploy' ? (
                    <>
                        <h4 className="text-lg font-quicksand font-medium mb-2">{activeCommand.title}</h4>
                        <div className="text-sm description mb-3">{activeCommand.description}</div>
                        
                        {renderDeployInputs()}

                        <div className="flex space-x-2 overflow-x-auto p-1.5 tab-bg rounded-lg mb-4 shadow-sm dark:shadow-none">
                            {deploySteps.map((step) => (
                                <button
                                    key={step.id}
                                    onClick={() => setActiveDeployStep(step.id)}
                                    className={`px-4 py-2 text-sm whitespace-nowrap font-medium rounded-md transition-colors ${
                                        activeDeployStep === step.id
                                            ? 'bg-blue-600 text-white !cursor-default shadow-md'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {step.label}
                                </button>
                            ))}
                        </div>

                        <div className="mt-4">
                            <div className="text-sm font-medium description !text-blue-400 mb-2">{deploySteps.find(s => s.id === activeDeployStep)?.label}</div>
                            <div className="text-xs description text-gray-400 mb-2">{getDeployDescription()}</div>
                            <CodeSnippet code={getDeployCommand()} language="bash" />
                        </div>
                    </>
                ) : (
                    <>
                        <h4 className="text-lg font-quicksand font-medium mb-2">{activeCommand.title}</h4>
                        <div className="text-sm description mb-3">{activeCommand.description}</div>
                        {activeCommand.input}
                        <div className="mt-4">
                            <CodeSnippet code={activeCommand.command} language="bash" />
                        </div>
                        {activeCommand.additionalInfo && activeCommand.additionalInfo}
                    </>
                )}
            </div>
        </div>
    );
}

