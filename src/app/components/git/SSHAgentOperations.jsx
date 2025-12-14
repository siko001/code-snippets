'use client';

export default function SSHAgentOperations({ handleInputChange, inputValues, setInputValues }) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">SSH Directory</label>
                <input
                    type="text"
                    value={inputValues.sshDirectory || ''}
                    onChange={(e) => handleInputChange('sshDirectory', e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-700 text-white"
                    placeholder="/home/site/.ssh or ~/.ssh"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">SSH Key Name</label>
                <input
                    type="text"
                    value={inputValues.sshKeyName || ''}
                    onChange={(e) => handleInputChange('sshKeyName', e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-700 text-white"
                    placeholder="e.g., id_rsa, github_key, app-service-key"
                />
            </div>
            <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                <div className="text-sm font-medium description !text-blue-400 mb-2">When to use:</div>
                <div className="text-sm text-gray-300 font-quicksand space-y-2">
                    <div>• Use these commands when you need to perform Git operations (pull, push, clone) that require SSH authentication</div>
                    <div>• Required when connecting to private Git repositories (GitHub, Bitbucket, GitLab, etc.)</div>
                    <div>• Commonly needed on Azure App Services, remote servers, or when your local SSH agent isn't running</div>
                    <div>• The SSH agent must be running before executing Git commands that require authentication</div>
                    <div>• These commands authenticate your SSH key with the Git provider for the current session</div>
                </div>
                <div className="text-sm font-medium description !text-blue-400 mb-2 mt-4">Notes:</div>
                <div className="text-sm text-gray-300 font-quicksand space-y-2">
                    <div>• <code className="text-green-400">eval \`ssh-agent\`</code> starts the SSH agent and sets environment variables</div>
                    <div>• <code className="text-green-400">ssh-add</code> adds your private key to the SSH agent</div>
                    <div>• You need to run these commands in each new terminal/SSH session</div>
                    <div>• Make sure your SSH public key is added to your Git provider (GitHub/Bitbucket) settings</div>
                    <div>• On local machines, you may need to add keys to your SSH config or use keychain for persistence</div>
                </div>
            </div>
        </div>
    );
}

