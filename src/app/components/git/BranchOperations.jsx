'use client';
import { useEffect } from 'react';

const BranchOperations = ({ handleInputChange, inputValues, setInputValues }) => {
    // This effect updates the command in the parent component
    useEffect(() => {
        if (typeof inputValues.setCommand === 'function') {
            const { operation, force } = inputValues;
            const branchName = inputValues['branch-name'] || '';
            
            let command = null;
            
            switch (operation) {
                case 'list':
                    command = 'git branch -a';
                    break;
                    
                case 'checkout -b':
                    if (branchName) {
                        command = `git checkout -b ${branchName}`;
                    }
                    break;
                    
                case 'branch -d':
                    if (branchName) {
                        command = `git branch ${force === '-D' ? '-D' : '-d'} ${branchName}`;
                    }
                    break;
                    
                case 'checkout':
                default:
                    if (branchName) {
                        command = `git checkout ${branchName}${force ? ' --force' : ''}`;
                    }
            }
            
            inputValues.setCommand(command);
        }
    }, [inputValues, inputValues.operation, inputValues['branch-name'], inputValues.force]);
    const handleOperationChange = (operation) => {
        setInputValues(prev => ({
            ...prev,
            operation,
            // Reset force flag when changing operations
            ...(operation !== 'branch -d' ? { force: '' } : {})
        }));
    };

    const operation = inputValues.operation || 'list';

    return (
        <div className="space-y-4">
            <div className="flex tab-bg px-2 py-1.5 rounded overflow-auto gap-2 mb-4">
                <button 
                    type="button"
                    onClick={() => handleOperationChange('list')}
                    className={`px-3 py-1 whitespace-nowrap rounded text-sm ${
                        operation === 'list' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    List Branches
                </button>
                <button 
                    type="button"
                    onClick={() => handleOperationChange('checkout')}
                    className={`px-3 py-1 whitespace-nowrap rounded text-sm ${
                        operation === 'checkout' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    Switch Branch
                </button>
                <button 
                    type="button"
                    onClick={() => handleOperationChange('checkout -b')}
                    className={`px-3 py-1 whitespace-nowrap rounded text-sm ${
                        operation === 'checkout -b' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    Create & Switch
                </button>
                <button 
                    type="button"
                    onClick={() => handleOperationChange('branch -d')}
                    className={`px-3 py-1 whitespace-nowrap rounded text-sm ${
                        operation === 'branch -d' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    Delete Branch
                </button>
            </div>
            
            {operation !== 'list' && (
                <div>
                    <label className="block text-gray-300 mb-2">
                        {operation === 'branch -d' ? 'Branch to delete:' : 
                         operation === 'checkout -b' ? 'New branch name:' : 'Branch name:'}
                    </label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={inputValues['branch-name'] || ''}
                            onChange={(e) => handleInputChange('branch-name', e.target.value)}
                            placeholder={operation === 'checkout -b' ? 'feature/new-branch' : 'branch-name'}
                            className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
                        />
                        {operation === 'branch -d' && (
                            <button 
                                type="button"
                                onClick={() => {
                                    const newForce = inputValues.force === '-D' ? '' : '-D';
                                    handleInputChange('force', newForce);
                                }}
                                className={`px-3 py-1 rounded text-sm ${
                                    inputValues.force === '-D' 
                                        ? '!bg-red-600 !text-white' 
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                Force
                            </button>
                        )}
                    </div>
                    {operation === 'branch -d' && inputValues.force === '-D' && (
                        <p className="text-sm description !text-red-400 mt-1">Warning: Force deleting unmerged branch</p>
                    )}
                </div>
            )}
            
            {operation === 'list' && (
                <div className="text-sm description">
                    <p>Lists all local branches. The current branch is highlighted with an asterisk (*).</p>
                </div>
            )}
        </div>
    );
};

export default BranchOperations;
