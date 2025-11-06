'use client';

const RepositoryOperations = ({ handleInputChange, inputValues, setInputValues }) => {
    const handleOperationChange = (operation) => {
        setInputValues(prev => ({
            ...prev,
            operation,
            // Reset repository URL when switching to init
            ...(operation === 'init' ? { repository: '' } : {})
        }));
    };

    return (
        <div className="space-y-4">
            <div className="flex space-x-2 mb-4">
                <button 
                    type="button"
                    onClick={() => handleOperationChange('clone')}
                    className={`px-3 py-1 rounded text-sm ${
                        inputValues.operation === 'clone' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    Clone
                </button>
                <button 
                    type="button"
                    onClick={() => handleOperationChange('init')}
                    className={`px-3 py-1 rounded text-sm ${
                        inputValues.operation === 'init' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    Initialize
                </button>
            </div>
            
            {inputValues.operation === 'clone' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-2">Repository URL:</label>
                        <input
                            type="text"
                            value={inputValues.repository || ''}
                            onChange={(e) => handleInputChange('repository', e.target.value)}
                            placeholder="https://github.com/username/repo.git"
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Directory (optional):</label>
                        <input
                            type="text"
                            value={inputValues.directory || ''}
                            onChange={(e) => handleInputChange('directory', e.target.value)}
                            placeholder="directory-name"
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        />
                    </div>
                </div>
            )}
            
            {inputValues.operation === 'init' && (
                <div>
                    <label className="block text-gray-300 mb-2">Directory (optional):</label>
                    <input
                        type="text"
                        value={inputValues.directory || ''}
                        onChange={(e) => handleInputChange('directory', e.target.value)}
                        placeholder="directory-name"
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    />
                </div>
            )}
        </div>
    );
};

export default RepositoryOperations;
