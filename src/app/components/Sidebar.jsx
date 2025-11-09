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
    const [currentHash, setCurrentHash] = useState('');
    const [activeItem, setActiveItem] = useState('');
    const menuRef = useRef(null);
    const observerRef = useRef(null);
    const pathname = usePathname();
    
    const toggleSection = (section) => {
        setExpandedSections(prev => {
            // Close all sections first
            const newState = Object.keys(prev).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {});
            
            // Open the clicked section if it was closed
            if (!prev[section]) {
                newState[section] = true;
            }
            
            return newState;
        });
    };

    // Set up intersection observer to track visible sections
    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;
        
        let lastScrollTop = 0;
        
        const handleIntersection = (entries, observer) => {
            // Get scroll direction
            const st = window.pageYOffset || document.documentElement.scrollTop;
            const scrollDirection = st > lastScrollTop ? 'down' : 'up';
            lastScrollTop = st <= 0 ? 0 : st;
            
            // Find the most relevant entry
            let mostVisibleEntry = null;
            let maxVisibility = 0;
            
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Calculate visibility percentage
                    const rect = entry.boundingClientRect;
                    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
                    const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
                    const visibility = (visibleHeight / rect.height) * 100;
                    
                    if (visibility > maxVisibility) {
                        maxVisibility = visibility;
                        mostVisibleEntry = entry;
                    } else if (visibility === maxVisibility && mostVisibleEntry) {
                        // If visibility is the same, choose based on scroll direction
                        const currentRect = entry.boundingClientRect;
                        const mostVisibleRect = mostVisibleEntry.boundingClientRect;
                        
                        if ((scrollDirection === 'down' && currentRect.top > mostVisibleRect.top) ||
                            (scrollDirection === 'up' && currentRect.top < mostVisibleRect.top)) {
                            mostVisibleEntry = entry;
                        }
                    }
                }
            });
            
            // Update active item if we found a visible entry
            if (mostVisibleEntry) {
                const id = mostVisibleEntry.target.id;
                if (id) {
                    setActiveItem(id);
                    setCurrentHash(`#${id}`);
                }
            }
        };

        // Create observer with more sensitive options
        observerRef.current = new IntersectionObserver(handleIntersection, {
            root: null,
            rootMargin: '-20% 0px -70% 0px', // Adjust these values to control when the callback is triggered
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
        });

        // Observe all sections with IDs
        document.querySelectorAll('section[id], h2[id], h3[id]').forEach((section) => {
            observerRef.current.observe(section);
        });

        // Cleanup
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [pathname]); // Re-run when path changes
    
    // Handle initial hash and hash changes
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const handleHashChange = () => {
            const hash = window.location.hash;
            setCurrentHash(hash);
            if (hash) {
                setActiveItem(hash.substring(1)); // Remove the '#'
                // Smooth scroll to the element
                const element = document.getElementById(hash.substring(1));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };
        
        // Initial check
        handleHashChange();
        
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [pathname]);
    
    useEffect(() => {
        // Set active section based on current path and expand it
        let section = 'server'; // default
        
        if (pathname.includes('wordpress')) {
            section = 'wordpress';
        } else if (pathname.includes('git')) {
            section = 'git';
        } else if (pathname.includes('composer')) {
            section = 'composer';
        } else if (pathname.includes('sql')) {
            section = 'sql';
        } else if (pathname.includes('shell')) {
            section = 'shell';
        } else if (pathname.includes('lando')) {
            section = 'lando';
        }
        
        setActiveSection(section);
        
        // Expand only the active section
        setExpandedSections(prev => {
            const newState = {};
            Object.keys(prev).forEach(key => {
                newState[key] = key === section;
            });
            return newState;
        });
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
                { name: 'Zip Operations', href: '/server/#zip-operations' },
                { name: 'File Operations', href: '/server/#file-operations' },
                { name: 'SSH Key Management', href: '/server/#ssh-key-management' },
                { name: 'SSH Agent Management', href: '/server/#ssh-agent-management' },
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
        
        composer: {
            title: 'Composer Snippets',
            items: [
                { name: 'Management', href: '/composer/#composer-management' },
                { name: 'Timeout', href: '/composer/#composer-timeout' },
                { name: 'Install', href: '/composer/#composer-install' },
            ]
        },
        
        sql: {
            title: 'SQL Snippets',
            items: [
                { name: 'Connection', href: '/sql/#sql-connection' },
                { name: 'Databases', href: '/sql/#sql-databases' },
                { name: 'Tables', href: '/sql/#sql-tables' },
            ]
        },
        
        shell: {
            title: 'Shell Commands',
            items: [
                { name: 'Network', href: '/shell/#shell-network' },
                { name: 'Shell Config', href: '/shell/#shell-config' },
            ]
        },
        
        lando: {
            title: 'Lando',
            items: [
                { name: 'Basic Commands', href: '/lando/#lando-basic' },
                { name: 'Configuration', href: '/lando/#lando-config' },
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
        },
        
        
            nova: {
            title: 'Laravel Nova',
            items: [
                { name: 'Resource Title', href: '/nova/#nova-resource-title' },
                { name: 'Search', href: '/nova/#nova-search' },
                { name: 'Index Query', href: '/nova/#nova-index-query' },
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
        
        if (currentPath.endsWith(targetPath)) {
            if (hash) {
                // Update URL without page reload
                window.history.pushState({}, '', `#${hash}`);
                setCurrentHash(`#${hash}`);
                setActiveItem(hash);
                
                const element = document.getElementById(hash);
                if (element) {
                    // Smooth scroll to the element
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Just close the menu if it's a same-page link without hash
                setIsOpen(false);
            }
        } else {
            // Navigate to a different page
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
                
                <div 
                    className={`absolute right-0 top-12 w-72 component-wrapper rounded-md shadow-lg overflow-hidden transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[calc(100vh-10rem)]' : 'max-h-0'}`}
                    style={{
                        transitionProperty: 'max-height',
                        willChange: 'max-height',
                    }}
                >
                    <div className="overflow-y-auto max-h-[calc(100vh-15rem)] p-2">
                            {Object.entries(menuSections).map(([key, section]) => (
                                <div key={key} className="mb-2">
                                    <button
                                        className={`w-full flex justify-between items-center px-4 py-3 text-left text-blue-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors ${activeSection === key ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
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
                                        className={`overflow-hidden font-quicksand font-bold transition-all duration-200 ease-in-out ${expandedSections[key] ? 'max-h-96' : 'max-h-0'}`}
                                    >
                                        <nav className="py-2 pl-4">
                                            <ul>
                                                {section.items.map((item) => (
                                                    <li key={item.href} className="mb-1">
                                                        <div 
                                                            className={`block px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                                                                (item.href.includes('#') && item.href.split('#')[1] === activeItem) || 
                                                                (!item.href.includes('#') && pathname === item.href)
                                                                    ? 'bg-blue-900 text-white' 
                                                                    : 'text-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 hover:bg-gray-200'
                                                            }`}
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
            </div>
        </div>
    );
}
