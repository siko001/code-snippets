'use client';

export default function GitPage() {
    return (
        <div className="min-h-screen  text-white p-4">
            <GitSnippets />
        </div>
    );
}

// Import the GitSnippets component at the bottom to avoid hoisting issues
import GitSnippets from '../components/git/GitSnippets';
