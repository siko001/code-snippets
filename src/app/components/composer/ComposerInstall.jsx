'use client';

import CodeSnippet from '../CodeSnippet';

const ComposerInstall = () => {
    const commands = [
        {
            code: 'php -r "copy(\'https://getcomposer.org/installer\', \'composer-setup.php\');"',
            description: 'Download the Composer installer'
        },
        {
            code: 'php -r "if (hash_file(\'sha384\', \'composer-setup.php\') === \'55ce33d7678c5a611085589f1f3ddf8b3c52d662cd01d4ba75c0ee0459970c2200a51f492d557530c71c15d8dba01eae\') { echo \'Installer verified\'; } else { echo \'Installer corrupt\'; unlink(\'composer-setup.php\'); } echo PHP_EOL;"',
            description: 'Verify the installer\'s integrity'
        },
        {
            code: 'php composer-setup.php',
            description: 'Run the installer'
        },
        {
            code: 'php -r "unlink(\'composer-setup.php\');"',
            description: 'Remove the installer'
        },
        {
            code: 'sudo mv composer.phar /usr/local/bin/composer',
            description: 'Make Composer globally available'
        }
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-400 mb-4">
                Installation
            </h3>
            {commands.map((cmd, index) => (
                <div key={index} className="mb-4">
                    <CodeSnippet 
                        code={cmd.code}
                        className="mb-1"
                        copyButton={true}
                    />
                    <p className="text-xs text-gray-400">{cmd.description}</p>
                </div>
            ))}
            
            <div className="p-3  border border-gray-900 rounded text-sm mt-6">
                <p className="text-blue-300 font-medium mb-2">Verification:</p>
                <CodeSnippet 
                    code="composer --version"
                    className="mb-2"
                    copyButton={true}
                />
                <p className="text-xs text-gray-400">
                    Run this command to verify Composer is installed correctly.
                </p>
            </div>
        </div>
    );
};

export default ComposerInstall;
