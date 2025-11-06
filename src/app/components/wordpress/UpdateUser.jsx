'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function UpdateUser() {
    const [formData, setFormData] = useState({
        username: '',
        field: 'password',
        value: '',
        role: 'administrator',
        customRole: '',
        showCustomRole: false,
        skipEmail: true,
        generatePassword: false,
        showAdvanced: false,
        showPassword: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleAdvanced = () => {
        setFormData(prev => ({
            ...prev,
            showAdvanced: !prev.showAdvanced
        }));
    };

    const generateSnippet = () => {
        const { username, field, value, role, customRole, skipEmail, generatePassword } = formData;
        const selectedRole = role === 'custom' ? customRole : role;
        
        let command = `wp user update ${username || '{username}'}`;
        
        // Add field to update
        if (field === 'password' && generatePassword) {
            command += ' --prompt=user_pass';
        } else if (field === 'role') {
            command += ` --role=${selectedRole}`;
        } else if (value) {
            command += ` --${field}=${value}`;
        } else if (field === 'password') {
            command += ' --prompt=user_pass';
        }
        
        // Add optional flags
        if (skipEmail) command += ' --skip-email';
        if (field === 'password' && !generatePassword) command += ` --user_pass=${value || 'your_password'}`;
        
        return command;
    };

    const isFormComplete = formData.username && 
        (formData.field !== 'role' || (formData.field === 'role' && (formData.role !== 'custom' || formData.customRole)));
    
    const snippet = generateSnippet();

    return (
        <div className="w-full bg-gray-800 p-4 rounded-lg mt-6">
            <h3 id="wp-update-user" className="text-blue-400 mb-4">Update User</h3>

            <CodeSnippet
                code={snippet}
                className="mb-4"
                copyButton={isFormComplete}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start text-left">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username or ID</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white"
                        placeholder="username or ID"
                    />
                </div>

                <div>
                    <label htmlFor="field" className="block text-sm font-medium text-gray-300 mb-1">Update Field</label>
                    <select
                        id="field"
                        name="field"
                        value={formData.field}
                        onChange={handleChange}
                        className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white h-[42px]"
                        style={{
                            appearance: 'none',
                            backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.7rem top 50%',
                            backgroundSize: '0.65rem auto',
                            paddingRight: '2.5rem',
                        }}
                    >
                        <option value="password">Password</option>
                        <option value="email">Email</option>
                        <option value="display_name">Display Name</option>
                        <option value="role">Role</option>
                        <option value="first_name">First Name</option>
                        <option value="last_name">Last Name</option>
                        <option value="url">Website URL</option>
                        <option value="description">Biographical Info</option>
                    </select>
                </div>

                {formData.field === 'password' ? (
                    <div className="md:col-span-2">
                        <div className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                id="generatePassword"
                                name="generatePassword"
                                checked={formData.generatePassword}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
                            />
                            <label htmlFor="generatePassword" className="ml-2 text-sm text-gray-300">
                                Prompt for password (recommended)
                            </label>
                        </div>
                        {!formData.generatePassword && (
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    id="value"
                                    name="value"
                                    value={formData.value}
                                    onChange={handleChange}
                                    className="flex-1 p-2 border border-blue-300 rounded-l-md bg-gray-700 text-white"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const randomPass = Math.random().toString(36).slice(-12);
                                        setFormData(prev => ({
                                            ...prev,
                                            value: randomPass
                                        }));
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-md transition-colors"
                                >
                                    Generate
                                </button>
                            </div>
                        )}
                    </div>
                ) : formData.field === 'role' ? (
                    <div className="md:col-span-2">
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={(e) => {
                                const isCustom = e.target.value === 'custom';
                                setFormData(prev => ({
                                    ...prev,
                                    role: e.target.value,
                                    showCustomRole: isCustom
                                }));
                            }}
                            className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white h-[42px]"
                            style={{
                                appearance: 'none',
                                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.7rem top 50%',
                                backgroundSize: '0.65rem auto',
                                paddingRight: '2.5rem',
                            }}
                        >
                            <option value="subscriber">Subscriber</option>
                            <option value="contributor">Contributor</option>
                            <option value="author">Author</option>
                            <option value="editor">Editor</option>
                            <option value="administrator">Administrator</option>
                            <option value="custom">Custom Role</option>
                        </select>
                        {formData.showCustomRole && (
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="customRole"
                                    value={formData.customRole}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white mt-2"
                                    placeholder="Enter custom role name"
                                />
                                {!formData.customRole && (
                                    <p className="text-yellow-400 text-xs mt-1">Please enter a custom role name</p>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="md:col-span-2">
                        <label htmlFor="value" className="block text-sm font-medium text-gray-300 mb-1">
                            New {formData.field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </label>
                        <input
                            type={formData.field === 'email' ? 'email' : 'text'}
                            id="value"
                            name="value"
                            value={formData.value}
                            onChange={handleChange}
                            className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white"
                            placeholder={`Enter new ${formData.field.replace('_', ' ')}`}
                        />
                    </div>
                )}

                <div className="md:col-span-2">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="skipEmail"
                            name="skipEmail"
                            checked={formData.skipEmail}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
                        />
                        <label htmlFor="skipEmail" className="ml-2 text-sm text-gray-300">
                            Skip sending email notification
                        </label>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <button
                        type="button"
                        onClick={toggleAdvanced}
                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                    >
                        {formData.showAdvanced ? '▼' : '▶'} Advanced Options
                    </button>
                    
                    {formData.showAdvanced && (
                        <div className="mt-2 p-3 bg-gray-700 rounded-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="showPassword"
                                            name="showPassword"
                                            checked={formData.showPassword}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="showPassword" className="ml-2 text-sm text-gray-300">
                                            Show password in command
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
