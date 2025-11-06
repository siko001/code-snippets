'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function CreateUser() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: 'administrator',
        customRole: '',
        showCustomRole: false,
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const generateSnippet = () => {
        const { username, email, role, customRole, password } = formData;
        const selectedRole = role === 'custom' ? customRole : role;
        const passwordParam = password ? ` --user_pass=${password}` : '';
        return `wp user create ${username || '{username}'} ${email || '{email}'} --role=${selectedRole || 'subscriber'}${passwordParam}`;
    };

    const isFormComplete = formData.username && formData.email && 
        (formData.role !== 'custom' || (formData.role === 'custom' && formData.customRole));
    const snippet = generateSnippet();

    return (
        <div className="w-full bg-gray-800 p-4 rounded-lg">
            <h3 id="wp-create-user" className="text-blue-400 mb-4">Create User</h3>
            
            <CodeSnippet 
                code={snippet} 
                className="mb-4"
                copyButton={isFormComplete}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start text-left">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white"
                        placeholder="username"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white"
                        placeholder="user@example.com"
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

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                        Password (optional)
                    </label>
                    <input
                        type="text"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border border-blue-300 rounded-md bg-gray-700 text-white"
                        placeholder="Leave empty for auto-generated password"
                    />
                    <div className="text-xs mt-1 text-gray-400">
                        {!formData.password ? 'A password will be generated if left empty' : 'Using custom password'}
                    </div>
                </div>
            </div>
        </div>
    );
}