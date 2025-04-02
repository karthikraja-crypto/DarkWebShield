
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Shield, BellRing, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

interface SettingsNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const SettingsNavigation = ({ activeTab, onTabChange, onLogout }: SettingsNavigationProps) => {
  return (
    <div className="space-y-1">
      <Button 
        variant="ghost" 
        className={`w-full justify-start ${activeTab === 'profile' ? 'bg-cyber-primary/10 text-cyber-primary' : ''}`} 
        onClick={() => onTabChange('profile')}
      >
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </Button>
      <Button 
        variant="ghost" 
        className={`w-full justify-start ${activeTab === 'security' ? 'bg-cyber-primary/10 text-cyber-primary' : ''}`} 
        onClick={() => onTabChange('security')}
      >
        <Shield className="mr-2 h-4 w-4" />
        <span>Security</span>
      </Button>
      <Button 
        variant="ghost" 
        className={`w-full justify-start ${activeTab === 'notifications' ? 'bg-cyber-primary/10 text-cyber-primary' : ''}`} 
        onClick={() => onTabChange('notifications')}
      >
        <BellRing className="mr-2 h-4 w-4" />
        <span>Notifications</span>
      </Button>
      <Separator className="my-2" />
      <Button variant="ghost" className="w-full justify-start text-cyber-danger" onClick={onLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </Button>
    </div>
  );
};

export default SettingsNavigation;
