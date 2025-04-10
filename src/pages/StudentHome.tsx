
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { BookOpen, Upload, FileText, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const QuickActionCard = ({ 
  title, 
  description, 
  icon: Icon,
  href,
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType;
  href: string;
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className="h-full cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate(href)}>
      <CardHeader className="flex flex-row items-start space-y-0 pb-2">
        <div className="bg-primary/10 p-2 rounded-md">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const StudentHome = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: "Upload Resources",
      description: "Share your notes and earn points",
      icon: Upload,
      href: "/upload",
    },
    {
      title: "Exam Preparation",
      description: "Access study materials",
      icon: BookOpen,
      href: "/exams",
    },
    {
      title: "Resources",
      description: "Learning resources",
      icon: BookOpen,
      href: "/premium",
    },
  ];

  const progress = {
    earned: 0,
    nextLevel: 0,
  };

  const progressPercentage = 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {user?.name}</h2>
          <p className="text-muted-foreground">
            Here's what's happening with your learning today.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.title}
              title={action.title}
              description={action.description}
              icon={action.icon}
              href={action.href}
            />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-6">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Recent Resources</CardTitle>
              <CardDescription>
                Recently uploaded learning materials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full mt-2">View All Resources</Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Contribution Points</span>
                  <span className="text-sm font-medium">{progress.earned} / {progress.nextLevel}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-medium">Achievements</h4>
                <div className="flex flex-wrap gap-2">
                  <div className="border rounded-full px-3 py-1 text-xs flex items-center gap-1">
                    <Upload className="h-3 w-3" /> 0 Uploads
                  </div>
                  <div className="border rounded-full px-3 py-1 text-xs flex items-center gap-1">
                    <FileText className="h-3 w-3" /> Resource Star
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="secondary" className="w-full">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentHome;
