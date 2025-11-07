'use client';

import ComposerCommands from '../components/composer/ComposerCommands';
import ComposerTimeout from '../components/composer/ComposerTimeout';
import ComposerInstall from '../components/composer/ComposerInstall';

export default function ComposerPage() {
    return (
        <div className="w-full">
            <h2 id="composer-snippets" className='text-center text-4xl font-semibold mb-6 text-blue-600'>Composer Snippets</h2>
            <div className="w-full max-w-4xl mx-auto space-y-6">
                <div className="space-y-8">
                    <div id="composer-commands" className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                            Composer Commands
                        </h3>
                        <ComposerCommands />
                    </div>

                    <div id="composer-timeout" className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                            Composer Timeout Solution
                        </h3>
                        <ComposerTimeout />
                    </div>

                    <div id="composer-installation" className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                            Composer Installation
                        </h3>
                        <ComposerInstall />
                    </div>
                </div>
            </div>
        </div>
    );
}
