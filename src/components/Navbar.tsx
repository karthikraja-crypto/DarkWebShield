
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-cyber-dark/80 backdrop-blur-md border-b border-cyber-primary/20 py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-cyber-primary" />
          <span className="text-xl font-bold tracking-tight glow-text">
            DarkWeb<span className="text-cyber-primary">Shield</span>
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/dashboard" className="text-sm font-medium text-foreground hover:text-cyber-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/scan" className="text-sm font-medium text-foreground hover:text-cyber-primary transition-colors">
            New Scan
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground hover:text-cyber-primary transition-colors">
            About
          </Link>
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="outline" className="border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-cyber-primary text-cyber-dark hover:bg-cyber-primary/80">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-cyber-dark border-b border-cyber-primary/20 py-4 px-4 space-y-3">
          <Link 
            to="/dashboard" 
            className="block p-2 text-sm font-medium text-foreground hover:bg-cyber-primary/10 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/scan" 
            className="block p-2 text-sm font-medium text-foreground hover:bg-cyber-primary/10 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            New Scan
          </Link>
          <Link 
            to="/about" 
            className="block p-2 text-sm font-medium text-foreground hover:bg-cyber-primary/10 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <div className="flex flex-col gap-2 pt-2">
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="w-full border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10">
                Log In
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-cyber-primary text-cyber-dark hover:bg-cyber-primary/80">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
