
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Menu, X, User, LogOut, Settings, CreditCard } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // Mock authentication state

  // For demo purposes, toggle login state
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

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
          <Link to="/settings" className="text-sm font-medium text-foreground hover:text-cyber-primary transition-colors">
            Settings
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground hover:text-cyber-primary transition-colors">
            About
          </Link>
          
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border border-cyber-primary/30">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-cyber-primary/10 text-cyber-primary">JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/subscription" className="cursor-pointer flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Subscription</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleLogin} className="cursor-pointer text-cyber-danger">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
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
              {/* For demo purposes - toggle login state */}
              <Button variant="ghost" size="icon" onClick={toggleLogin} className="ml-2">
                <User className="h-5 w-5" />
              </Button>
            </div>
          )}
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
            to="/settings" 
            className="block p-2 text-sm font-medium text-foreground hover:bg-cyber-primary/10 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Settings
          </Link>
          <Link 
            to="/about" 
            className="block p-2 text-sm font-medium text-foreground hover:bg-cyber-primary/10 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          
          {isLoggedIn ? (
            <>
              <div className="p-2 flex items-center gap-3 border-t border-cyber-primary/20 pt-3">
                <Avatar className="h-10 w-10 border border-cyber-primary/30">
                  <AvatarFallback className="bg-cyber-primary/10 text-cyber-primary">JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                </div>
              </div>
              <div className="pt-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-cyber-danger"
                  onClick={() => {
                    toggleLogin();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Button>
              </div>
            </>
          ) : (
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
              {/* For demo purposes */}
              <Button 
                variant="ghost" 
                className="w-full justify-center"
                onClick={() => {
                  toggleLogin();
                  setIsMenuOpen(false);
                }}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Demo Login</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
