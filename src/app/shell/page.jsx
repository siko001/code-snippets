import NetworkCommands from '@/app/components/shell/NetworkCommands';
import ShellConfigCommands from '@/app/components/shell/ShellConfigCommands';

// This page is statically generated at build time and revalidated every hour
export const revalidate = 3600; // Revalidate at most every hour

// Generate static params for dynamic routes (if any)
export async function generateStaticParams() {
  return []; // Add any dynamic route params here if needed
}

export default function ShellPage() {
    return (
        <div className="w-full">
            <h2 id="shell-snippets" className='text-center text-4xl font-semibold mb-6 text-blue-600'>Shell Commands</h2>
            <div className="w-full max-w-4xl mx-auto space-y-6">
                <div className="space-y-8">
                    <h3 id="shell-network" className="text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                        Network Utilities
                    </h3>
                    <div className="component-wrapper p-6 rounded-lg shadow-lg">
                        <NetworkCommands />
                    </div>

                    <h3 id="shell-config" className="text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                        Shell Configuration
                    </h3>
                    <div className="component-wrapper p-6 rounded-lg shadow-lg">
                        <ShellConfigCommands />
                    </div>
                </div>
            </div>
        </div>
    );
}
