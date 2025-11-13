'use client';

const UndoOperations = ({ handleInputChange, inputValues, setInputValues }) => {
    const handleUndoOperation = (operation) => {
        setInputValues(prev => ({
            ...prev,
            undoOperation: operation,
            // Reset related fields when changing operations
            ...(operation !== prev.undoOperation && { 
                files: '',
                commit: '',
                softReset: false,
                mixedReset: false,
                hardReset: false
            })
        }));
    };

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                
                {/* Operation Selection */}
                <div className="flex tab-bg px-2 py-1.5 rounded overflow-x-auto  gap-2">
                    <button
                        type="button"
                        onClick={() => handleUndoOperation('discard')}
                        className={`px-3 py-1 whitespace-nowrap rounded text-sm ${inputValues.undoOperation === 'discard' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        Discard Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => handleUndoOperation('unstage')}
                        className={`px-3 py-1 whitespace-nowrap rounded text-sm ${inputValues.undoOperation === 'unstage' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        Unstage Files
                    </button>
                    <button
                        type="button"
                        onClick={() => handleUndoOperation('reset')}
                        className={`px-3 py-1 whitespace-nowrap rounded text-sm ${inputValues.undoOperation === 'reset' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        Reset Commit
                    </button>
                    <button
                        type="button"
                        onClick={() => handleUndoOperation('revert')}
                        className={`px-3 py-1 whitespace-nowrap rounded text-sm ${inputValues.undoOperation === 'revert' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        Revert Commit
                    </button>
                </div>

                {/* File Selection */}
                {(inputValues.undoOperation === 'discard' || inputValues.undoOperation === 'unstage') && (
                    <div>
                        <label className="block text-gray-300 mb-2">
                            {inputValues.undoOperation === 'discard' 
                                ? 'Files to discard (default: all):' 
                                : 'Files to unstage (default: all):'}
                        </label>
                        <input
                            type="text"
                            value={inputValues.files || ''}
                            onChange={(e) => handleInputChange('files', e.target.value)}
                            placeholder="path/to/file.txt"
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        />
                        <p className="text-sm description mt-2">
                            {inputValues.undoOperation === 'discard' 
                                ? 'This will permanently discard changes. Use with caution!'
                                : 'This will unstage the specified files'}
                        </p>
                    </div>
                )}

                {/* Commit Selection */}
                {(inputValues.undoOperation === 'reset' || inputValues.undoOperation === 'revert') && (
                    <div>
                        <label className="block text-gray-300 mb-2">
                            {inputValues.undoOperation === 'reset' 
                                ? 'Commit to reset to (default: HEAD~1):' 
                                : 'Commit to revert:'}
                        </label>
                        <input
                            type="text"
                            value={inputValues.commit || ''}
                            onChange={(e) => handleInputChange('commit', e.target.value)}
                            placeholder="HEAD~1 or commit-hash"
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        />
                    </div>
                )}

                {/* Reset Options */}
                {inputValues.undoOperation === 'reset' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-300 mb-2">Reset Type:</label>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
                                    <input
                                        type="radio"
                                        name="resetType"
                                        checked={inputValues.softReset}
                                        onChange={() => setInputValues(prev => ({
                                            ...prev,
                                            softReset: true,
                                            mixedReset: false,
                                            hardReset: false
                                        }))}
                                        className="h-4 w-4 text-blue-500 border-gray-600 focus:ring-blue-500"
                                    />
                                    <div>
                                        <div className="text-gray-300 font-medium">Soft (--soft)</div>
                                        <p className="text-xs text-gray-400">Moves HEAD to the specified commit, keeping your changes staged</p>
                                    </div>
                                </label>
                                
                                <label className="flex items-start space-x-2 p-2 rounded hover:bg-gray-700">
                                    <input
                                        type="radio"
                                        name="resetType"
                                        checked={inputValues.mixedReset}
                                        onChange={() => setInputValues(prev => ({
                                            ...prev,
                                            softReset: false,
                                            mixedReset: true,
                                            hardReset: false
                                        }))}
                                        className="h-4 w-4 text-blue-500 border-gray-600 focus:ring-blue-500 mt-1"
                                    />
                                    <div>
                                        <div className="text-gray-300 font-medium">Mixed (--mixed, default)</div>
                                        <p className="text-xs text-gray-400">Unstages changes, but keeps them in your working directory</p>
                                    </div>
                                </label>
                                
                                <label className="flex items-start space-x-2 p-2 rounded hover:bg-gray-700">
                                    <input
                                        type="radio"
                                        name="resetType"
                                        checked={inputValues.hardReset}
                                        onChange={() => setInputValues(prev => ({
                                            ...prev,
                                            softReset: false,
                                            mixedReset: false,
                                            hardReset: true
                                        }))}
                                        className="h-4 w-4 text-red-500 border-gray-600 focus:ring-red-500 mt-1"
                                    />
                                    <div>
                                        <div className="text-gray-300 font-medium">Hard (--hard)</div>
                                        <p className="text-xs text-red-400">Warning: Permanently discards all changes in working directory and staging area</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UndoOperations;
