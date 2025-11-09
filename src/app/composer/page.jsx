import ComposerCommands from '../components/composer/ComposerCommands';
import ComposerTimeout from '../components/composer/ComposerTimeout';
import ComposerInstall from '../components/composer/ComposerInstall';

// This page is statically generated at build time and revalidated every hour
export const revalidate = 3600; // Revalidate at most every hour

// Generate static params for dynamic routes (if any)
export async function generateStaticParams() {
  return []; // Add any dynamic route params here if needed
}

export default function ComposerPage() {
    return (
        <div className="w-full">
            <h2 id="composer-snippets" className='text-center text-4xl font-semibold mb-6 text-blue-600'>Composer Snippets</h2>
            <div className="w-full max-w-4xl mx-auto space-y-6">
                <div className="space-y-8">
                    
                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                        Composer Commands
                    </h3>
                    <div id="composer-management" className="component-wrapper p-6 rounded-lg shadow-lg">
                        <ComposerCommands />
                    </div>

                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                        Composer Timeout Solution
                    </h3>   
                    <div id="composer-timeout" className="component-wrapper p-6 rounded-lg shadow-lg">
                        <ComposerTimeout />
                    </div>


                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                        Composer Installation
                    </h3>
                    <div id="composer-install" className="component-wrapper p-6 rounded-lg shadow-lg">
                        <ComposerInstall />
                    </div>
                </div>
            </div>
        </div>
    );
}
