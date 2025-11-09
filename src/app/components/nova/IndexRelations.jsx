'use client';

import { useState } from 'react';
import PhpSnippet from '../PhpSnippet';

export default function IndexRelations() {
    const [relationship, setRelationship] = useState('');
    const [resource, setResource] = useState('');
    
    const generateCode = () => {
        if (relationship) {
            return `public function fields(NovaRequest $request)
{
    return [
        // ... other fields
        
        // Hide from index when accessed via relationship
        $this->when($request->viaRelationship()${resource ? ` && $request->viaResource === '${resource}'` : ''}, function () use ($relationship) {
            return $this->merge([
                ${relationship}::make('${relationship}')
                    ->hideFromIndex(fn(NovaRequest $request) => $request->viaRelationship())
            ]);
        })
    ];
}`;
        }
        return '';
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h3 className="text-xl font-semibold !text-blue-400 mb-4">
                    Hide Relationship on Index
                </h3>
                <p className="description text-sm">
                    Generate code to hide a relationship field when viewed from the index of a related resource.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Relationship Name</label>
                        <input
                            type="text"
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., posts, comments, etc."
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Resource Name (Optional)</label>
                        <input
                            type="text"
                            value={resource}
                            onChange={(e) => setResource(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., users, posts"
                        />
                        <p className="text-xs description mt-1">
                            Leave empty to apply to all resources
                        </p>
                    </div>
                </div>
                
                {relationship && (
                    <div className="mt-4">
                        <PhpSnippet code={generateCode()} />
                        <p className="text-xs description mt-2">
                            Add this to your Nova resource's <code className="dark:bg-gray-700 bg-gray-200 px-1 py-0.5 rounded">fields()</code> method.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
