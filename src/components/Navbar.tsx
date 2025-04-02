
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Menu, X, User, LogOut, Settings, Home, LayoutDashboard, Search, InfoIcon } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AuthContext } from '../App';
import { toast } from 'sonner';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');

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

  const viewUserProfile = () => {
    setUserProfileOpen(true);
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
            <div className="flex items-center gap-1">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </div>
          </Link>
          <Link to="/scan" className="text-sm font-medium text-foreground hover:text-cyber-primary transition-colors">
            <div className="flex items-center gap-1">
              <Search className="h-4 w-4" />
              <span>New Scan</span>
            </div>
          </Link>
          <Link to="/settings" className="text-sm font-medium text-foreground hover:text-cyber-primary transition-colors">
            <div className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </div>
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground hover:text-cyber-primary transition-colors">
            <div className="flex items-center gap-1">
              <InfoIcon className="h-4 w-4" />
              <span>About</span>
            </div>
          </Link>
          
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-cyber-primary/10">
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
              <DropdownMenuContent className="w-56 bg-cyber-dark border border-cyber-primary/20" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuItem 
                  className="cursor-pointer focus:bg-cyber-primary/10"
                  onClick={viewUserProfile}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-cyber-primary/20" />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer flex items-center focus:bg-cyber-primary/10">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer flex items-center focus:bg-cyber-primary/10">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/scan" className="cursor-pointer flex items-center focus:bg-cyber-primary/10">
                      <Search className="mr-2 h-4 w-4" />
                      <span>New Scan</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-cyber-primary/20" />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer focus:bg-cyber-primary/10">
                    <span>Theme</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="bg-cyber-dark border border-cyber-primary/20">
                      <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as any)}>
                        <DropdownMenuRadioItem value="light" className="cursor-pointer focus:bg-cyber-primary/10">
                          Light
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="dark" className="cursor-pointer focus:bg-cyber-primary/10">
                          Dark
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="system" className="cursor-pointer focus:bg-cyber-primary/10">
                          System
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator className="bg-cyber-primary/20" />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer text-cyber-danger focus:bg-cyber-primary/10"
                >
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
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </div>
          </Link>
          <Link 
            to="/scan" 
            className="block p-2 text-sm font-medium text-foreground hover:bg-cyber-primary/10 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>New Scan</span>
            </div>
          </Link>
          <Link 
            to="/settings" 
            className="block p-2 text-sm font-medium text-foreground hover:bg-cyber-primary/10 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </div>
          </Link>
          <Link 
            to="/about" 
            className="block p-2 text-sm font-medium text-foreground hover:bg-cyber-primary/10 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex items-center gap-2">
              <InfoIcon className="h-4 w-4" />
              <span>About</span>
            </div>
          </Link>
          
          {isLoggedIn && user ? (
            <>
              <div 
                className="p-2 flex items-center gap-3 border-t border-cyber-primary/20 pt-3 cursor-pointer"
                onClick={viewUserProfile}
              >
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

      {/* User Profile Dialog */}
      <Dialog open={userProfileOpen} onOpenChange={setUserProfileOpen}>
        <DialogContent className="cyber-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              Your account information and security status
            </DialogDescription>
          </DialogHeader>
          
          {user && (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center gap-4">
                <Avatar className="h-24 w-24 border-2 border-cyber-primary">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="text-2xl bg-cyber-primary/10 text-cyber-primary">
                    {user.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="cyber-card p-4 bg-cyber-dark/20">
                  <h4 className="text-sm font-medium mb-2">Account Security</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Email Verification</span>
                      <span className="text-xs bg-cyber-success/20 text-cyber-success py-1 px-2 rounded-full">Verified</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Two-Factor Authentication</span>
                      <span className="text-xs bg-cyber-warning/20 text-cyber-warning py-1 px-2 rounded-full">Not Enabled</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Password Strength</span>
                      <span className="text-xs bg-cyber-primary/20 text-cyber-primary py-1 px-2 rounded-full">Strong</span>
                    </div>
                  </div>
                </div>
                
                <div className="cyber-card p-4 bg-cyber-dark/20">
                  <h4 className="text-sm font-medium mb-2">Subscription</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Current Plan</span>
                    <span className="text-xs bg-cyber-primary/20 text-cyber-primary py-1 px-2 rounded-full">Free Tier</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10"
                    onClick={() => {
                      navigate('/settings');
                      setUserProfileOpen(false);
                    }}
                  >
                    Account Settings
                  </Button>
                  <Button 
                    className="flex-1 bg-cyber-primary text-cyber-dark hover:bg-cyber-primary/80"
                    onClick={() => {
                      toast.success('Profile updated successfully');
                      setUserProfileOpen(false);
                    }}
                  >
                    Update Profile
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
