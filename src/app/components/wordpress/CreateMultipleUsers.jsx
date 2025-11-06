'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function CreateMultipleUsers() {
    const [formData, setFormData] = useState({
        count: 1,
        role: 'administrator',
        customRole: '',
        showCustomRole: false,
        useRandomPassword: true,
        password: '',
        baseUsername: 'user',
        domain: 'example.com'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleRandomPassword = () => {
        setFormData(prev => ({
            ...prev,
            useRandomPassword: !prev.useRandomPassword,
            password: ''
        }));
    };

    const generateRandomPassword = () => {
        return `$(openssl rand -base64 12)`;
    };

    const generateSnippet = () => {
        const { count, role, customRole, useRandomPassword, password, baseUsername, domain } = formData;
        const selectedRole = role === 'custom' ? customRole : role;
        const passwordPart = useRandomPassword ? '$(openssl rand -base64 12)' : password;
        
        return `for i in {1..${count || 1}}; do wp user create ${baseUsername || 'user'}$i ${baseUsername || 'user'}$i@${domain || 'example.com'} --role=${selectedRole || 'subscriber'} --user_pass=${passwordPart}; done`;
    };

    const isFormComplete = formData.count > 0 && 
                         (formData.role !== 'custom' || (formData.role === 'custom' && formData.customRole));
    
    const snippet = generateSnippet();

    return (
        <div className="w-full bg-gray-800 p-4 rounded-lg mt-4">
            <h3 id="wp-create-multiple-users" className="text-blue-400 mb-4">Create Multiple Users</h3>

            <CodeSnippet
                code={snippet}
                className="mb-4"
                copyButton={isFormComplete}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start text-left">
                <div>
                    <label htmlFor="baseUsername" className="block text-sm font-medium text-gray-300 mb-1">Base Username</label>
                    <input
                        type="text"
                        id="baseUsername"
                        name="baseUsername"
                        value={formData.baseUsername}
                        onChange={handleChange}
                        className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white"
                        placeholder="user"
                    />
                </div>

                <div>
                    <label htmlFor="domain" className="block text-sm font-medium text-gray-300 mb-1">Domain</label>
                    <input
                        type="text"
                        id="domain"
                        name="domain"
                        value={formData.domain}
                        onChange={handleChange}
                        className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white"
                        placeholder="example.com"
                    />
                </div>

                <div>
                    <label htmlFor="count" className="block text-sm font-medium text-gray-300 mb-1">Number of Users</label>
                    <input
                        type="number"
                        id="count"
                        name="count"
                        min="1"
                        value={formData.count}
                        onChange={handleChange}
                        className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white"
                    />
                </div>

                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">Role</label>
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
                                className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white mt-1"
                                placeholder="Enter custom role name"
                            />
                            {!formData.customRole && (
                                <p className="text-yellow-400 text-xs mt-1">Please enter a custom role name</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="md:col-span-2">
                    <div className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            id="useRandomPassword"
                            checked={formData.useRandomPassword}
                            onChange={toggleRandomPassword}
                            className="h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
                        />
                        <label htmlFor="useRandomPassword" className="ml-2 text-sm text-gray-300">
                            Use random password for each user
                        </label>
                    </div>

                    {!formData.useRandomPassword && (
                        <div className="flex items-center">
                            <input
                                type="text"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="flex-1 p-2 border border-blue-300 rounded-l-md bg-gray-700 text-white"
                                placeholder="Password for all users"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const randomPass = Math.random().toString(36).slice(-12);
                                    setFormData(prev => ({
                                        ...prev,
                                        password: randomPass
                                    }));
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-md transition-colors"
                            >
                                Randomize
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
