'use client';

import ConnectionCommands from '../components/sql/ConnectionCommands';
import DatabaseCommands from '../components/sql/DatabaseCommands';
import TableCommands from '../components/sql/TableCommands';

export default function SqlPage() {
    return (
        <div className="w-full">
            <h2 id="sql-snippets" className='text-center text-4xl font-semibold mb-6 text-blue-600'>SQL Snippets</h2>
            <div className="w-full max-w-4xl mx-auto space-y-6">
                <div className="space-y-8">
                    <h3 id="sql-connection" className="text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                        Database Connection
                    </h3>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <ConnectionCommands />
                    </div>

                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                        Database Management
                    </h3>
                    <div id="sql-databases" className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <DatabaseCommands />
                    </div>

                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                        Table Operations
                    </h3>
                    <div id="sql-tables" className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <TableCommands />
                    </div>
                </div>
            </div>
        </div>
    );
}
