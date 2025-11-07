'use client';

import { useState } from 'react';
import PhpSnippet from '../PhpSnippet';

export default function SearchableColumns() {
    const [relations, setRelations] = useState([{ resource: '', field: '' }]);
    const [searchableFields, setSearchableFields] = useState(['name']);
    const [newField, setNewField] = useState('');
    const [searchable, setSearchable] = useState(true);
    
    const addRelation = () => {
        setRelations([...relations, { resource: '', field: '' }]);
    };
    
    const updateRelation = (index, field, value) => {
        const updated = [...relations];
        updated[index][field] = value;
        setRelations(updated);
    };
    
    const removeRelation = (index) => {
        const updated = [...relations];
        updated.splice(index, 1);
        setRelations(updated);
    };
    
    const addSearchableField = () => {
        if (newField && !searchableFields.includes(newField)) {
            setSearchableFields([...searchableFields, newField]);
            setNewField('');
        }
    };
    
    const removeSearchableField = (field) => {
        setSearchableFields(searchableFields.filter(f => f !== field));
    };
    
    const generateCode = () => {
        const fields = searchableFields.map(field => `'${field}'`);
        const relationItems = relations
            .filter(r => r.resource && r.field)
            .map(r => `new SearchableRelation('${r.resource}', '${r.field}')`);
            
        const allItems = [...fields, ...relationItems];
        let code = '';
        
        if (!searchable) {
            return `/**
 * Indicates if the resource should be searchable.
 *
 * @var bool
 */
public static $globallySearchable = false;`;
        }
        
        if (allItems.length > 0) {
            code += `use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Query\Search\SearchableRelation;

/**
 * Get the searchable columns for the resource.
 *
 * @return array
 */
public static function searchableColumns(): array
{
    return [
        ${allItems.join(',\n        ')}
    ];
}`;
        }
        
        return code || '// No search configuration needed';
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-blue-400 mb-4">Searchable Configuration</h3>
                <p className="text-gray-300 text-sm">
                    Configure searchable columns and relationships for your Nova resource.
                </p>
                
                <div className="mt-4">
                    <label className="inline-flex items-center mb-4">
                        <input
                            type="checkbox"
                            checked={searchable}
                            onChange={(e) => setSearchable(e.target.checked)}
                            className="rounded bg-gray-700 border-gray-600 text-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-300">Make resource searchable</span>
                    </label>
                    
                    {searchable && (
                        <>
                            <div className="mb-6">
                                <h5 className="text-md font-medium text-gray-300 mb-2">Searchable Fields</h5>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {searchableFields.map((field, index) => (
                                        <div key={index} className="bg-blue-900/30 text-blue-200 px-3 py-1 rounded-full text-sm flex items-center">
                                            {field}
                                            <button 
                                                onClick={() => removeSearchableField(field)}
                                                className="ml-1.5 text-gray-400 hover:text-white transition-colors"
                                                title="Remove field"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={newField}
                                        onChange={(e) => setNewField(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addSearchableField()}
                                        className="flex-1 p-2 rounded-l-md bg-gray-700 text-white"
                                        placeholder="Add a searchable field"
                                    />
                                    <button
                                        onClick={addSearchableField}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-r-md"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h5 className="text-md font-medium text-gray-300">Searchable Relations</h5>
                                    <button
                                        onClick={addRelation}
                                        className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
                                    >
                                        + Add Relation
                                    </button>
                                </div>
                                
                                {relations.map((relation, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 items-end">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Resource</label>
                                            <input
                                                type="text"
                                                value={relation.resource}
                                                onChange={(e) => updateRelation(index, 'resource', e.target.value)}
                                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                                                placeholder="e.g., user"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Field</label>
                                            <input
                                                type="text"
                                                value={relation.field}
                                                onChange={(e) => updateRelation(index, 'field', e.target.value)}
                                                className="w-full p-2 rounded-md bg-gray-700 text-white"
                                                placeholder="e.g., name, email"
                                            />
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => removeRelation(index)}
                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/50 rounded-md transition-colors"
                                                title="Remove relation"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    
                    <div className="mt-6">
                        <PhpSnippet code={generateCode()} />
                        <p className="text-xs text-gray-400 mt-2">
                            Add this method to your Nova resource class.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
