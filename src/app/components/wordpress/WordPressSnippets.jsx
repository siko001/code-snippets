'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
import SearchReplace from './SearchReplace';
import DatabaseManager from './DatabaseManager';
import PluginManager from './PluginManager';
import CronManager from './CronManager';
import DeveloperTools from './DeveloperTools';

// Smooth scroll function with custom easing
const smoothScrollTo = (element, duration = 1000) => {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80; // 80px offset from top
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        
        // Easing function (easeInOutCubic)
        const easeInOutCubic = t => t < 0.5 
            ? 4 * t * t * t 
            : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            
        window.scrollTo(0, startPosition + distance * easeInOutCubic(percentage));
        
        if (progress < duration) {
            window.requestAnimationFrame(step);
        }
    }

    window.requestAnimationFrame(step);
};

export default function WordPressSnippets() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Handle hash-based scrolling on initial load
        const handleHash = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                // Small delay to ensure the page is fully rendered
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        smoothScrollTo(element, 1200); // Slightly longer duration for smoother scroll
                    }
                }, 100);
            }
        };

        // Run on initial load
        const timer = setTimeout(handleHash, 100);

        // Also run when URL changes (for client-side navigation)
        window.addEventListener('hashchange', handleHash, { passive: true });
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('hashchange', handleHash, { passive: true });
        };
    }, [pathname, searchParams]);

    return (
        <div className="w-full">
            <h2 id="wordpress-snippets" className='text-center text-4xl font-semibold my-6 text-blue-600'>WordPress Snippets</h2>
            <div className="w-full max-w-4xl mx-auto space-y-8">
                <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">User Management</h3>
                    <CreateUser />
                    <UpdateUser />
                </div>
                
                <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Database Operations</h3>
                    <SearchReplace />
                    <DatabaseManager />
                </div>

                <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Plugin Management</h3>
                    <PluginManager />
                </div>

                <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Cron Management</h3>
                    <CronManager />
                </div>

                <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Developer Tools</h3>
                    <DeveloperTools />
                </div>
            </div>
        </div>
    );
}