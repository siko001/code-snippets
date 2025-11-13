import IndexRelations from '../components/nova/IndexRelations';
import TitleMethod from '../components/nova/TitleMethod';
import SearchableColumns from '../components/nova/SearchableColumns';
import HideFromIndex from '../components/nova/HideFromIndex';
import ResourceMethods from '../components/nova/ResourceMethods';
import InertiaShortcuts from '../components/inertia/InertiaShortcuts';

// This page is statically generated at build time and revalidated every hour
export const revalidate = 3600; // Revalidate at most every hour

// Generate static params for dynamic routes (if any)
export async function generateStaticParams() {
  return []; // Add any dynamic route params here if needed
}

export default function NovaPage() {
    return (
        <div className="w-full py-8">
            <div className="container mx-auto px-4">
                <h2 id="laravel-nova" className='text-center text-4xl font-semibold mb-10 text-blue-500'>Laravel Nova</h2>
                
                
                <div className="max-w-5xl mx-auto space-y-12">
                
                    <h3 className="text-xl font-semibold text-white border-b border-gray-700">Resource Management</h3>
                    <section id="title-method" className="component-wrapper rounded-lg p-6 shadow-lg">
                        <TitleMethod />
                    </section>
                    
                    <section id="searchable-columns" className="component-wrapper rounded-lg p-6 shadow-lg">
                        <SearchableColumns />
                    </section>
                        <section id="index-relations" className="component-wrapper rounded-lg p-6 shadow-lg">
                        <IndexRelations />
                    </section>
                    <section id="hide-from-index" className="component-wrapper rounded-lg p-6 shadow-lg">
                        <HideFromIndex />
                    </section>

                    <section id="resource-methods" className="component-wrapper rounded-lg p-6 shadow-lg">
                        <ResourceMethods />
                    </section>
                    
                    <section id="inertia-shortcuts" className="component-wrapper rounded-lg p-6 shadow-lg">
                        <InertiaShortcuts />
                    </section>

                </div>
            </div>
        </div>
    );
}
