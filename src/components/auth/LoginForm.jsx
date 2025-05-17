import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  
  // Icons
  const MailIcon = getIcon('Mail');
  const LockIcon = getIcon('Lock');
  const EyeIcon = getIcon('Eye');
  const EyeOffIcon = getIcon('EyeOff');
  
  const [showPassword, setShowPassword] = useState(false);
  
  const validateForm = () => {
    const errors = {};
    
    if (!credentials.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!credentials.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    
    // Clear specific field error when typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
    
    // Clear API error when typing
    if (error) {
      dispatch(clearError());
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await dispatch(login(credentials)).unwrap();
        toast.success('Login successful!');
        navigate('/client/dashboard');
      } catch (err) {
        // Error is handled by the slice
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="input-group">
        <label htmlFor="email" className="input-label flex items-center space-x-1">
          <MailIcon className="w-4 h-4" />
          <span>Email</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className={`w-full ${formErrors.email ? 'border-red-500' : ''}`}
          disabled={loading}
        />
        {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
      </div>
      
      <div className="input-group">
        <label htmlFor="password" className="input-label flex items-center space-x-1">
          <LockIcon className="w-4 h-4" />
          <span>Password</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={`w-full pr-10 ${formErrors.password ? 'border-red-500' : ''}`}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        </div>
        {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
      </div>
      
      {error && <div className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 p-3 rounded-lg text-sm">{error}</div>}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary focus:ring-primary border-surface-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-surface-700 dark:text-surface-300">
            Remember me
          </label>
        </div>
        
        <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark">
          Forgot password?
        </a>
      </div>
      
      <button
        type="submit"
        className={`btn-primary w-full py-2.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
        ) : 'Sign in to your account'}
      </button>
    </form>
  );
};

export default LoginForm;