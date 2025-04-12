import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MoreHorizontal, CheckCircle, XCircle, Eye, Download, Trash2 } from "lucide-react";
import { toast } from "@/lib/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Resource {
  id: string;
  title: string;
  resource_type: string;
  description: string;
  user_id: string;
  created_at: string;
  is_approved: boolean;
  file_url?: string;
  external_url?: string;
  content?: string;
  user_name?: string;
}

const ResourcesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"view" | "delete">("view");
  const queryClient = useQueryClient();
  
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select(`*`)
        .order('created_at', { ascending: false });

      if (resourcesError) {
        toast.error('Error fetching resources');
        console.error('Error fetching resources:', resourcesError);
        return [];
      }

      const userIds = resourcesData.map(resource => resource.user_id);
      
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', userIds);
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          return resourcesData.map(resource => ({
            ...resource,
            user_name: 'Unknown User'
          }));
        }

        const userNameMap = new Map();
        profilesData.forEach(profile => {
          userNameMap.set(profile.id, profile.name || 'Unknown User');
        });

        return resourcesData.map(resource => ({
          ...resource,
          user_name: userNameMap.get(resource.user_id) || 'Unknown User'
        }));
      }

      return resourcesData.map(resource => ({
        ...resource,
        user_name: 'Unknown User'
      }));
    }
  });

  const approveMutation = useMutation({
    mutationFn: async ({ resourceId, approved }: { resourceId: string, approved: boolean }) => {
      const { error } = await supabase
        .from('resources')
        .update({ is_approved: approved })
        .eq('id', resourceId);
        
      if (error) throw error;
      
      if (approved) {
        await supabase.rpc('approve_resource', {
          resource_id: resourceId
        });
      }
      
      return { resourceId, approved };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success(`Resource ${data.approved ? 'approved' : 'rejected'}`);
      if (dialogOpen) setDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to update resource: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (resourceId: string) => {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);
        
      if (error) throw error;
      return resourceId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('Resource deleted successfully');
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to delete resource: ${error.message}`);
    }
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const filteredResources = resources
    .filter((resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.user_name && resource.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (resource.resource_type && resource.resource_type.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter((resource) =>
      statusFilter === "all" ? true : 
      statusFilter === "approved" ? resource.is_approved :
      statusFilter === "pending" ? !resource.is_approved : false
    );

  const handleViewResource = (resource: Resource) => {
    setSelectedResource(resource);
    setDialogType("view");
    setDialogOpen(true);
  };

  const handleDeleteResource = (resource: Resource) => {
    setSelectedResource(resource);
    setDialogType("delete");
    setDialogOpen(true);
  };

  const confirmDeleteResource = () => {
    if (selectedResource) {
      deleteMutation.mutate(selectedResource.id);
    }
  };

  const handleStatusChange = (resource: Resource, approved: boolean) => {
    approveMutation.mutate({ resourceId: resource.id, approved });
  };

  const getStatusBadge = (isApproved: boolean) => {
    if (isApproved) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Approved
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          Pending
        </Badge>
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Resources Management</h1>
          <p className="text-muted-foreground">
            Manage all learning resources uploaded to the platform
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by title, user, or category..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="w-full md:w-64">
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter by Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading resources...
                  </TableCell>
                </TableRow>
              ) : filteredResources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No resources found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div className="font-medium">{resource.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {resource.file_url ? 'File' : resource.external_url ? 'Link' : 'Text'}
                      </div>
                    </TableCell>
                    <TableCell>{resource.resource_type}</TableCell>
                    <TableCell>{resource.user_name || 'Unknown'}</TableCell>
                    <TableCell>{formatDate(resource.created_at)}</TableCell>
                    <TableCell>{getStatusBadge(resource.is_approved)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer flex items-center"
                            onClick={() => handleViewResource(resource)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          {!resource.is_approved && (
                            <>
                              <DropdownMenuItem
                                className="cursor-pointer flex items-center"
                                onClick={() => handleStatusChange(resource, true)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                <span>Approve</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer flex items-center"
                                onClick={() => handleStatusChange(resource, false)}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                <span>Reject</span>
                              </DropdownMenuItem>
                            </>
                          )}
                          {resource.file_url && (
                            <DropdownMenuItem 
                              className="cursor-pointer flex items-center"
                              onClick={() => window.open(resource.file_url, '_blank')}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              <span>Download</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive flex items-center"
                            onClick={() => handleDeleteResource(resource)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {dialogType === "view" && selectedResource && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Resource Details</DialogTitle>
              <DialogDescription>
                Viewing complete information about this resource
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Title</h4>
                <p>{selectedResource.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Category</h4>
                  <p>{selectedResource.resource_type}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Type</h4>
                  <p>{selectedResource.file_url ? 'File' : selectedResource.external_url ? 'Link' : 'Text'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Uploaded By</h4>
                  <p>{selectedResource.user_name || 'Unknown'}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Upload Date</h4>
                  <p>{formatDate(selectedResource.created_at)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Status</h4>
                  <div>{getStatusBadge(selectedResource.is_approved)}</div>
                </div>
              </div>
              
              {selectedResource.description && (
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Description</h4>
                  <p className="whitespace-pre-wrap">{selectedResource.description}</p>
                </div>
              )}
              
              {selectedResource.content && (
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Content</h4>
                  <div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
                    {selectedResource.content}
                  </div>
                </div>
              )}
              
              {selectedResource.file_url && (
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">File</h4>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(selectedResource.file_url, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" /> View File
                  </Button>
                </div>
              )}
              
              {selectedResource.external_url && (
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">External Link</h4>
                  <a 
                    href={selectedResource.external_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {selectedResource.external_url}
                  </a>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
              {!selectedResource.is_approved && (
                <>
                  <Button 
                    variant="default"
                    onClick={() => handleStatusChange(selectedResource, true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleStatusChange(selectedResource, false)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {dialogType === "delete" && selectedResource && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this resource? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="font-medium">{selectedResource.title}</p>
              <p className="text-sm text-muted-foreground">
                Uploaded by {selectedResource.user_name || 'Unknown'} on {formatDate(selectedResource.created_at)}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteResource}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Resource
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default ResourcesManagement;
