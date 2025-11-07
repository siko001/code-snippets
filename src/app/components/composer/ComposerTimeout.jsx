'use client';

import CodeSnippet from '../CodeSnippet';

const ComposerTimeout = () => {
    const timeoutCommand = 'COMPOSER_PROCESS_TIMEOUT=600 composer install --no-dev --prefer-dist';
    
    return (
        <div className="space-y-4">
            <div>
                <CodeSnippet 
                    code={timeoutCommand}
                    className="mb-2"
                    copyButton={true}
                />
                <p className="text-xs text-gray-400">
                    Use this command when the default 300-second timeout is too short for your installation.
                </p>
            </div>
            
            <div className="p-3  border border-gray-900 rounded text-sm">
                <p className="text-blue-300 font-medium mb-1">Note:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li><code className="bg-gray-700 px-1 rounded">--no-dev</code> Skips development dependencies</li>
                    <li><code className="bg-gray-700 px-1 rounded">--prefer-dist</code> Installs from dist (faster)</li>
                    <li>Adjust <code className="bg-gray-700 px-1 rounded">600</code> (seconds) as needed</li>
                </ul>
            </div>
        </div>
    );
};

export default ComposerTimeout;
