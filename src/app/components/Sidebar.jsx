'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('server');
    const menuRef = useRef(null);
    const pathname = usePathname();

    useEffect(() => {
        // Set active section based on current path
        if (pathname.includes('wordpress')) {
            setActiveSection('wordpress');
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
            ]
        },
        wordpress: {
            title: 'WordPress Snippets',
            items: [
                { name: 'Create User', href: '/wordpress/#wp-create-user' },
                // Add more WordPress snippets here as needed
            ]
        }
    };

    const scrollToSection = (e, href) => {
        e.preventDefault();
        const sectionId = href.split('#')[1];
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    return (
        <div className="fixed top-4 right-4 z-50" ref={menuRef}>
            <div className="relative">
                <button 
                    className="p-2 bg-gray-800 rounded-md text-white hover:bg-gray-700 transition-colors z-50 cursor-pointer"
                    aria-label="Menu"
                    onClick={() => setIsOpen(!isOpen)}
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
                    <div className="absolute right-0 top-12 w-72 bg-gray-800 rounded-md shadow-lg overflow-hidden">
                        <div className="p-4">
                            <h3 className="text-lg font-medium text-blue-500 mb-2">Server Snippets</h3>
                            <nav className="mb-4">
                                <ul>
                                    {menuSections.server.items.map((item) => (
                                        <li key={item.href} className="mb-1">
                                            <Link 
                                                href={item.href}
                                                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                                                onClick={(e) => {
                                                    if (item.href.startsWith('#')) {
                                                        scrollToSection(e, item.href);
                                                    } else {
                                                        setIsOpen(false);
                                                    }
                                                }}
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            
                            <div className="border-t border-gray-700 my-3"></div>
                            
                            <h3 className="text-lg font-medium text-blue-500 mb-2">WordPress Snippets</h3>
                            <nav>
                                <ul>
                                    {menuSections.wordpress.items.map((item) => (
                                        <li key={item.href} className="mb-1">
                                            <Link 
                                                href={item.href}
                                                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                                                onClick={(e) => {
                                                    if (item.href.startsWith('#')) {
                                                        scrollToSection(e, item.href);
                                                    } else {
                                                        setIsOpen(false);
                                                    }
                                                }}
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
