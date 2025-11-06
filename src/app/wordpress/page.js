'use client';

import { Suspense } from 'react';
import WordPressSnippets from "@/app/components/wordpress/WordPressSnippets";

export default function WordPressPage() {
  return (
    <div className="w-full">
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }>
        <WordPressSnippets />
      </Suspense>
    </div>
  );
}
