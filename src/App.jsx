import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const location = useLocation();
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const SunIcon = getIcon('Sun');
  const MoonIcon = getIcon('Moon');
  const MenuIcon = getIcon('Menu');
  const XIcon = getIcon('X');
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-surface-800 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                FreeLink
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/" className={`text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-white font-medium transition-colors ${location.pathname === '/' ? 'text-primary dark:text-white' : ''}`}>
                  Dashboard
                </Link>
                <Link to="/clients" className={`text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-white font-medium transition-colors ${location.pathname === '/clients' ? 'text-primary dark:text-white' : ''}`}>
                  Clients
                </Link>
                <Link to="/projects" className={`text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-white font-medium transition-colors ${location.pathname === '/projects' ? 'text-primary dark:text-white' : ''}`}>
                  Projects
                </Link>
                <Link to="/invoices" className={`text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-white font-medium transition-colors ${location.pathname === '/invoices' ? 'text-primary dark:text-white' : ''}`}>
                  Invoices
                </Link>
              </nav>
              
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <SunIcon className="w-5 h-5 text-yellow-400" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-surface-700" />
                )}
              </button>
              
              <button 
                className="md:hidden p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <XIcon className="w-5 h-5" />
                ) : (
                  <MenuIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-3 pb-3"
            >
              <nav className="flex flex-col space-y-3">
                <Link 
                  to="/" 
                  className={`px-3 py-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors ${location.pathname === '/' ? 'bg-surface-100 dark:bg-surface-700 text-primary dark:text-white' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/clients" 
                  className={`px-3 py-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors ${location.pathname === '/clients' ? 'bg-surface-100 dark:bg-surface-700 text-primary dark:text-white' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Clients
                </Link>
                <Link 
                  to="/projects" 
                  className={`px-3 py-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors ${location.pathname === '/projects' ? 'bg-surface-100 dark:bg-surface-700 text-primary dark:text-white' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Projects
                </Link>
                <Link 
                  to="/invoices" 
                  className={`px-3 py-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors ${location.pathname === '/invoices' ? 'bg-surface-100 dark:bg-surface-700 text-primary dark:text-white' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Invoices
                </Link>
              </nav>
            </motion.div>
          )}
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <footer className="bg-white dark:bg-surface-800 py-6 border-t border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-surface-600 dark:text-surface-400 text-sm">
                &copy; {new Date().getFullYear()} FreeLink. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-white transition-colors text-sm">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        toastClassName="rounded-lg shadow-lg"
      />
    </div>
  );
}

export default App;