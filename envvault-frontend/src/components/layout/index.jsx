import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col md:flex-row relative">
      <Sidebar />
      
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen w-full relative">
        <Navbar />
        
        <main className="flex-1 p-6 md:p-10 overflow-auto relative">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
