
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, BookOpen, MessageSquare, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";

const Notifications = () => {
  // Sample notifications for demonstration
  const notifications = [
    {
      id: 1,
      title: "New resource available",
      message: "A new study resource 'Advanced JavaScript Patterns' is now available.",
      type: "resource",
      time: "10 minutes ago",
      isRead: false,
    },
    {
      id: 2,
      title: "Forum reply",
      message: "Sarah Williams replied to your post in 'React Hooks Discussion'.",
      type: "forum",
      time: "2 hours ago",
      isRead: false,
    },
    {
      id: 3,
      title: "Upcoming event",
      message: "Reminder: Web Development Workshop starts in 24 hours.",
      type: "event",
      time: "5 hours ago",
      isRead: true,
    },
    {
      id: 4,
      title: "Assignment deadline approaching",
      message: "Your 'Database Design' assignment is due tomorrow at 11:59 PM.",
      type: "alert",
      time: "Yesterday",
      isRead: true,
    },
    {
      id: 5,
      title: "New announcement",
      message: "Important announcement regarding the updated course schedule.",
      type: "announcement",
      time: "3 days ago",
      isRead: true,
    }
  ];

  // Function to get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "resource":
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      case "forum":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case "event":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="ml-2">{unreadCount} new</Badge>
            )}
          </div>
          <Button variant="outline">Mark all as read</Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 mt-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-colors ${!notification.isRead ? "bg-muted/40 hover:bg-muted/60" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{notification.title}</h3>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                    {!notification.isRead && (
                      <Button variant="ghost" size="sm" className="ml-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="unread" className="space-y-4 mt-4">
            {notifications.filter(n => !n.isRead).length > 0 ? (
              notifications.filter(n => !n.isRead).map((notification) => (
                <Card 
                  key={notification.id} 
                  className="bg-muted/40 hover:bg-muted/60 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{notification.title}</h3>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No unread notifications.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Notifications;
