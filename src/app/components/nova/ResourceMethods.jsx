'use client';

import { useState } from 'react';
import PhpSnippet from '../PhpSnippet';

const ResourceMethods = () => {
    const [activeTab, setActiveTab] = useState('display');
    const [formData, setFormData] = useState({
        // Display
        label: 'Resources',
        singularLabel: 'Resource',
        group: 'Admin',
        priority: 1,
        icon: 'collection',
        
        // Buttons
        createButtonLabel: 'Create :resource',
        updateButtonLabel: 'Update :resource',
        deleteButtonLabel: 'Delete :resource',
        forceDeleteButtonLabel: 'Force Delete :resource',
        restoreButtonLabel: 'Restore :resource',
        
        defaultSort: 'created_at',
        sortDirection: 'desc',
        

        
        // Pagination
        perPageOptions: [10, 25, 50, 100],
        perPageViaRelationship: 10,
        
        // Relationships
        withRelations: ['author', 'category'],
        preventGates: false,
        
        // Authorization
        authorizable: true,
        viewPolicy: 'view',
        createPolicy: 'create',
        updatePolicy: 'update',
        deletePolicy: 'delete',
        restorePolicy: 'restore',
        forceDeletePolicy: 'forceDelete',
        
        // Customization
        uriKey: 'custom-resource',
        globallySearchable: true,
    });

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const tabs = [
        {
            id: 'display',
            name: 'Display',
            description: 'Customize how the resource appears in the Nova UI',
            fields: [
                { name: 'label', label: 'Plural Label', placeholder: 'e.g., Products' },
                { name: 'singularLabel', label: 'Singular Label', placeholder: 'e.g., Product' },
                { name: 'group', label: 'Navigation Group', placeholder: 'e.g., Admin' },
                { name: 'priority', label: 'Navigation Priority', type: 'number', placeholder: '1' },
                { name: 'icon', label: 'Navigation Icon', placeholder: 'e.g., collection' },
            ]
        },
        {
            id: 'buttons',
            name: 'Buttons',
            description: 'Customize button labels and actions',
            fields: [
                { name: 'createButtonLabel', label: 'Create Button', placeholder: 'e.g., Create :resource' },
                { name: 'updateButtonLabel', label: 'Update Button', placeholder: 'e.g., Update :resource' },
                { name: 'deleteButtonLabel', label: 'Delete Button', placeholder: 'e.g., Delete :resource' },
                { name: 'forceDeleteButtonLabel', label: 'Force Delete Button', placeholder: 'e.g., Force Delete :resource' },
                { name: 'restoreButtonLabel', label: 'Restore Button', placeholder: 'e.g., Restore :resource' },
            ]
        },
        {
            id: 'title',
            name: 'Ordering',
            description: 'Configure how resources are displayed and sorted',
            fields: [
                { name: 'defaultSort', label: 'Default Sort Field', placeholder: 'e.g., created_at' },
                { 
                    name: 'sortDirection', 
                    label: 'Sort Direction', 
                    type: 'select',
                    options: [
                        { value: 'asc', label: 'Ascending' },
                        { value: 'desc', label: 'Descending' }
                    ]
                },
            ]
        },
        {
            id: 'pagination',
            name: 'Pagination',
            description: 'Configure pagination options',
            fields: [
                { name: 'perPageOptions', label: 'Items Per Page Options', placeholder: 'e.g., 10,25,50,100' },
                { name: 'perPageViaRelationship', label: 'Items Per Page (Relationships)', type: 'number', placeholder: '10' },
            ]
        },
        {
            id: 'relationships',
            name: 'Relationships',
            description: 'Configure relationship loading',
            fields: [
                { name: 'withRelations', label: 'Eager Load Relations', placeholder: 'e.g., author,category' },
                { name: 'preventGates', label: 'Disable Policy Gates', type: 'checkbox' },
            ]
        },
        {
            id: 'authorization',
            name: 'Authorization',
            description: 'Configure authorization policies',
            fields: [
                { name: 'viewPolicy', label: 'View Policy', placeholder: 'e.g., view' },
                { name: 'createPolicy', label: 'Create Policy', placeholder: 'e.g., create' },
                { name: 'updatePolicy', label: 'Update Policy', placeholder: 'e.g., update' },
                { name: 'deletePolicy', label: 'Delete Policy', placeholder: 'e.g., delete' },
                { name: 'restorePolicy', label: 'Restore Policy', placeholder: 'e.g., restore' },
                { name: 'forceDeletePolicy', label: 'Force Delete Policy', placeholder: 'e.g., forceDelete' },
                { name: 'authorizable', label: 'Enable Authorization', type: 'checkbox' },
            ]
        },
        {
            id: 'advanced',
            name: 'Advanced',
            description: 'Advanced configuration options',
            fields: [
                { name: 'uriKey', label: 'URI Key', placeholder: 'e.g., custom-resource' },
                { name: 'globallySearchable', label: 'Globally Searchable', type: 'checkbox' },
            ]
        }
    ];

    const generateCode = () => {
        const currentTab = tabs.find(tab => tab.id === activeTab);
        if (!currentTab) return '';

        switch (activeTab) {
            case 'display':
                return `/**
 * Get the displayable label of the resource.
 *
 * @return string
 */
public static function label()
{
    return '${formData.label}';
}

/**
 * Get the displayable singular label of the resource.
 *
 * @return string
 */
public static function singularLabel()
{
    return '${formData.singularLabel}';
}

/**
 * The logical group associated with the resource.
 *
 * @var string
 */
public static \$group = '${formData.group}';

/**
 * The priority of the resource in the sidebar.
 *
 * @var int
 */
public static \$priority = ${formData.priority};

/**
 * The icon associated with the resource.
 *
 * @var string
 */
public static \$icon = '${formData.icon}';`;

            case 'buttons':
                return `/**
 * Get the text for the create resource button.
 *
 * @return string
 */
public static function createButtonLabel()
{
    return '${formData.createButtonLabel}';
}

/**
 * Get the text for the update resource button.
 *
 * @return string
 */
public static function updateButtonLabel()
{
    return '${formData.updateButtonLabel}';
}

/**
 * Get the text for the delete resource button.
 *
 * @return string
 */
public static function deleteButtonLabel()
{
    return '${formData.deleteButtonLabel}';
}

/**
 * Get the text for the force delete resource button.
 *
 * @return string
 */
public static function forceDeleteButtonLabel()
{
    return '${formData.forceDeleteButtonLabel}';
}

/**
 * Get the text for the restore resource button.
 *
 * @return string
 */
public static function restoreButtonLabel()
{
    return '${formData.restoreButtonLabel}';
}`;

            case 'title':
                return `
/**
 * The column that should be used for sorting.
 *
 * @var string
 */
public static \$defaultSort = '${formData.defaultSort}';

/**
 * The direction that should be used for sorting.
 *
 * @var string
 */
public static \$sort = ['${formData.defaultSort}' => '${formData.sortDirection}'];`;
            case 'pagination':
                return `/**
 * The number of resources to show per page via relationships.
 *
 * @var int
 */
public static \$perPageViaRelationship = ${formData.perPageViaRelationship};

/**
 * The pagination per-page options.
 *
 * @return array
 */
public static function perPageOptions()
{
    return [${formData.perPageOptions}];
}`;

            case 'relationships':
                return `/**
 * The relationships that should be eager loaded.
 *
 * @var array
 */
public static \$with = [${formData.withRelations}];

/**
 * Indicates if the resource should prevent the user from using policy gates.
 *
 * @var bool
 */
public static \$preventGates = ${formData.preventGates ? 'true' : 'false'};`;

            case 'authorization':
                return `/**
 * Determine if the resource should be available for the given request.
 *
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  \$request
 * @return bool
 */
public static function authorizable()
{
    return ${formData.authorizable ? 'true' : 'false'};
}

/**
 * Determine if the current user can view the given resource.
 *
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  \$request
 * @return bool
 */
public function authorizedToView(\$request)
{
    return \$request->user()->can('${formData.viewPolicy}', \$this);
}

/**
 * Determine if the current user can create new resources.
 *
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  \$request
 * @return bool
 */
public static function authorizedToCreate(\$request)
{
    return \$request->user()->can('${formData.createPolicy}', static::class);
}

/**
 * Determine if the current user can update the given resource.
 *
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  \$request
 * @return bool
 */
public function authorizedToUpdate(\$request)
{
    return \$request->user()->can('${formData.updatePolicy}', \$this);
}

/**
 * Determine if the current user can delete the given resource.
 *
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  \$request
 * @return bool
 */
public function authorizedToDelete(\$request)
{
    return \$request->user()->can('${formData.deletePolicy}', \$this);
}

/**
 * Determine if the current user can restore the given resource.
 *
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  \$request
 * @return bool
 */
public function authorizedToRestore(\$request)
{
    return \$request->user()->can('${formData.restorePolicy}', \$this);
}

/**
 * Determine if the current user can force delete the given resource.
 *
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  \$request
 * @return bool
 */
public function authorizedToForceDelete(\$request)
{
    return \$request->user()->can('${formData.forceDeletePolicy}', \$this);
}`;

            case 'advanced':
                return `/**
 * Get the URI key for the resource.
 *
 * @return string
 */
public static function uriKey()
{
    return '${formData.uriKey}';
}

/**
 * Indicates if the resource should be globally searchable.
 *
 * @var bool
 */
public static \$globallySearchable = ${formData.globallySearchable ? 'true' : 'false'};`;

            default:
                return '';
        }
    };

    const currentTab = tabs.find(tab => tab.id === activeTab) || tabs[0];

    const renderField = (field) => {
        switch (field.type) {
            case 'checkbox':
                return (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id={field.name}
                            checked={formData[field.name]}
                            onChange={(e) => updateField(field.name, e.target.checked)}
                            className="rounded bg-gray-700 border-gray-600 text-blue-500"
                        />
                        <label htmlFor={field.name} className="ml-2 text-sm text-gray-300">
                            {field.label}
                        </label>
                    </div>
                );
            case 'select':
                return (
                    <select
                        id={field.name}
                        value={formData[field.name]}
                        onChange={(e) => updateField(field.name, e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                    >
                        {field.options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            case 'number':
                return (
                    <input
                        type="number"
                        id={field.name}
                        value={formData[field.name]}
                        onChange={(e) => updateField(field.name, parseInt(e.target.value))}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                        placeholder={field.placeholder}
                    />
                );
            default:
                return (
                    <input
                        type="text"
                        id={field.name}
                        value={formData[field.name]}
                        onChange={(e) => updateField(field.name, e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                        placeholder={field.placeholder}
                    />
                );
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-xl font-medium !text-blue-400">Resource Methods</h3>
                <p className="text-sm description">
                    Customize how your Nova resource appears and behaves with these methods.
                </p>
            </div>

            <div className=" border-gray-700 tab-bg p-1.5 rounded-lg overflow-x-auto">
                <nav className=" px-2 flex gap-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap px-3 py-1 rounded-md  font-medium text-sm ${
                                activeTab === tab.id
                                    ? 'bg-blue-600 text-white'
                                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                            }`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="space-y-4">
                <p className="text-sm description">{currentTab.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    {currentTab.fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                            {field.type !== 'checkbox' && (
                                <label htmlFor={field.name} className="block text-sm font-medium text-gray-300">
                                    {field.label}
                                </label>
                            )}
                            {renderField(field)}
                            {field.help && (
                                <p className="text-xs text-gray-400">{field.help}</p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <PhpSnippet code={generateCode()} />
                    <p className="text-xs description mt-2">
                        Add these methods to your Nova resource class.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResourceMethods;