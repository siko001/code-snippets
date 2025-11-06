'use client';
import { useState, useEffect, useCallback } from 'react';
import GitCommand from './GitCommand';
import RepositoryOperations from './RepositoryOperations';
import BranchOperations from './BranchOperations';
import CommitOperations from './CommitOperations';
import RemoteOperations from './RemoteOperations';
import StashOperations from './StashOperations';
import UndoOperations from './UndoOperations';
import ViewHistoryOperations from './ViewHistoryOperations';

export default function GitSnippets() {
    const [repoValues, setRepoValues] = useState({
        operation: 'clone',
        repository: '',
        directory: ''
    });
    
    // Memoize child components to prevent unnecessary re-renders
    const renderRepositoryOperations = useCallback(({ handleInputChange, inputValues, setInputValues }) => (
        <RepositoryOperations 
            handleInputChange={handleInputChange}
            inputValues={inputValues}
            setInputValues={setInputValues}
        />
    ), []);

    const renderBranchOperations = useCallback(({ handleInputChange, inputValues, setInputValues }) => (
        <BranchOperations
            handleInputChange={handleInputChange}
            inputValues={inputValues}
            setInputValues={setInputValues}
        />
    ), []);

    const renderCommitOperations = useCallback(({ handleInputChange, inputValues, setInputValues }) => (
        <CommitOperations
            handleInputChange={handleInputChange}
            inputValues={inputValues}
            setInputValues={setInputValues}
        />
    ), []);
    return (
        <div className="w-full">
            <h2 id="git-snippets" className='text-center text-4xl font-semibold my-6 text-blue-600'>Git Snippets</h2>
            <div className="w-full max-w-4xl mx-auto space-y-8">
                <div className="space-y-8">
                    <h3 id="git-repo" className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Repository</h3>
                    
                    <GitCommand 
                        title="Repository Operations" 
                        id="git-repo"
                        initialCommand={repoValues.operation === 'clone' 
                            ? 'git clone {repository} {directory}'
                            : 'git init {directory}'
                        }
                        initialValues={repoValues}
                        onValuesChange={setRepoValues}
                    >
                        {renderRepositoryOperations}
                    </GitCommand>
                </div>
                
                <div className="space-y-8">
                    <h3 id="git-branch" className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Branching</h3>
                    
                    <GitCommand 
                        title="Branch Operations" 
                        id="git-branch"
                        initialCommand={(values = {}) => {
                            const { 
                                operation = 'list', 
                                'branch-name': branchName = '', 
                                force = '' 
                            } = values;

                            // For list operation, always return the command
                            if (operation === 'list') return 'git branch';
                            
                            // For other operations, return null if branch name is not provided
                            if (!branchName) return null;
                            
                            // Generate command based on operation
                            switch (operation) {
                                case 'checkout':
                                    return `git checkout ${branchName}${force ? ' --force' : ''}`;
                                case 'checkout -b':
                                    return `git checkout -b ${branchName}`;
                                case 'branch -d':
                                    return `git branch ${force === '-D' ? '-D' : '-d'} ${branchName}`.replace(/\s+/g, ' ').trim();
                                default:
                                    return `git ${operation} ${branchName} ${force}`.trim();
                            }
                        }}
                        initialValues={{ operation: 'list', 'branch-name': '', force: '' }}
                    >
                        {renderBranchOperations}
                    </GitCommand>
                </div>
                
                <div className="space-y-8">
                    <h3 id="git-commit" className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Commits</h3>
                    
                    <GitCommand 
                        title="Stage & Commit Changes" 
                        id="git-commit"
                        initialCommand={(values = {}) => {
                            const { 
                                all = '', 
                                update = '', 
                                patch = '',
                                files = '',
                                message = '',
                                amend = '',
                                noEdit = ''
                            } = values;

                            // Build stage command
                            let stageCmd = 'git add';
                            // Default to staging all changes if no specific option is selected
                            if (!all && !update && !patch && !files) {
                                stageCmd += ' .';
                            } else {
                                if (all) stageCmd += ' --all';
                                if (update) stageCmd += ' --update';
                                if (patch) stageCmd += ' --patch';
                                if (files) stageCmd += ` ${files}`;
                            }
                            
                            // Build commit command
                            let commitCmd = 'git commit';
                            if (amend) commitCmd += ' --amend';
                            if (noEdit) commitCmd += ' --no-edit';
                            if (message) commitCmd += ` -m "${message}"`;
                            
                            // Combine commands
                            let fullCmd = stageCmd;
                            if (message || amend) {
                                fullCmd += ' && ' + commitCmd;
                            }
                            
                            return fullCmd;
                        }}
                        initialValues={{
                            all: '',
                            update: '',
                            patch: '',
                            files: '',
                            message: '',
                            amend: '',
                            noEdit: ''
                        }}
                    >
                        {({ handleInputChange, inputValues, setInputValues }) => (
                            <CommitOperations 
                                handleInputChange={handleInputChange}
                                inputValues={inputValues}
                                setInputValues={setInputValues}
                            />
                        )}
                    </GitCommand>
                </div>
                
                <div className="space-y-8">
                    <h3 id="git-remote" className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Push, Pull & Fetch</h3>
                    
                    <GitCommand 
                        title="Remote Operations" 
                        id="git-remote"
                        initialCommand={(values = {}) => {
                            const { 
                                remote = 'origin',
                                operation = 'push',
                                branch = '',
                                setUpstream = '',
                                upstreamBranch = '',
                                rebase = ''
                            } = values;

                            let cmd = `git ${operation} ${remote}`;
                            
                            if (operation === 'push') {
                                if (setUpstream) {
                                    // For --set-upstream, we want to use the upstreamBranch if it exists, otherwise use branch
                                    const targetBranch = upstreamBranch || branch || 'main';
                                    cmd += ` --set-upstream ${remote} ${targetBranch}`;
                                } else if (branch) {
                                    // Regular push with branch
                                    cmd += ` ${branch}`;
                                }
                            } else if (branch) {
                                // For pull/fetch, just append the branch if it exists
                                cmd += ` ${branch}`;
                            }
                            
                            if (operation === 'pull' && rebase) {
                                cmd += ' --rebase';
                            }
                            
                            return cmd.trim();
                        }}
                        initialValues={{
                            remote: 'origin',
                            operation: 'push',
                            branch: '',
                            setUpstream: '',
                            upstreamBranch: '',
                            rebase: ''
                        }}
                    >
                        {({ handleInputChange, inputValues, setInputValues }) => (
                            <div className="space-y-4">
                                <RemoteOperations 
                                    handleInputChange={handleInputChange}
                                    inputValues={inputValues}
                                    setInputValues={setInputValues}
                                />
                                {inputValues.operation === 'push' && (
                                    <div className="flex flex-wrap gap-2">
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setInputValues(prev => ({
                                                    ...prev,
                                                    remote: 'origin',
                                                    branch: 'main'
                                                }));
                                            }}
                                            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded"
                                        >
                                            Default (origin main)
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setInputValues(prev => ({
                                                    ...prev,
                                                    remote: 'origin',
                                                    branch: '$(git branch --show-current)'
                                                }));
                                            }}
                                            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded"
                                        >
                                            Current Branch
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </GitCommand>
                </div>
        <div className="space-y-8">
                    <h3 id="git-stash" className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Stashing</h3>
                    
                    <GitCommand 
                        title="Stash Operations" 
                        id="git-stash"
                        initialCommand={(values = {}) => {
                            const { 
                                stashOperation = 'none',
                                message = '',
                                stashRef = '',
                                includeIndex = false
                            } = values;

                            let cmd = 'git stash';
                            
                            switch (stashOperation) {
                                  case 'none':
                                    cmd += message ? ` push -m "${message}"` : '';
                                    break;
                                case 'push':
                                    cmd += message ? ` push -m "${message}"` : ' push';
                                    break;
                                case 'pop':
                                    cmd += ' pop';
                                    if (stashRef) cmd += ` ${stashRef}`;
                                    break;
                                case 'apply':
                                    cmd += ' apply';
                                    if (stashRef) cmd += ` ${stashRef}`;
                                    if (includeIndex) cmd += ' --index';
                                    break;
                                case 'drop':
                                    cmd += ' drop';
                                    if (stashRef) cmd += ` ${stashRef}`;
                                    break;
                                case 'list':
                                    cmd += ' list';
                                    break;
                                default:
                                    cmd += ' push';
                            }
                            
                            return cmd.trim();
                        }}
                        initialValues={{
                            stashOperation: 'none',
                            message: '',
                            stashRef: '',
                            includeIndex: false
                        }}
                    >
                        {({ handleInputChange, inputValues, setInputValues }) => (
                            <StashOperations 
                                handleInputChange={handleInputChange}
                                inputValues={inputValues}
                                setInputValues={setInputValues}
                            />
                        )}
                    </GitCommand>
                </div>
                
                <div className="space-y-8">
                    <h3 id="git-undo" className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Undo Changes</h3>
                </div>
                
                <div className="space-y-8">
                    <GitCommand 
                        title="Undo Operations" 
                        id="git-undo"
                        initialCommand={(values = {}) => {
                            const { 
                                undoOperation = 'discard',
                                files = '',
                                commit = '',
                                softReset = false,
                                mixedReset = false,
                                hardReset = false
                            } = values;

                            let cmd = 'git ';
                            
                            switch (undoOperation) {
                                case 'discard':
                                    cmd += `restore ${files || '.'}`;
                                    break;
                                case 'unstage':
                                    cmd += `restore --staged ${files || '.'}`;
                                    break;
                                case 'reset':
                                    cmd += 'reset ';
                                    if (softReset) cmd += '--soft ';
                                    else if (hardReset) cmd += '--hard ';
                                    else if (mixedReset) cmd += '--mixed ';
                                    cmd += commit || 'HEAD~1';
                                    break;
                                case 'revert':
                                    cmd += `revert ${commit || 'HEAD'}`;
                                    break;
                                default:
                                    cmd += 'restore .';
                            }
                            
                            return cmd.trim();
                        }}
                        initialValues={{
                            undoOperation: 'discard',
                            files: '',
                            commit: '',
                            softReset: false,
                            mixedReset: true, // Default reset type
                            hardReset: false
                        }}
                    >
                        {({ handleInputChange, inputValues, setInputValues }) => (
                            <UndoOperations 
                                handleInputChange={handleInputChange}
                                inputValues={inputValues}
                                setInputValues={setInputValues}
                            />
                        )}
                    </GitCommand>
                </div>
                
                <div className="space-y-8">
                    <h3 id='git-history' className="text-xl font-semibold text-white border-b border-gray-700 pb-2">History</h3>
                </div>
                
                <div className="space-y-8">
                    <GitCommand 
                        title="View History & Changes" 
                        id="git-history"
                        initialCommand={(values = {}) => {
                            const { 
                                viewOperation = 'log',
                                commitRange = '',
                                path = '',
                                author = '',
                                since = '',
                                until = '',
                                graph = true,
                                oneline = true,
                                stat = false,
                                patch = false,
                                nameOnly = false,
                                all = false
                            } = values;

                            let cmd = 'git ';

                            switch (viewOperation) {
                                case 'log':
                                    cmd += 'log';
                                    if (graph) cmd += ' --graph';
                                    if (oneline) cmd += ' --oneline';
                                    if (stat) cmd += ' --stat';
                                    if (patch) cmd += ' -p';
                                    if (nameOnly) cmd += ' --name-only';
                                    if (all) cmd += ' --all';
                                    if (author) cmd += ` --author="${author}"`;
                                    if (since) cmd += ` --since="${since}"`;
                                    if (until) cmd += ` --until="${until}"`;
                                    if (commitRange) cmd += ` ${commitRange}`;
                                    if (path) cmd += ` -- ${path}`;
                                    break;
                                case 'show':
                                    cmd += `show ${commitRange || 'HEAD'}`;
                                    if (stat) cmd += ' --stat';
                                    if (patch) cmd += ' -p';
                                    if (path) cmd += ` -- ${path}`;
                                    break;
                                case 'diff':
                                    cmd += 'diff';
                                    if (stat) cmd += ' --stat';
                                    if (commitRange) {
                                        cmd += ` ${commitRange}`;
                                    } else {
                                        cmd += ' HEAD';
                                    }
                                    if (path) cmd += ` -- ${path}`;
                                    break;
                                case 'blame':
                                    cmd += `blame ${path || 'path/to/file'}`;
                                    if (commitRange) cmd += ` ${commitRange}`;
                                    break;
                                default:
                                    cmd += 'log --oneline --graph --decorate';
                            }

                            return cmd.trim();
                        }}
                        initialValues={{
                            viewOperation: 'log',
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
                        }}
                    >
                        {({ handleInputChange, inputValues, setInputValues }) => (
                            <ViewHistoryOperations 
                                handleInputChange={handleInputChange}
                                inputValues={inputValues}
                                setInputValues={setInputValues}
                            />
                        )}
                    </GitCommand>
                </div>
            </div>
        </div>
    );
}
