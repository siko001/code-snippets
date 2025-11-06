'use client';

const RemoteOperations = ({ handleInputChange, inputValues, setInputValues }) => {
    const handleRemoteOperation = (operation) => {
        setInputValues(prev => ({
            ...prev,
            operation,
            // Reset branch when changing operations
            ...(operation !== prev.operation && { branch: '' })
        }));
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        handleInputChange(name, value);
        
        // If setting a new remote, also update the defaultRemote
        if (name === 'remote') {
            handleInputChange('defaultRemote', value);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-300">Remote Operations</h4>
                
                {/* Remote Selection */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-300 text-sm">Remote:</span>
                        <input
                            type="text"
                            name="remote"
                            value={inputValues.remote || 'origin'}
                            onChange={handleInput}
                            className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 text-sm"
                            placeholder="remote name"
                        />
                    </div>
                </div>

                {/* Operation Selection */}
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => handleRemoteOperation('push')}
                        className={`px-3 py-1 rounded text-sm ${inputValues.operation === 'push' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        Push
                    </button>
                    <button
                        type="button"
                        onClick={() => handleRemoteOperation('pull')}
                        className={`px-3 py-1 rounded text-sm ${inputValues.operation === 'pull' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        Pull
                    </button>
                    <button
                        type="button"
                        onClick={() => handleRemoteOperation('fetch')}
                        className={`px-3 py-1 rounded text-sm ${inputValues.operation === 'fetch' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        Fetch
                    </button>
                </div>

                {/* Branch Selection - Hidden for fetch operation */}
                {inputValues.operation !== 'fetch' && (
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-300 text-sm">Branch:</span>
                            <input
                                type="text"
                                name="branch"
                                value={inputValues.branch || ''}
                                onChange={(e) => handleInputChange('branch', e.target.value)}
                                className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 text-sm"
                                placeholder={inputValues.operation === 'push' 
                                    ? "branch to push (default: current)" 
                                    : "branch to pull (default: current)"}
                            />
                        </div>
                    </div>
                )}

                {/* Push/Pull Options */}
                {inputValues.operation === 'push' && (
                    <div className="flex flex-wrap gap-2 items-center">
                        <label className="flex items-center space-x-2 text-gray-300 text-sm">
                            <input
                                type="checkbox"
                                name="setUpstream"
                                checked={inputValues.setUpstream === '--set-upstream'}
                                onChange={(e) => handleInputChange('setUpstream', e.target.checked ? '--set-upstream' : '')}
                                className="rounded border-gray-600 text-blue-500"
                            />
                            <span>Set upstream</span>
                        </label>
                        {inputValues.setUpstream && (
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-300 text-sm">as</span>
                                <input
                                    type="text"
                                    name="upstreamBranch"
                                    value={inputValues.upstreamBranch || inputValues.branch || 'main'}
                                    onChange={(e) => handleInputChange('upstreamBranch', e.target.value)}
                                    className="w-32 p-1 rounded bg-gray-700 text-white border border-gray-600 text-sm"
                                    placeholder="branch name"
                                />
                            </div>
                        )}
                    </div>
                )}

                {inputValues.operation === 'pull' && (
                    <div className="flex flex-wrap gap-2">
                        <label className="flex items-center space-x-2 text-gray-300 text-sm">
                            <input
                                type="checkbox"
                                name="rebase"
                                checked={inputValues.rebase === '--rebase'}
                                onChange={(e) => handleInputChange('rebase', e.target.checked ? '--rebase' : '')}
                                className="rounded border-gray-600 text-blue-500"
                            />
                            <span>Rebase instead of merge</span>
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RemoteOperations;
