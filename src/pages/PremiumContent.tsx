
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Video, BookOpen } from "lucide-react";

const PremiumContent = () => {
  const resources = [
    {
      id: 1,
      title: "Advanced Algorithm Analysis",
      type: "Notes",
      description: "Comprehensive notes on advanced algorithm techniques with examples",
      icon: FileText,
    },
    {
      id: 2,
      title: "Database Systems Master Class",
      type: "Video",
      description: "In-depth video lectures on database optimization and architecture",
      icon: Video,
    },
    {
      id: 3,
      title: "Machine Learning Interview Guide",
      type: "Guide",
      description: "Preparation guide for machine learning interviews at top companies",
      icon: BookOpen,
    },
    {
      id: 4,
      title: "System Design for Scalable Applications",
      type: "Notes",
      description: "Learn how to design large-scale distributed systems",
      icon: FileText,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Learning Resources</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access quality study materials to accelerate your learning journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {resources.map((resource) => (
            <Card key={resource.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="bg-primary/10 p-2 rounded">
                    <resource.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <CardTitle className="mt-3 text-lg">{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Type: {resource.type}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default PremiumContent;
