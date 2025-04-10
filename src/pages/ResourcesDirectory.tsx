
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

const ResourcesDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const resources = [
    {
      id: 1,
      title: "Introduction to Programming",
      category: "Computer Science",
      level: "Beginner",
      author: "John Doe",
      downloads: 0,
      tags: ["programming", "basics"]
    },
    {
      id: 2,
      title: "Data Structures Explained",
      category: "Computer Science",
      level: "Intermediate",
      author: "Jane Smith",
      downloads: 0,
      tags: ["data structures", "algorithms"]
    },
    {
      id: 3,
      title: "Web Development Fundamentals",
      category: "Web",
      level: "Beginner",
      author: "Alex Johnson",
      downloads: 0,
      tags: ["html", "css", "javascript"]
    },
    {
      id: 4,
      title: "Database Management Systems",
      category: "Database",
      level: "Advanced",
      author: "Sarah Williams",
      downloads: 0,
      tags: ["sql", "nosql"]
    }
  ];

  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold">Resources Directory</h1>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Badge>{resource.category}</Badge>
                    <Badge variant="outline">{resource.level}</Badge>
                  </div>
                  <CardTitle className="mt-2">{resource.title}</CardTitle>
                  <CardDescription>By {resource.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {resource.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-muted-foreground">
                      {resource.downloads} downloads
                    </span>
                    <Button size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No resources found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ResourcesDirectory;
