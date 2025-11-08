import './globals.css';
import { NotificationProvider } from './contexts/NotificationContext';
import Notification from './components/Notification';
import Sidebar from './components/Sidebar';

export const metadata = {
  title: "Code Snippets",
  description: "Handy code snippets for developers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative scroll-smooth">
        <NotificationProvider>
          <div className="min-h-screen">
            <Sidebar />
            <main className="p-4 sm:p-6 max-w-7xl mx-auto">
              <div className="mt-4 pt-10 pb-16">
                {children}
              </div>
            </main>
          </div>
          <Notification />
        </NotificationProvider>
        
        {process.env.NODE_ENV !== 'production' && (
          <div className="fixed bottom-0.5 right-0.5 bg-gray-200 rounded p-0.5 font-bold text-center text-black">
            <div className="hidden 2xl:block p-3">2XL</div>
            <div className="hidden xl:block 2xl:hidden p-2.5">XL</div>
            <div className="hidden lg:block xl:hidden p-2">LG</div>
            <div className="hidden md:block lg:hidden p-1.5">MD</div>
            <div className="block md:hidden p-1">SM</div>
          </div>
        )}
      </body>
    </html>
  );
}
