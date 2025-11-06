'use client';
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
export default function WordPressSnippets() {
    return (
        <div className="w-full">
            <h2 id="wordpress-snippets" className='text-center text-2xl font-semibold my-6 text-blue-600'>WordPress Snippets</h2>
            <div className="w-full max-w-4xl mx-auto">
                <CreateUser />
                <UpdateUser />
            </div>
        </div>
    );
}