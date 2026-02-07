import HerdCommands from '@/app/components/shell/HerdCommands';

export default function HerdPage() {
    return (
        <div className="w-full">
            <h2 id="shell-snippets" className='text-center text-4xl font-semibold mb-6 text-blue-600'>Herd Commands</h2>
            <div className="w-full max-w-4xl mx-auto space-y-6">
                <div className="space-y-8">
                    <h3 id="shell-network" className="text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                        Herd
                    </h3>
                    <div className="component-wrapper p-6 rounded-lg shadow-lg">
                        <HerdCommands />
                    </div>

                </div>
            </div>
        </div>
    );
}