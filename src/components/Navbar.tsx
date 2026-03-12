import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Menu, X, LayoutDashboard, FileText, Image as ImageIcon, Settings as SettingsIcon, LogOut } from 'lucide-react';

const Navbar = ({ isAdmin = false, onLogout }: { isAdmin?: boolean, onLogout?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = isAdmin ? [
    { name: 'Dashboard', href: '#admin-dashboard', icon: LayoutDashboard },
    { name: 'Articles', href: '#admin-articles', icon: FileText },
    { name: 'Media', href: '#admin-media', icon: ImageIcon },
    { name: 'Settings', href: '#admin-settings', icon: SettingsIcon },
  ] : [
    { name: 'Home', href: '#home' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'frosted-glass py-3 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-serif font-bold text-nature-green tracking-tight">
              SHALU <span className="text-sage-green">SACHDEVA</span>
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-deep-charcoal hover:text-nature-green font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  {link.icon && <link.icon size={18} />}
                  {link.name}
                </a>
              ))}
              {isAdmin && (
                <button onClick={onLogout} className="text-red-600 hover:text-red-800 font-medium flex items-center gap-2">
                  <LogOut size={18} /> Logout
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-nature-green">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden frosted-glass absolute w-full"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-deep-charcoal hover:text-nature-green font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            {isAdmin && (
              <button onClick={onLogout} className="w-full text-left px-3 py-2 text-red-600 font-medium">
                Logout
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
