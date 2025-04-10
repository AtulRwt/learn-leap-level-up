
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
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Resource {
  id: number;
  title: string;
  type: string;
  category: string;
  user: string;
  uploadDate: string;
  status: "approved" | "pending" | "rejected";
  downloads: number;
}

const ResourcesManagement = () => {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: 1,
      title: "Data Structures and Algorithms Notes",
      type: "PDF",
      category: "Notes",
      user: "John Smith",
      uploadDate: "2024-03-10",
      status: "approved",
      downloads: 45,
    },
    {
      id: 2,
      title: "Operating Systems Final Exam 2023",
      type: "PDF",
      category: "PYQs",
      user: "Admin",
      uploadDate: "2024-03-05",
      status: "approved",
      downloads: 120,
    },
    {
      id: 3,
      title: "Java Programming Assignment",
      type: "ZIP",
      category: "Assignments",
      user: "Sarah Johnson",
      uploadDate: "2024-03-15",
      status: "pending",
      downloads: 0,
    },
    {
      id: 4,
      title: "Database Systems Interview Guide",
      type: "DOCX",
      category: "Guides",
      user: "Mike Chen",
      uploadDate: "2024-03-12",
      status: "pending",
      downloads: 0,
    },
    {
      id: 5,
      title: "Web Development Tutorial",
      type: "HTML",
      category: "Guides",
      user: "Lisa Wang",
      uploadDate: "2024-03-08",
      status: "rejected",
      downloads: 0,
    },
    {
      id: 6,
      title: "Computer Networks Midterm 2023",
      type: "PDF",
      category: "PYQs",
      user: "Admin",
      uploadDate: "2024-02-25",
      status: "approved",
      downloads: 89,
    },
    {
      id: 7,
      title: "Artificial Intelligence Notes",
      type: "PDF",
      category: "Notes",
      user: "Robert Johnson",
      uploadDate: "2024-03-18",
      status: "pending",
      downloads: 0,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"view" | "delete">("view");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const filteredResources = resources
    .filter((resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((resource) =>
      statusFilter === "all" ? true : resource.status === statusFilter
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
      setResources(resources.filter((r) => r.id !== selectedResource.id));
      toast.success("Resource deleted successfully");
      setDialogOpen(false);
    }
  };

  const handleStatusChange = (resource: Resource, newStatus: "approved" | "rejected") => {
    const updatedResources = resources.map((r) =>
      r.id === resource.id ? { ...r, status: newStatus } : r
    );
    setResources(updatedResources);
    
    toast.success(`Resource ${newStatus === "approved" ? "approved" : "rejected"}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Rejected
          </Badge>
        );
      default:
        return null;
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
                <SelectItem value="rejected">Rejected</SelectItem>
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
                <TableHead className="text-right">Downloads</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No resources found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div className="font-medium">{resource.title}</div>
                      <div className="text-xs text-muted-foreground">{resource.type}</div>
                    </TableCell>
                    <TableCell>{resource.category}</TableCell>
                    <TableCell>{resource.user}</TableCell>
                    <TableCell>{formatDate(resource.uploadDate)}</TableCell>
                    <TableCell>{getStatusBadge(resource.status)}</TableCell>
                    <TableCell className="text-right">{resource.downloads}</TableCell>
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
                          {resource.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                className="cursor-pointer flex items-center"
                                onClick={() => handleStatusChange(resource, "approved")}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                <span>Approve</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer flex items-center"
                                onClick={() => handleStatusChange(resource, "rejected")}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                <span>Reject</span>
                              </DropdownMenuItem>
                            </>
                          )}
                          {resource.status === "approved" && (
                            <DropdownMenuItem className="cursor-pointer flex items-center">
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

      {/* View Resource Dialog */}
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
                  <p>{selectedResource.category}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Type</h4>
                  <p>{selectedResource.type}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Uploaded By</h4>
                  <p>{selectedResource.user}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Upload Date</h4>
                  <p>{formatDate(selectedResource.uploadDate)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Status</h4>
                  <div>{getStatusBadge(selectedResource.status)}</div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Downloads</h4>
                  <p>{selectedResource.downloads}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
              {selectedResource.status === "pending" && (
                <>
                  <Button 
                    variant="default"
                    onClick={() => {
                      handleStatusChange(selectedResource, "approved");
                      setDialogOpen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      handleStatusChange(selectedResource, "rejected");
                      setDialogOpen(false);
                    }}
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

      {/* Delete Confirmation Dialog */}
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
                Uploaded by {selectedResource.user} on {formatDate(selectedResource.uploadDate)}
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
