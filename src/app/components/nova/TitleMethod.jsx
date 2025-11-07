'use client';

import { useState } from 'react';
import PhpSnippet from '../PhpSnippet';

export default function TitleMethod() {
    const [model, setModel] = useState('');
    const [field, setField] = useState('name');
    const [useId, setUseId] = useState(true);
    
    const generateCode = () => {
        const modelVar = model ? `$${model.toLowerCase()}` : '$model';
        const fieldAccess = field.includes('.') ? `->${field.split('.').join('->')}` : `->${field}`;
        const fallback = useId ? `'${model || 'Resource'} #' . $this->id` : "''";
        
        return `/**
 * Get the title of the resource.
 *
 * @return string
 */
public function title()
{
    return $this->${model ? `${model}${fieldAccess}` : field} ?? ${fallback};
}`;
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">Title Method Generator</h3>
                <p className="text-gray-300 text-sm">
                    Generate a title method for your Nova resource that displays a relationship or field.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Relationship (Optional)</label>
                        <input
                            type="text"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., product, user, etc."
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            The relationship name (camelCase)
                        </p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Field Name</label>
                        <input
                            type="text"
                            value={field}
                            onChange={(e) => setField(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., name, title, etc."
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Field or nested field (e.g., 'name' or 'category.name')
                        </p>
                    </div>
                </div>
                
                <div className="mt-2">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={useId}
                            onChange={(e) => setUseId(e.target.checked)}
                            className="rounded bg-gray-700 border-gray-600 text-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-300">Fallback to ID if field is empty</span>
                    </label>
                </div>
                
                <div className="mt-4">
                    <PhpSnippet code={generateCode()} />
                    <p className="text-xs text-gray-400 mt-2">
                        Add this method to your Nova resource class.
                    </p>
                </div>
            </div>
        </div>
    );
}
