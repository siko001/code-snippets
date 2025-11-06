'use client';
import { useState } from 'react';

const ViewHistoryOperations = ({ handleInputChange, inputValues, setInputValues }) => {
    const [activeTooltip, setActiveTooltip] = useState(null);
    
    const handleButtonClick = (option, value) => {
        handleInputChange(option, !value);
        setActiveTooltip(null); // Close tooltip when clicking a button
    };
    
    const toggleTooltip = (option, e) => {
        e.stopPropagation();
        setActiveTooltip(activeTooltip === option ? null : option);
    };
    const handleViewOperation = (operation) => {
        setInputValues(prev => ({
            ...prev,
            viewOperation: operation,
            // Reset related fields when changing operations
            ...(operation !== prev.viewOperation && { 
                commitRange: '',
                path: '',
                author: '',
                since: '',
                until: '',
                graph: true,
                oneline: true,
                stat: false,
                patch: false,
                nameOnly: false,
                all: false
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
                        onClick={() => handleViewOperation('log')}
                        className={`px-3 py-1 rounded text-sm ${inputValues.viewOperation === 'log' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        Log
                    </button>
                    <button
                        type="button"
                        onClick={() => handleViewOperation('show')}
                        className={`px-3 py-1 rounded text-sm ${inputValues.viewOperation === 'show' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        Show
                    </button>
                    <button
                        type="button"
                        onClick={() => handleViewOperation('diff')}
                        className={`px-3 py-1 rounded text-sm ${inputValues.viewOperation === 'diff' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        Diff
                    </button>
                    <button
                        type="button"
                        onClick={() => handleViewOperation('blame')}
                        className={`px-3 py-1 rounded text-sm ${inputValues.viewOperation === 'blame' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        Blame
                    </button>
                </div>

                {/* Common Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-300 mb-2">
                            {inputValues.viewOperation === 'diff' ? 'Commit Range:' : 'Commit/Ref:'}
                        </label>
                        <input
                            type="text"
                            value={inputValues.commitRange || ''}
                            onChange={(e) => handleInputChange('commitRange', e.target.value)}
                            placeholder={inputValues.viewOperation === 'diff' ? 'HEAD~1..HEAD' : 'HEAD'}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        />
                    </div>
                    
                    {inputValues.viewOperation !== 'blame' && (
                        <div>
                            <label className="block text-gray-300 mb-2">Path (optional):</label>
                            <input
                                type="text"
                                value={inputValues.path || ''}
                                onChange={(e) => handleInputChange('path', e.target.value)}
                                placeholder="path/to/file"
                                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                            />
                        </div>
                    )}
                </div>

                {/* Log-specific Options */}
                {inputValues.viewOperation === 'log' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-300 mb-2">Author (optional):</label>
                                <input
                                    type="text"
                                    value={inputValues.author || ''}
                                    onChange={(e) => handleInputChange('author', e.target.value)}
                                    placeholder="author name or email"
                                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-gray-300 mb-2">Since (optional):</label>
                                    <input
                                        type="date"
                                        value={inputValues.since || ''}
                                        onChange={(e) => handleInputChange('since', e.target.value)}
                                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">Until (optional):</label>
                                    <input
                                        type="date"
                                        value={inputValues.until || ''}
                                        onChange={(e) => handleInputChange('until', e.target.value)}
                                        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-gray-300">Display Options:</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleButtonClick('graph', inputValues.graph)}
                                    className={`px-3 py-1 rounded text-sm ${
                                        inputValues.graph 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                    title="Show commit graph"
                                >
                                    Graph
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleButtonClick('oneline', inputValues.oneline)}
                                    className={`px-3 py-1 rounded text-sm ${
                                        inputValues.oneline 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                    title="Show one commit per line"
                                >
                                    One-line
                                </button>
                                <div className="relative group">
                                    <button
                                        type="button"
                                        onClick={() => handleButtonClick('stat', inputValues.stat)}
                                        onMouseEnter={(e) => toggleTooltip('stat', e)}
                                        onMouseLeave={() => setActiveTooltip(null)}
                                        className={`px-3 py-1 rounded text-sm ${
                                            inputValues.stat 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                        title="Show diff stats"
                                    >
                                        Stats
                                    </button>
                                    {activeTooltip === 'stat' && (
                                        <div className="absolute z-10 mt-1 w-48 p-2 bg-gray-800 rounded shadow-lg text-xs text-gray-300">
                                            Shows diff statistics
                                        </div>
                                    )}
                                </div>
                                <div className="relative group">
                                    <button
                                        type="button"
                                        onClick={() => handleButtonClick('patch', inputValues.patch)}
                                        onMouseEnter={(e) => toggleTooltip('patch', e)}
                                        onMouseLeave={() => setActiveTooltip(null)}
                                        className={`px-3 py-1 rounded text-sm ${
                                            inputValues.patch 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                        title="Show patch"
                                    >
                                        Patch
                                    </button>
                                    {activeTooltip === 'patch' && (
                                        <div className="absolute z-10 mt-1 w-48 p-2 bg-gray-800 rounded shadow-lg text-xs text-gray-300">
                                            Shows the patch (diff) for each commit
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleButtonClick('nameOnly', inputValues.nameOnly)}
                                    className={`px-3 py-1 rounded text-sm ${
                                        inputValues.nameOnly 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                    title="Show only names of changed files"
                                >
                                    Name Only
                                </button>
                                <div className="relative group">
                                    <button
                                        type="button"
                                        onClick={() => handleButtonClick('all', inputValues.all)}
                                        onMouseEnter={(e) => toggleTooltip('all', e)}
                                        onMouseLeave={() => setActiveTooltip(null)}
                                        className={`px-3 py-1 rounded text-sm ${
                                            inputValues.all 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                        title="Show all commits"
                                    >
                                        All
                                    </button>
                                    {activeTooltip === 'all' && (
                                        <div className="absolute z-10 mt-1 w-48 p-2 bg-gray-800 rounded shadow-lg text-xs text-gray-300">
                                            Shows all commits, including those not part of any branch
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Blame-specific Options */}
                {inputValues.viewOperation === 'blame' && (
                    <div>
                        <label className="block text-gray-300 mb-2">File:</label>
                        <input
                            type="text"
                            value={inputValues.path || ''}
                            onChange={(e) => handleInputChange('path', e.target.value)}
                            placeholder="path/to/file"
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                            required
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewHistoryOperations;
