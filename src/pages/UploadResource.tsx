
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, File, Link, Image } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

const resourceTypes = [
  { value: "notes", label: "Notes" },
  { value: "pyqs", label: "Previous Year Questions" },
  { value: "assignments", label: "Assignments" },
  { value: "guides", label: "Guides" },
];

const UploadResource = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [uploadType, setUploadType] = useState<"file" | "link" | "text">("file");
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [textContent, setTextContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!title || !description || !type) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (uploadType === "file" && !file) {
      toast.error("Please select a file to upload");
      setIsSubmitting(false);
      return;
    }

    if (uploadType === "link" && !link) {
      toast.error("Please enter a valid URL");
      setIsSubmitting(false);
      return;
    }

    if (uploadType === "text" && !textContent) {
      toast.error("Please enter some content");
      setIsSubmitting(false);
      return;
    }

    // Simulate upload process
    setTimeout(() => {
      toast.success("Resource submitted for review!");
      // Reset form
      setTitle("");
      setDescription("");
      setType("");
      setFile(null);
      setLink("");
      setTextContent("");
      setIsSubmitting(false);
    }, 1500);
  };

  const renderUploadSection = () => {
    switch (uploadType) {
      case "file":
        return (
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="file">Upload File</Label>
            <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center">
              {file ? (
                <div className="flex items-center gap-2">
                  <File className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Drag and drop your file here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PDF, DOC, DOCX, images, and more (Max size: 10MB)
                  </p>
                </>
              )}
              <Input
                id="file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex justify-center mt-2">
              <Label
                htmlFor="file"
                className="bg-secondary py-2 px-4 rounded-md cursor-pointer text-sm hover:bg-secondary/80 transition"
              >
                Browse Files
              </Label>
            </div>
          </div>
        );
      case "link":
        return (
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="link">Resource URL</Label>
            <div className="flex gap-2">
              <div className="bg-secondary p-2 rounded flex items-center">
                <Link className="h-4 w-4" />
              </div>
              <Input
                id="link"
                type="url"
                placeholder="https://example.com/resource"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Paste a link to an external resource (e.g., Google Drive, Dropbox)
            </p>
          </div>
        );
      case "text":
        return (
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write or paste your content here..."
              rows={8}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload Learning Resource</h1>
        
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Resource Details</CardTitle>
            <CardDescription>
              Share your knowledge to help others and earn points
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Give your resource a descriptive title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe what this resource contains..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="type">Resource Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select resource type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Resource Types</SelectLabel>
                      {resourceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-md p-4 space-y-4">
                <div>
                  <Label className="mb-2 block">Upload Method</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={uploadType === "file" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setUploadType("file")}
                    >
                      <File className="h-4 w-4" />
                      <span>File Upload</span>
                    </Button>
                    <Button
                      type="button"
                      variant={uploadType === "link" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setUploadType("link")}
                    >
                      <Link className="h-4 w-4" />
                      <span>URL Link</span>
                    </Button>
                    <Button
                      type="button"
                      variant={uploadType === "text" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setUploadType("text")}
                    >
                      <Image className="h-4 w-4" />
                      <span>Text Content</span>
                    </Button>
                  </div>
                </div>

                {renderUploadSection()}
              </div>
            </CardContent>

            <CardFooter className="border-t pt-6">
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 w-full md:justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Your upload will be reviewed before being published.
                </p>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Uploading..." : "Submit Resource"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UploadResource;
