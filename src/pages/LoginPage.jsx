import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/client/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome to Client Portal</h1>
        <p className="text-surface-600 dark:text-surface-400">
          Sign in to access your projects, documents, and invoices
        </p>
      </div>
      
      <div className="card">
        <LoginForm />
        
        <div className="mt-6 text-center text-sm text-surface-600 dark:text-surface-400">
          <span>Don't have access? </span>
          <Link to="/" className="font-medium text-primary hover:text-primary-dark">Contact your consultant</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;