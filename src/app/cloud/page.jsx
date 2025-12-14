import AzureCommands from '@/app/components/cloud/AzureCommands';
import AWSCommands from '@/app/components/cloud/AWSCommands';

// This page is statically generated at build time and revalidated every hour
export const revalidate = 3600; // Revalidate at most every hour

// Generate static params for dynamic routes (if any)
export async function generateStaticParams() {
  return []; // Add any dynamic route params here if needed
}

export default function CloudPage() {
    return (
        <div className="w-full">
            <h2 id="cloud-snippets" className='text-center text-4xl font-semibold mb-6 text-blue-600'>Cloud Services</h2>
            <div className="w-full max-w-4xl mx-auto space-y-6">
                <div className="space-y-8">
                    <h3 id="cloud-azure" className="text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                        Azure
                    </h3>
                    <div className="component-wrapper p-6 rounded-lg shadow-lg">
                        <AzureCommands />
                    </div>

                    <h3 id="cloud-aws" className="text-xl font-semibold text-white border-b border-gray-700 pb-2 mb-4">
                        AWS
                    </h3>
                    <div className="component-wrapper p-6 rounded-lg shadow-lg">
                        <AWSCommands />
                    </div>
                </div>
            </div>
        </div>
    );
}

