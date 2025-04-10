
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FilePlus2, Users, FileCheck2, BookOpen, AlertCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  trend,
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ElementType;
  trend?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="bg-primary/10 p-2 rounded-md">
        <Icon className="h-4 w-4 text-primary" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1 flex items-center space-x-1">
        {trend && (
          <>
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-green-500">{trend}</span>
          </>
        )}
        <span>{description}</span>
      </p>
    </CardContent>
  </Card>
);

const AdminHome = () => {
  const { user } = useAuth();

  // Mock data for the chart
  const activityData = [
    { name: "Mon", uploads: 4, downloads: 10 },
    { name: "Tue", uploads: 3, downloads: 7 },
    { name: "Wed", uploads: 5, downloads: 12 },
    { name: "Thu", uploads: 7, downloads: 15 },
    { name: "Fri", uploads: 4, downloads: 9 },
    { name: "Sat", uploads: 3, downloads: 8 },
    { name: "Sun", uploads: 2, downloads: 5 },
  ];

  // Mock data for pending approvals
  const pendingResources = [
    {
      id: 1,
      title: "Machine Learning Notes",
      type: "PDF",
      user: "Alex Johnson",
      date: "Today, 10:45 AM"
    },
    {
      id: 2,
      title: "Operating Systems Lab Assignment",
      type: "Document",
      user: "Sarah Williams",
      date: "Yesterday, 3:20 PM"
    },
    {
      id: 3,
      title: "Computer Networks Previous Questions",
      type: "PDF",
      user: "Mike Brown",
      date: "Yesterday, 1:15 PM"
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here's an overview of the platform activity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Resources"
            value="345"
            description="All uploaded content"
            icon={BookOpen}
          />
          <StatCard
            title="Active Users"
            value="128"
            description="In the last 7 days"
            icon={Users}
            trend="+12%"
          />
          <StatCard
            title="New Uploads"
            value="26"
            description="This week"
            icon={FilePlus2}
            trend="+8%"
          />
          <StatCard
            title="Pending Approvals"
            value={pendingResources.length.toString()}
            description="Needs review"
            icon={AlertCircle}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>
                Platform usage analytics for the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="uploads" 
                      stroke="#8884d8" 
                      strokeWidth={2} 
                      name="Uploads" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="downloads" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      name="Downloads" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
                Resources waiting for approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingResources.map((resource) => (
                  <div key={resource.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 bg-accent p-2 rounded">
                          <FileCheck2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{resource.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {resource.user} • {resource.date}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-2 py-1 rounded">
                        {resource.type}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="text-xs">View</Button>
                      <Button size="sm" className="text-xs">Approve</Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">View All Pending</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminHome;
