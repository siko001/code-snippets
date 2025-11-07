'use client';

import LandoBasicCommands from '@/app/components/lando/LandoBasicCommands';
import LandoConfigGenerator from '@/app/components/lando/LandoConfigGenerator';

export default function LandoPage() {
    return (
        <div className="w-full">
            <h2 id="lando-snippets" className='text-center text-4xl font-semibold mb-6 text-blue-600'>Lando Commands</h2>
            <div className="w-full max-w-4xl mx-auto space-y-6">
                <div className="space-y-8">
                    <h3 id="lando-basic" className="text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                        Basic Commands
                    </h3>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <LandoBasicCommands />
                    </div>

                    <h3 id="lando-config" className="text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                        Lando Configuration
                    </h3>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <LandoConfigGenerator />
                    </div>
                </div>
            </div>
        </div>
    );
}
