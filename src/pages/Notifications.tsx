
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  Activity,
  Filter,
  FileText,
  Trash2,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

// Define notification types
type NotificationType = 'breach' | 'system' | 'monitoring';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: NotificationType;
  read: boolean;
  hasReport?: boolean;
  reportUrl?: string;
}

const Notifications = () => {
  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Breach Detected',
      message: 'Your email was found in a recent data breach from MegaStore.',
      date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      type: 'breach',
      read: false,
      hasReport: true,
      reportUrl: '#'
    },
    {
      id: '2',
      title: 'Continuous Monitoring Active',
      message: 'Your digital footprint is now being continuously monitored for new breaches.',
      date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      type: 'monitoring',
      read: true
    },
    {
      id: '3',
      title: 'System Update Available',
      message: 'A new version of DarkWebShield is available with improved security features.',
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      type: 'system',
      read: false
    },
    {
      id: '4',
      title: 'Scan Completed',
      message: 'Your security scan has been completed. No new breaches were found.',
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      type: 'monitoring',
      read: true
    },
    {
      id: '5',
      title: 'Security Report Generated',
      message: 'Your detailed security report has been generated and is ready for viewing.',
      date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      type: 'breach',
      read: false,
      hasReport: true,
      reportUrl: '#'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState<NotificationType | 'all'>('all');

  // Filter notifications based on the active filter
  const filteredNotifications = activeFilter === 'all'
    ? notifications
    : notifications.filter(notification => notification.type === activeFilter);

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
    toast.success("Notification marked as read");
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    toast.success("Notification deleted");
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast.success("All notifications marked as read");
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  // View report
  const viewReport = (reportUrl: string) => {
    toast.info("Opening security report");
    window.open(reportUrl, '_blank');
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-muted-foreground">
                Stay informed about security alerts and system updates
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="border-cyber-primary/30 text-cyber-primary"
                onClick={markAllAsRead}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
              <Button 
                variant="outline" 
                className="border-cyber-danger/30 text-cyber-danger"
                onClick={clearAllNotifications}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear all
              </Button>
            </div>
          </header>

          <Card className="cyber-card mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Notifications
              </CardTitle>
              <CardDescription>Categorize your notifications by type</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" onValueChange={(value) => setActiveFilter(value as any)}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="breach">Breach Alerts</TabsTrigger>
                  <TabsTrigger value="system">System Updates</TabsTrigger>
                  <TabsTrigger value="monitoring">Monitoring Logs</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`cyber-card transition-all ${!notification.read ? 'border-cyber-primary/30 bg-cyber-primary/5' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${
                        notification.type === 'breach' 
                          ? 'bg-cyber-danger/10 text-cyber-danger' 
                          : notification.type === 'system'
                            ? 'bg-cyber-primary/10 text-cyber-primary'
                            : 'bg-cyber-success/10 text-cyber-success'
                      }`}>
                        {notification.type === 'breach' 
                          ? <AlertTriangle className="h-6 w-6" /> 
                          : notification.type === 'system'
                            ? <Info className="h-6 w-6" />
                            : <Activity className="h-6 w-6" />
                        }
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <h3 className="font-medium text-lg">{notification.title}</h3>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(notification.date)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-cyber-primary"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle2 className="mr-1 h-4 w-4" />
                              Mark as read
                            </Button>
                          )}
                          {notification.hasReport && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-cyber-primary"
                              onClick={() => notification.reportUrl && viewReport(notification.reportUrl)}
                            >
                              <FileText className="mr-1 h-4 w-4" />
                              View Report
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-cyber-danger"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="cyber-card">
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No notifications</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    You don't have any notifications at the moment. When you receive alerts or system updates, they will appear here.
                  </p>
                  <Link to="/scan">
                    <Button className="bg-cyber-primary text-cyber-dark hover:bg-cyber-primary/80">
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      Run a Security Scan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Notifications;
