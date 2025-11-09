import GitSnippets from '../components/git/GitSnippets';

// This page is statically generated at build time and revalidated every hour
export const revalidate = 3600; // Revalidate at most every hour

// Generate static params for dynamic routes (if any)
export async function generateStaticParams() {
  return []; // Add any dynamic route params here if needed
}

export default function GitPage() {
    return (
        <div className="min-h-screen  text-white p-4">
            <GitSnippets />
        </div>
    );
}
