
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Resource {
  id: number;
  title: string;
  description: string;
  type: "notes" | "pyqs" | "guide" | "assignment";
  subject: string;
  uploadedBy: string;
  date: string;
}

const ExamPrep = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for resources
  const allResources: Resource[] = [
    {
      id: 1,
      title: "Data Structures Interview Questions",
      description: "Common interview questions on arrays, linked lists, trees, and graphs",
      type: "guide",
      subject: "Computer Science",
      uploadedBy: "Tech Interviews",
      date: "2 weeks ago",
    },
    {
      id: 2,
      title: "Algorithm Analysis Cheat Sheet",
      description: "Quick reference for complexity analysis and optimization techniques",
      type: "notes",
      subject: "Computer Science",
      uploadedBy: "CS Professor",
      date: "1 month ago",
    },
    {
      id: 3,
      title: "Database Systems Interview Prep",
      description: "SQL queries, normalization, and transaction concepts for interviews",
      type: "guide",
      subject: "Database",
      uploadedBy: "DB Expert",
      date: "3 weeks ago",
    },
    {
      id: 4,
      title: "Operating Systems Final Exam 2023",
      description: "Previous year questions from the OS final examination",
      type: "pyqs",
      subject: "Operating Systems",
      uploadedBy: "Admin",
      date: "4 months ago",
    },
    {
      id: 5,
      title: "Computer Networks Mid-term 2023",
      description: "Questions from last semester's networking mid-term",
      type: "pyqs",
      subject: "Computer Networks",
      uploadedBy: "Networking TA",
      date: "3 months ago",
    },
    {
      id: 6,
      title: "Competitive Programming Techniques",
      description: "Advanced algorithms and data structures for coding competitions",
      type: "notes",
      subject: "Competitive Programming",
      uploadedBy: "Coding Champion",
      date: "1 week ago",
    },
  ];

  const interviewResources = allResources.filter(
    (resource) => resource.type === "guide"
  );
  
  const semesterResources = allResources.filter(
    (resource) => resource.type === "pyqs"
  );
  
  const competitiveResources = allResources.filter(
    (resource) => resource.subject === "Competitive Programming"
  );

  const getFilteredResources = (resources: Resource[]) => {
    if (!searchQuery) return resources;
    
    return resources.filter(
      (resource) =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case "notes":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "pyqs":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "guide":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "assignment":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const renderResourceList = (resources: Resource[]) => {
    const filteredResources = getFilteredResources(resources);
    
    if (filteredResources.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No resources found matching your search criteria</p>
        </div>
      );
    }
    
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription className="mt-1">{resource.description}</CardDescription>
                </div>
                <Badge className={getResourceTypeColor(resource.type)}>
                  {resource.type === "pyqs" ? "PYQs" : resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{resource.subject}</span>
                <span className="text-muted-foreground">
                  by {resource.uploadedBy} • {resource.date}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="sm" className="w-full">
                View Resource
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2">Exam Preparation</h1>
          <p className="text-muted-foreground">
            Access resources to help you prepare for interviews and exams
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search resources by title, description or subject..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="interview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="interview">Interview Prep</TabsTrigger>
            <TabsTrigger value="semester">Semester Exams</TabsTrigger>
            <TabsTrigger value="competitive">Competitive Exams</TabsTrigger>
          </TabsList>
          
          <TabsContent value="interview" className="pt-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Interview Preparation Materials</h2>
              <Button variant="outline" size="sm">
                Filter Resources
              </Button>
            </div>
            {renderResourceList(interviewResources)}
          </TabsContent>
          
          <TabsContent value="semester" className="pt-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Semester Exam Resources</h2>
              <Button variant="outline" size="sm">
                Filter Resources
              </Button>
            </div>
            {renderResourceList(semesterResources)}
          </TabsContent>
          
          <TabsContent value="competitive" className="pt-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Competitive Exam Materials</h2>
              <Button variant="outline" size="sm">
                Filter Resources
              </Button>
            </div>
            {renderResourceList(competitiveResources)}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ExamPrep;
