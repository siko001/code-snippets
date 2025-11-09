'use client';

const StashOperations = ({ handleInputChange, inputValues, setInputValues }) => {
    const handleStashOperation = (operation) => {
        setInputValues(prev => ({
            ...prev,
            stashOperation: operation,
            // Reset related fields when changing operations
            ...(operation !== prev.stashOperation && { 
                message: '',
                stashRef: '',
                includeIndex: false
            })
        }));
    };

    return (
        <div className="space-y-4">
            <div className="space-y-4">
    
                
                {/* Operation Selection */}
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => handleStashOperation('none')}
                        className={`px-3 py-1 rounded text-sm ${!inputValues.stashOperation || inputValues.stashOperation === 'none' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        None
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => handleStashOperation('push')}
                        className={`px-3 py-1 rounded text-sm ${inputValues.stashOperation === 'push' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        Push
                    </button>
                    <button
                        type="button"
                        onClick={() => handleStashOperation('pop')}
                        className={`px-3 py-1 rounded text-sm ${inputValues.stashOperation === 'pop' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        Pop
                    </button>
                    <button
                        type="button"
                        onClick={() => handleStashOperation('apply')}
                        className={`px-3 py-1 rounded text-sm ${inputValues.stashOperation === 'apply' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        Apply
                    </button>
                    <button
                        type="button"
                        onClick={() => handleStashOperation('drop')}
                        className={`px-3 py-1 rounded text-sm ${inputValues.stashOperation === 'drop' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        Drop
                    </button>
                    <button
                        type="button"
                        onClick={() => handleStashOperation('list')}
                        className={`px-3 py-1 rounded text-sm ${inputValues.stashOperation === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        List
                    </button>
                </div>

                {/* Stash Message (for push operation) */}
                {inputValues.stashOperation === 'push' && (
                    <div>
                        <label className="block text-gray-300 mb-2">Stash Message (optional):</label>
                        <input
                            type="text"
                            value={inputValues.message || ''}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            placeholder="WIP: working on feature"
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        />
                        <p className="text-sm description text-gray-400 mt-2">
                            Use <code className="dark:bg-gray-700  bg-gray-200 px-1 rounded">git stash</code> for a quick stash without a message
                        </p>
                    </div>
                )}

                {/* Stash Reference (for pop/apply/drop) */}
                {['pop', 'apply', 'drop'].includes(inputValues.stashOperation) && (
                    <div>
                        <label className="block text-gray-300 mb-2">
                            {inputValues.stashOperation === 'drop' 
                                ? 'Stash to drop (defaults to most recent):' 
                                : 'Stash reference (optional):'}
                        </label>
                        <input
                            type="text"
                            value={inputValues.stashRef || ''}
                            onChange={(e) => handleInputChange('stashRef', e.target.value)}
                            placeholder="stash@{0}"
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        />
                        <p className="text-sm font-quicksand text-gray-400 mt-2">
                            {inputValues.stashOperation === 'drop' 
                                ? 'Use with caution - this action cannot be undone!'
                                : 'Leave empty for the most recent stash'}
                        </p>
                    </div>
                )}

                {/* Additional options for apply */}
                {inputValues.stashOperation === 'apply' && (
                    <div className="mt-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={inputValues.includeIndex || false}
                                onChange={(e) => handleInputChange('includeIndex', e.target.checked)}
                                className="rounded border-gray-600 text-blue-500"
                            />
                            <span className="description">Include staged changes (--index)</span>
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StashOperations;
