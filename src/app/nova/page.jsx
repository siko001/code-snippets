'use client';

import IndexRelations from '../components/nova/IndexRelations';
import TitleMethod from '../components/nova/TitleMethod';
import SearchableColumns from '../components/nova/SearchableColumns';
import HideFromIndex from '../components/nova/HideFromIndex';

export default function NovaPage() {
    return (
        <div className="w-full py-8">
            <div className="container mx-auto px-4">
                <h2 id="laravel-nova" className='text-center text-4xl font-semibold mb-10 text-blue-500'>Laravel Nova</h2>
                
                
                <div className="max-w-5xl mx-auto space-y-12">
                    <section id="index-relations" className="bg-gray-800/50 rounded-xl p-6 shadow-lg">
                        <IndexRelations />
                    </section>
                    
                    <section id="title-method" className="bg-gray-800/50 rounded-xl p-6 shadow-lg">
                        <TitleMethod />
                    </section>
                    
                    <section id="searchable-columns" className="bg-gray-800/50 rounded-xl p-6 shadow-lg">
                        <SearchableColumns />
                    </section>
                    
                    <section id="hide-from-index" className="bg-gray-800/50 rounded-xl p-6 shadow-lg">
                        <HideFromIndex />
                    </section>
                </div>
            </div>
        </div>
    );
}
