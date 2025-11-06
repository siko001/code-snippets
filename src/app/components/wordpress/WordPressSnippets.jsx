'use client';
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
import SearchReplace from './SearchReplace';
import DatabaseManager from './DatabaseManager';
import PluginManager from './PluginManager';

export default function WordPressSnippets() {
    return (
        <div className="w-full">
            <h2 id="wordpress-snippets" className='text-center text-2xl font-semibold my-6 text-blue-600'>WordPress Snippets</h2>
            <div className="w-full max-w-4xl mx-auto space-y-8">
                <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">User Management</h3>
                    <CreateUser />
                    <UpdateUser />
                </div>
                
                <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Database Operations</h3>
                    <SearchReplace />
                    <DatabaseManager />
                </div>

                <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Plugin Management</h3>
                    <PluginManager />
                </div>
            </div>
        </div>
    );
}