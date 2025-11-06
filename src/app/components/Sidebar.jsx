'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('server');
    const [expandedSections, setExpandedSections] = useState({
        server: true,
        git: false,
        wordpress: false
    });
    const menuRef = useRef(null);
    const pathname = usePathname();
    
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    useEffect(() => {
        // Set active section based on current path
        if (pathname.includes('wordpress')) {
            setActiveSection('wordpress');
        } else if (pathname.includes('git')) {
            setActiveSection('git');
        } else {
            setActiveSection('server');
        }
    }, [pathname]);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const menuSections = {
        server: {
            title: 'Server Snippets',
            items: [
                { name: 'Server to Machine', href: '/server/#server-to-desktop' },
                { name: 'Machine to Server', href: '/server/#machine-to-server' },
                { name: 'File Operations', href: '/server/#file-operations' },
                { name: 'Zip Operations', href: '/server/#zip-operations' },
            ]
        },
        git: {
            title: 'Git Commands',
            items: [
                { name: 'Repository', href: '/git/#git-repo' },
                { name: 'Branching', href: '/git/#git-branch' },
                { name: 'Commits', href: '/git/#git-commit' },
                { name: 'Push, Pull & Fetch', href: '/git/#git-remote' },
                { name: 'Stashing', href: '/git/#git-stash' },
                { name: 'Undo Changes', href: '/git/#git-undo' },
                { name: 'View History', href: '/git/#git-history' },
            ]
        },
        wordpress: {
            title: 'WordPress Snippets',
            items: [
                { name: 'Create User', href: '/wordpress/#wp-create-user' },
                { name: 'Update User', href: '/wordpress/#wp-update-user' },
                { name: 'Search & Replace', href: '/wordpress/#wp-search-replace' },
                { name: 'Database Manager', href: '/wordpress/#wp-database-manager' },
                { name: 'Plugin Manager', href: '/wordpress/#wp-plugin-manager' },
                { name: 'Cron Manager', href: '/wordpress/#wp-cron-manager' },
                { name: 'Developer Tools', href: '/wordpress/#wp-dev-tools' },
            ]
        }
    };
        const handleMenuClick = (e, href) => {
            e.stopPropagation();
            
            const [path, hash] = href.split('#');
            const currentPath = window.location.pathname.replace(/\/$/, '');
            const targetPath = path.replace(/\/$/, '');
            
            // Close mobile menu
            setIsOpen(false);
            
            if (currentPath.endsWith(targetPath) && hash) {
                requestAnimationFrame(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        // Get the exact position
                        const headerOffset = 80;
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            } else {
                window.location.href = href;
            }
    };

    return (
        <div className="fixed top-4 right-4 z-50" ref={menuRef}>
            <div className="relative">
                <button 
                    className="p-2 bg-gray-800 rounded-md text-white hover:bg-gray-700 transition-colors z-50 cursor-pointer"
                    aria-label="Menu"
                    onClick={() => {
                        setIsOpen(!isOpen);
                        // Auto-expand current section when opening menu
                        if (!isOpen) {
                            setExpandedSections(prev => ({
                                ...prev,
                                [activeSection]: true
                            }));
                        }
                    }}
                    type="button"
                    style={{ position: 'fixed', top: '1rem', right: '1rem' }}
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M4 6h16M4 12h16M4 18h16" 
                        />
                    </svg>
                </button>
                
                {isOpen && (
                    <div className="absolute right-0 top-12 max-h-[calc(100vh-10rem)] w-72 bg-gray-800 rounded-md shadow-lg overflow-y-auto">
                        <div className="p-2">
                            {Object.entries(menuSections).map(([key, section]) => (
                                <div key={key} className="mb-2">
                                    <button
                                        className={`w-full flex justify-between items-center px-4 py-3 text-left text-blue-600 hover:bg-gray-700 rounded-md transition-colors ${activeSection === key ? 'bg-gray-700' : ''}`}
                                        onClick={() => toggleSection(key)}
                                    >
                                        <span className="font-medium">{section.title}</span>
                                        <svg
                                            className={`w-5 h-5 transition-transform duration-200 ${expandedSections[key] ? 'transform rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    <div 
                                        className={`overflow-hidden transition-all duration-200 ease-in-out ${expandedSections[key] ? 'max-h-96' : 'max-h-0'}`}
                                    >
                                        <nav className="py-2 pl-4">
                                            <ul>
                                                {section.items.map((item) => (
                                                    <li key={item.href} className="mb-1">
                                                        <div 
                                                            className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
                                                            onClick={(e) => handleMenuClick(e, item.href)}
                                                        >
                                                            {item.name}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
