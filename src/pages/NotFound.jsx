import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const AlertCircleIcon = getIcon('AlertCircle');
  const HomeIcon = getIcon('Home');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
    >
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-red-500/20 dark:bg-red-800/30 rounded-full blur-xl"></div>
        <div className="relative">
          <AlertCircleIcon className="w-24 h-24 text-red-500 dark:text-red-400" />
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">Page Not Found</h2>
      
      <p className="text-surface-600 dark:text-surface-400 max-w-md mb-8">
        We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
      </p>
      
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Return to Home
        </Link>
      </motion.div>

      <div className="mt-16 border-t border-surface-200 dark:border-surface-700 pt-8 text-surface-500 dark:text-surface-400">
        <p>Need help? <a href="#" className="text-primary dark:text-primary-light hover:underline">Contact Support</a></p>
      </div>
    </motion.div>
  );
};

export default NotFound;