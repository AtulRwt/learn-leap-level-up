
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Resource {
  id: string;
  title: string;
  description: string;
  resource_type: string;
  file_url: string | null;
  external_url: string | null;
  content: string | null;
  created_at: string;
  user_id: string;
  user_name: string;
}

const ResourcesDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['approved-resources'],
    queryFn: async () => {
      // First, fetch all approved resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (resourcesError) {
        console.error('Error fetching resources:', resourcesError);
        return [];
      }

      // For each resource, fetch the user's name from profiles
      const resourcesWithUserNames = await Promise.all((resourcesData || []).map(async (resource) => {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', resource.user_id)
          .single();

        return {
          ...resource,
          user_name: profileData?.name || 'Unknown User'
        };
      }));

      return resourcesWithUserNames;
    }
  });

  const filteredResources = () => {
    return resources.filter(resource => 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.resource_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const getResourceBadge = (resource: Resource) => {
    if (resource.file_url) {
      return <Badge>File</Badge>;
    } else if (resource.external_url) {
      return <Badge>Link</Badge>;
    } else {
      return <Badge>Text</Badge>;
    }
  };

  const getActionButton = (resource: Resource) => {
    if (resource.file_url) {
      return (
        <Button 
          size="sm"
          className="flex items-center gap-1"
          onClick={() => window.open(resource.file_url, '_blank')}
        >
          <Download className="h-4 w-4" /> Download
        </Button>
      );
    } else if (resource.external_url) {
      return (
        <Button 
          size="sm"
          className="flex items-center gap-1"
          onClick={() => window.open(resource.external_url, '_blank')}
        >
          <ExternalLink className="h-4 w-4" /> Open Link
        </Button>
      );
    } else {
      return (
        <Button 
          size="sm"
          onClick={() => {
            // For text resources, we could implement a modal to view the content
            alert(resource.content);
          }}
        >
          View Content
        </Button>
      );
    }
  };

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

        {isLoading ? (
          <div className="text-center py-10">
            <p>Loading resources...</p>
          </div>
        ) : filteredResources().length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No resources found matching your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources().map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline">{resource.resource_type}</Badge>
                    {getResourceBadge(resource)}
                  </div>
                  <CardTitle className="mt-2 line-clamp-2">{resource.title}</CardTitle>
                  <CardDescription>By {resource.user_name}</CardDescription>
                </CardHeader>
                <CardContent>
                  {resource.description && (
                    <p className="text-sm mb-4 line-clamp-3">{resource.description}</p>
                  )}
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(resource.created_at).toLocaleDateString()}
                    </span>
                    {getActionButton(resource)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ResourcesDirectory;
