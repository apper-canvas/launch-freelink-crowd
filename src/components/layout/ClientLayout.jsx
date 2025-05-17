import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { logout } from '../../store/slices/authSlice';
import { getIcon } from '../../utils/iconUtils';

const ClientLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Icons
  const DashboardIcon = getIcon('LayoutDashboard');
  const FolderIcon = getIcon('Folder');
  const FileTextIcon = getIcon('FileText');
  const MessageSquareIcon = getIcon('MessageSquare');
  const LogOutIcon = getIcon('LogOut');
  const MenuIcon = getIcon('Menu');
  const XIcon = getIcon('X');
  
  const handleLogout = () => {
    dispatch(logout());
    toast.success('You have been logged out');
    navigate('/login');
  };
  
  const navItems = [
    { to: '/client/dashboard', text: 'Dashboard', icon: DashboardIcon },
    { to: '/client/projects', text: 'Projects', icon: FolderIcon },
    { to: '/client/documents', text: 'Documents', icon: FileTextIcon },
    { to: '/client/invoices', text: 'Invoices', icon: FileTextIcon },
    { to: '/client/messages', text: 'Messages', icon: MessageSquareIcon },
  ];
  
  return (
    <div className="md:flex">
      {/* Mobile sidebar toggle */}
      <div className="bg-surface-50 dark:bg-surface-800 p-4 md:hidden border-b border-surface-200 dark:border-surface-700 sticky top-0 z-20">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-white dark:bg-surface-700 shadow-sm hover:bg-surface-100 dark:hover:bg-surface-600"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Sidebar - Mobile (Drawer) */}
      <motion.div 
        className={`fixed inset-0 bg-black/40 md:hidden z-30 ${isSidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsSidebarOpen(false)}
      ></motion.div>
      
      <motion.div
        className="fixed left-0 top-0 h-full bg-white dark:bg-surface-800 w-64 md:static z-40 shadow-xl md:shadow-none transition-transform transform-gpu"
        initial={false}
        animate={{ 
          x: isSidebarOpen ? 0 : '-100%',
          opacity: isSidebarOpen ? 1 : 0 
        }}
        transition={{ type: 'tween' }}
        style={{ transform: 'translateX(0)' }} // Ensures it's always visible on desktop
        className={`fixed md:static md:flex md:flex-col left-0 top-0 h-full bg-white dark:bg-surface-800 w-64 z-40 shadow-xl md:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Client info section */}
        <div className="p-4 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
              {user?.name?.[0] || 'C'}
            </div>
            <div>
              <h2 className="font-semibold truncate">{user?.name || 'Client'}</h2>
              <p className="text-sm text-surface-600 dark:text-surface-400 truncate">
                {user?.email || 'client@example.com'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => 
                    `flex items-center px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light' 
                        : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Logout button */}
        <div className="p-4 border-t border-surface-200 dark:border-surface-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            <LogOutIcon className="w-5 h-5 mr-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="p-4 md:p-6 max-w-4xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;