'use client';

const CommitOperations = ({ handleInputChange, inputValues, setInputValues }) => {
    const handleInput = (e) => {
        const { name, value } = e.target;
        const updates = { [name]: value };
        
        // If setting a new remote, also update the defaultRemote
        if (name === 'remote') {
            updates.defaultRemote = value;
        }
        
        // Sync branch and upstreamBranch
        if (name === 'branch' && inputValues.setUpstream) {
            updates.upstreamBranch = value;
        } else if (name === 'upstreamBranch' && value) {
            updates.branch = value;
        }
        
        // Apply all updates
        Object.entries(updates).forEach(([key, val]) => {
            handleInputChange(key, val);
        });
    };

    const handleStageChange = (e) => {
        const { name, value } = e.target;
        const isChecked = value === 'none' ? false : !inputValues.stageOption || inputValues.stageOption !== value;
        
        setInputValues(prev => ({
            ...prev,
            // Toggle the selected option
            stageOption: isChecked ? value : '',
            // Map the stage option to the corresponding flag
            all: isChecked && value === 'all' ? '--all' : '',
            update: isChecked && value === 'update' ? '--update' : '',
            patch: isChecked && value === 'patch' ? '--patch' : '',
            // Clear files when a stage option is selected
            ...(isChecked && { files: '' })
        }));
    };

    const handleAmendChange = (e) => {
        const { checked } = e.target;
        setInputValues(prev => ({
            ...prev,
            amend: checked ? '--amend' : ''
        }));
    };

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-300">Stage Changes</h4>
                <div className="flex flex-wrap gap-2">
                   
                      <label className={`px-3 py-1 rounded text-sm ${!inputValues.stageOption ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} cursor-pointer`}>
                        <input
                            type="radio"
                            name="stageOption"
                            value="none"
                            checked={!inputValues.stageOption}
                            onChange={handleStageChange}
                            className="hidden"
                        />
                        None
                    </label>
                    <label className={`px-3 py-1 rounded text-sm ${inputValues.stageOption === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} cursor-pointer`}>
                        <input
                            type="radio"
                            name="stageOption"
                            value="all"
                            checked={inputValues.stageOption === 'all'}
                            onChange={handleStageChange}
                            className="hidden"
                        />
                        Stage All
                    </label>
                    <label className={`px-3 py-1 rounded text-sm ${inputValues.stageOption === 'update' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} cursor-pointer`}>
                        <input
                            type="radio"
                            name="stageOption"
                            value="update"
                            checked={inputValues.stageOption === 'update'}
                            onChange={handleStageChange}
                            className="hidden"
                        />
                        Stage Tracked
                    </label>
                    <label className={`px-3 py-1 rounded text-sm ${inputValues.stageOption === 'patch' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} cursor-pointer`}>
                        <input
                            type="radio"
                            name="stageOption"
                            value="patch"
                            checked={inputValues.stageOption === 'patch'}
                            onChange={handleStageChange}
                            className="hidden"
                        />
                        Interactive
                    </label>
                 
                </div>
                <div>
                    <label className="block text-gray-300 mb-2">Specific files (space-separated):</label>
                    <input
                        type="text"
                        value={inputValues.files || ''}
                        onChange={(e) => handleInputChange('files', e.target.value)}
                        placeholder="file1.txt file2.js"
                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    />
                </div>
            </div>

            <div className="border-t border-gray-700 pt-4 mt-4">
                <h4 className="text-lg font-medium text-gray-300 mb-2">Commit Changes</h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-2">Commit message:</label>
                        <input
                            type="text"
                            value={inputValues.message || ''}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            placeholder="Your commit message"
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={inputValues.amend === '--amend'}
                                onChange={handleAmendChange}
                                className="rounded border-gray-600 text-blue-500"
                            />
                            <span className="text-gray-300">Amend previous commit</span>
                        </label>
                        {inputValues.amend && (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={inputValues.noEdit === '--no-edit'}
                                    onChange={(e) => handleInputChange('noEdit', e.target.checked ? '--no-edit' : '')}
                                    className="rounded border-gray-600 text-blue-500"
                                />
                                <span className="text-gray-300">Keep previous message</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommitOperations;
