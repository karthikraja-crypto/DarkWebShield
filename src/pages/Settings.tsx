import React, { useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield, User, Mail, Lock, BellRing, LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { AuthContext } from '../App';

const Settings = () => {
  // Get auth context
  const { user, logout, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Mock user data
  const [userData, setUserData] = React.useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    notifications: {
      email: true,
      push: false,
      sms: true,
      newBreaches: true,
      securityTips: true,
      accountActivity: false,
    }
  });
  
  // Determine which tab to show initially
  const [activeTab, setActiveTab] = React.useState<string>('profile');
  
  // Check for tab in location state
  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Update local user data when user context changes
  useEffect(() => {
    if (user) {
      setUserData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (updateUser) {
      updateUser({
        name: userData.name,
        email: userData.email,
        avatar: user?.avatar
      });
    }
    
    toast.success('Profile updated successfully!');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Password updated successfully!');
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setUserData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
    toast.success('Notification preferences updated!');
  };
  
  const handleLogout = () => {
    logout();
    toast.success('You have been logged out');
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences and security settings
            </p>
          </header>

          <div className="grid md:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-3">
              <Card className="cyber-card sticky top-20">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center p-4 mb-4">
                    <div className="w-20 h-20 rounded-full bg-cyber-primary/20 mb-4 flex items-center justify-center text-2xl font-bold text-cyber-primary">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="font-medium text-lg">{userData.name}</h3>
                    <p className="text-sm text-muted-foreground">{userData.email}</p>
                  </div>

                  <div className="space-y-1">
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${activeTab === 'profile' ? 'bg-cyber-primary/10 text-cyber-primary' : ''}`}
                      onClick={() => setActiveTab('profile')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${activeTab === 'security' ? 'bg-cyber-primary/10 text-cyber-primary' : ''}`}
                      onClick={() => setActiveTab('security')}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Security</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${activeTab === 'notifications' ? 'bg-cyber-primary/10 text-cyber-primary' : ''}`}
                      onClick={() => setActiveTab('notifications')}
                    >
                      <BellRing className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </Button>
                    <Separator className="my-2" />
                    <Button variant="ghost" className="w-full justify-start text-cyber-danger" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-9">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" id="profile" className="space-y-6">
                  <Card className="cyber-card">
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your account details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <div className="relative">
                            <div className="absolute left-3 top-3 text-muted-foreground">
                              <User className="h-5 w-5" />
                            </div>
                            <Input 
                              id="name" 
                              type="text" 
                              value={userData.name}
                              onChange={(e) => setUserData({...userData, name: e.target.value})}
                              className="cyber-input pl-10" 
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <div className="absolute left-3 top-3 text-muted-foreground">
                              <Mail className="h-5 w-5" />
                            </div>
                            <Input 
                              id="email" 
                              type="email" 
                              value={userData.email}
                              onChange={(e) => setUserData({...userData, email: e.target.value})}
                              className="cyber-input pl-10" 
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Input 
                              id="phone" 
                              type="tel" 
                              value={userData.phone}
                              onChange={(e) => setUserData({...userData, phone: e.target.value})}
                              className="cyber-input" 
                            />
                          </div>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="bg-cyber-primary text-cyber-dark hover:bg-cyber-primary/80"
                        >
                          Save Changes
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security" id="security" className="space-y-6">
                  <Card className="cyber-card">
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>Update your password to keep your account secure</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <div className="relative">
                            <div className="absolute left-3 top-3 text-muted-foreground">
                              <Lock className="h-5 w-5" />
                            </div>
                            <Input 
                              id="current-password" 
                              type="password" 
                              placeholder="Enter your current password" 
                              className="cyber-input pl-10" 
                              required 
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <div className="relative">
                            <div className="absolute left-3 top-3 text-muted-foreground">
                              <Lock className="h-5 w-5" />
                            </div>
                            <Input 
                              id="new-password" 
                              type="password" 
                              placeholder="Enter your new password" 
                              className="cyber-input pl-10" 
                              required 
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <div className="relative">
                            <div className="absolute left-3 top-3 text-muted-foreground">
                              <Lock className="h-5 w-5" />
                            </div>
                            <Input 
                              id="confirm-password" 
                              type="password" 
                              placeholder="Confirm your new password" 
                              className="cyber-input pl-10" 
                              required 
                            />
                          </div>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="bg-cyber-primary text-cyber-dark hover:bg-cyber-primary/80"
                        >
                          Update Password
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                  
                  <Card className="cyber-card">
                    <CardHeader>
                      <CardTitle>Two-Factor Authentication</CardTitle>
                      <CardDescription>Add an extra layer of security to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Enable 2FA</h3>
                          <p className="text-sm text-muted-foreground">
                            Protect your account with two-factor authentication
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications" id="notifications" className="space-y-6">
                  <Card className="cyber-card">
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Configure how you'd like to receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="font-medium">Notification Channels</h3>
                          <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Email Notifications</h4>
                                <p className="text-sm text-muted-foreground">
                                  Receive notifications via email
                                </p>
                              </div>
                              <Switch checked={userData.notifications.email} onCheckedChange={(value) => handleNotificationChange('email', value)} />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Push Notifications</h4>
                                <p className="text-sm text-muted-foreground">
                                  Receive notifications on your device
                                </p>
                              </div>
                              <Switch checked={userData.notifications.push} onCheckedChange={(value) => handleNotificationChange('push', value)} />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">SMS Notifications</h4>
                                <p className="text-sm text-muted-foreground">
                                  Receive text message alerts for important events
                                </p>
                              </div>
                              <Switch checked={userData.notifications.sms} onCheckedChange={(value) => handleNotificationChange('sms', value)} />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="font-medium">Notification Types</h3>
                          <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">New Breaches</h4>
                                <p className="text-sm text-muted-foreground">
                                  Get notified when your information is found in new data breaches
                                </p>
                              </div>
                              <Switch checked={userData.notifications.newBreaches} onCheckedChange={(value) => handleNotificationChange('newBreaches', value)} />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Security Tips</h4>
                                <p className="text-sm text-muted-foreground">
                                  Receive regular security recommendations and tips
                                </p>
                              </div>
                              <Switch checked={userData.notifications.securityTips} onCheckedChange={(value) => handleNotificationChange('securityTips', value)} />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Account Activity</h4>
                                <p className="text-sm text-muted-foreground">
                                  Be notified about important account activity
                                </p>
                              </div>
                              <Switch checked={userData.notifications.accountActivity} onCheckedChange={(value) => handleNotificationChange('accountActivity', value)} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
