'use client';

import { useState } from 'react';
import PhpSnippet from '../PhpSnippet';

const FIELD_TYPES = [
    'Text',
    'Textarea',
    'Number',
    'Boolean',
    'DateTime',
    'Date',
    'Select',
    'Markdown',
    'Code',
    'Password',
    'Currency',
    'File',
    'Image',
    'KeyValue',
    'Trix',
    'Time',
    'Timezone',
    'URL'
];

const RELATIONSHIP_TYPES = [
    'BelongsTo',
    'BelongsToMany',
    'HasMany',
    'HasOne',
    'MorphMany',
    'MorphTo',
    'MorphToMany'
];

export default function HideFromIndex() {
    const [items, setItems] = useState([{ 
        type: 'field', 
        fieldType: 'Text',
        name: '' 
    }]);
    const [newItem, setNewItem] = useState('');
    const [selectedFieldType, setSelectedFieldType] = useState('Text');
    const [selectedRelationType, setSelectedRelationType] = useState('BelongsTo');
    const [activeTab, setActiveTab] = useState('field');

    const addItem = () => {
        if (newItem) {
            setItems([...items, { 
                type: activeTab, 
                fieldType: selectedFieldType,
                relationType: selectedRelationType,
                name: newItem 
            }]);
            setNewItem('');
        }
    };

    const removeItem = (index) => {
        const updated = [...items];
        updated.splice(index, 1);
        setItems(updated);
    };

    const generateCode = () => {
        if (items.length === 0) return '// Add fields or relationships to generate code';

        let code = "use Laravel\\Nova\\Http\\Requests\\NovaRequest;\n";
        code += "use Laravel\\Nova\\Fields\\\\{ " + 
            [...new Set(items.map(item => item.type === 'field' ? item.fieldType : item.relationType))].join(', ') + 
            " };\n\n";
        
        // Generate code for each item
        items.forEach(item => {
            if (item.type === 'field') {
                code += `${item.fieldType}::make('${item.name}')\n`;
            } else {
                code += `${item.relationType}::make('${item.name}')\n`;
            }
            code += "    ->hideFromIndex(fn(NovaRequest $request) => $request->viaRelationship())\n\n";
        });

        return code.trim();
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">Hide From Index</h3>
                <p className="text-gray-300 text-sm">
                    Generate code to hide fields or relationships when viewed from a related resource's index.
                </p>
                
                <div className="mt-4">
                    <div className="flex space-x-2 mb-4">
                        <button
                            onClick={() => setActiveTab('field')}
                            className={`px-4 py-2 rounded-t-md ${
                                activeTab === 'field' 
                                    ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-400' 
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            Fields
                        </button>
                        <button
                            onClick={() => setActiveTab('relationship')}
                            className={`px-4 py-2 rounded-t-md ${
                                activeTab === 'relationship' 
                                    ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-400' 
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            Relationships
                        </button>
                    </div>

                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {items.map((item, index) => (
                                <div key={index} className={`px-3 py-1 rounded-full text-sm flex items-center ${
                                    item.type === 'field' ? 'bg-blue-900/30 text-blue-200' : 'bg-purple-900/30 text-purple-200'
                                }`}>
                                    <span className="font-mono text-xs opacity-75 mr-1">
                                        {item.type === 'field' ? item.fieldType : item.relationType}
                                    </span>
                                    {item.name}
                                    <button 
                                        onClick={() => removeItem(index)}
                                        className="ml-1.5 text-gray-400 hover:text-white transition-colors"
                                        title="Remove"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col space-y-2">
                            <div className="flex">
                                {activeTab === 'field' ? (
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={selectedFieldType}
                                            onChange={(e) => setSelectedFieldType(e.target.value)}
                                            list="fieldTypes"
                                            className="w-full p-2 bg-gray-700 text-white rounded-l-md border-r border-gray-600"
                                            placeholder="Field type (e.g., Text, Number)"
                                        />
                                        <datalist id="fieldTypes">
                                            {FIELD_TYPES.map((type, index) => (
                                                <option key={`${type}-${index}`} value={type} />
                                            ))}
                                        </datalist>
                                    </div>
                                ) : (
                                    <select
                                        value={selectedRelationType}
                                        onChange={(e) => setSelectedRelationType(e.target.value)}
                                        className="bg-gray-700 text-white p-2 rounded-l-md border-r border-gray-600"
                                    >
                                        {RELATIONSHIP_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                )}
                                <input
                                    type="text"
                                    value={newItem}
                                    onChange={(e) => setNewItem(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                                    className="flex-1 p-2 bg-gray-700 text-white"
                                    placeholder={`Enter ${activeTab === 'field' ? 'field' : 'relationship'} name`}
                                />
                                <button
                                    onClick={addItem}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-md"
                                >
                                    Add {activeTab === 'field' ? 'Field' : 'Relationship'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <PhpSnippet code={generateCode()} />
                        <p className="text-xs text-gray-400 mt-2">
                            Use this code in your Nova resource's fields/relationships method.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
