
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Menu, X, User, LogOut, Settings, CreditCard, Home } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AuthContext } from '../App';
import { toast } from 'sonner';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('You have been logged out');
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
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
          <Link to="/" className="text-sm font-medium text-foreground hover:text-cyber-primary transition-colors">
            <div className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </div>
          </Link>
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
          
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border border-cyber-primary/30">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="bg-cyber-primary/10 text-cyber-primary">
                      {user.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
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
                  <Link to="/scan" className="cursor-pointer flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>New Scan</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-cyber-danger">
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
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-cyber-dark border-b border-cyber-primary/20 py-4 px-4 space-y-3">
          <Link 
            to="/" 
            className="block p-2 text-sm font-medium text-foreground hover:bg-cyber-primary/10 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </div>
          </Link>
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
          
          {isLoggedIn && user ? (
            <>
              <div className="p-2 flex items-center gap-3 border-t border-cyber-primary/20 pt-3">
                <Avatar className="h-10 w-10 border border-cyber-primary/30">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-cyber-primary/10 text-cyber-primary">
                    {user.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="pt-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-cyber-danger"
                  onClick={() => {
                    handleLogout();
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
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
