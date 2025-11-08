'use client';

import CodeSnippet from '../CodeSnippet';

const ComposerTimeout = () => {
    const timeoutCommand = 'COMPOSER_PROCESS_TIMEOUT=600 composer install --no-dev --prefer-dist';
    
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-400 mb-4">
                Solution
            </h3>
            <div>
                <CodeSnippet 
                    code={timeoutCommand}
                    className="mb-2"
                    copyButton={true}
                />
                <p className="text-xs description">
                    Use this command when the default 300-second timeout is too short for your installation.
                </p>
            </div>
            
            <div className="p-3  border border-gray-200 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded text-sm">
                <p className="dark:text-blue-300 text-blue-400 font-medium mb-1">Note:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">--no-dev</code> Skips development dependencies</li>
                    <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">--prefer-dist</code> Installs from dist (faster)</li>
                    <li>Adjust <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">600</code> (seconds) as needed</li>
                </ul>
            </div>
        </div>
    );
};

export default ComposerTimeout;
