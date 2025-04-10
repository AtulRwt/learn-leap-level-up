
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Award, Clock } from "lucide-react";

const UserProfile = () => {
  const { user } = useAuth();

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Mock data for user stats
  const userStats = {
    totalUploads: 0,
    totalDownloads: 0,
    points: 0,
    pointsToNextLevel: 0,
    joinedDate: "Jan 15, 2024",
    achievements: [
      { id: 1, name: "First Upload", description: "Upload your first resource", earned: false },
      { id: 2, name: "Knowledge Sharer", description: "Upload 5 resources", earned: false },
      { id: 3, name: "Resource Star", description: "Get 10 likes on your resources", earned: false },
      { id: 5, name: "Power Contributor", description: "Upload 25 resources", earned: false },
    ],
  };

  // Mock data for uploads
  const uploads = [
    {
      id: 1,
      title: "Data Structures Notes",
      type: "Notes",
      date: "Mar 15, 2024",
      status: "approved",
      views: 0,
      downloads: 0,
    },
    {
      id: 2,
      title: "Algorithm Design Assignment",
      type: "Assignment",
      date: "Mar 10, 2024",
      status: "approved",
      views: 0,
      downloads: 0,
    },
    {
      id: 3,
      title: "Machine Learning PYQs",
      type: "PYQs",
      date: "Feb 28, 2024",
      status: "pending",
      views: 0,
      downloads: 0,
    },
  ];

  // Mock data for downloads
  const downloads = [
    {
      id: 1,
      title: "Advanced Database Systems Notes",
      type: "Notes",
      date: "Mar 18, 2024",
      uploadedBy: "Professor Smith",
    },
    {
      id: 2,
      title: "Computer Networks Tutorial",
      type: "Guide",
      date: "Mar 12, 2024",
      uploadedBy: "Tech Team",
    },
    {
      id: 3,
      title: "Java Programming Assignment",
      type: "Assignment",
      date: "Mar 5, 2024",
      uploadedBy: "Programming Lab",
    },
    {
      id: 4,
      title: "Operating Systems PYQs",
      type: "PYQs",
      date: "Feb 25, 2024",
      uploadedBy: "Exam Committee",
    },
  ];

  // Calculate progress percentage
  const progressPercentage = 0;

  return (
    <MainLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24 text-2xl">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(user?.name || "")}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  Change Avatar
                </Button>
              </div>

              <div className="flex-1 space-y-4 text-center md:text-left">
                <div>
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Joined {userStats.joinedDate}</span>
                  </Badge>
                  {user?.role === "admin" && (
                    <Badge className="bg-primary">Admin</Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="bg-secondary p-4 rounded-lg text-center">
                    <Upload className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-2xl font-bold">{userStats.totalUploads}</div>
                    <div className="text-xs text-muted-foreground">Uploads</div>
                  </div>
                  <div className="bg-secondary p-4 rounded-lg text-center">
                    <Download className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-2xl font-bold">{userStats.totalDownloads}</div>
                    <div className="text-xs text-muted-foreground">Downloads</div>
                  </div>
                  <div className="bg-secondary p-4 rounded-lg text-center">
                    <Award className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-2xl font-bold">{userStats.points}</div>
                    <div className="text-xs text-muted-foreground">Points</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Your uploads and downloads</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="uploads">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="uploads">Uploads</TabsTrigger>
                  <TabsTrigger value="downloads">Downloads</TabsTrigger>
                </TabsList>
                <TabsContent value="uploads" className="pt-4 space-y-4">
                  {uploads.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        You haven't uploaded any resources yet
                      </p>
                      <Button className="mt-4">Upload your first resource</Button>
                    </div>
                  ) : (
                    uploads.map((upload) => (
                      <div
                        key={upload.id}
                        className="border rounded-lg p-3 hover:bg-accent transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{upload.title}</div>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline">{upload.type}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {upload.date}
                              </span>
                            </div>
                          </div>
                          <Badge
                            className={
                              upload.status === "approved"
                                ? "bg-green-500"
                                : "bg-amber-500"
                            }
                          >
                            {upload.status === "approved"
                              ? "Approved"
                              : "Pending"}
                          </Badge>
                        </div>
                        {upload.status === "approved" && (
                          <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                            <div>{upload.views} views</div>
                            <div>{upload.downloads} downloads</div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="downloads" className="pt-4 space-y-4">
                  {downloads.map((download) => (
                    <div
                      key={download.id}
                      className="border rounded-lg p-3 hover:bg-accent transition-colors"
                    >
                      <div className="font-medium">{download.title}</div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex gap-2">
                          <Badge variant="outline">{download.type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {download.date}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          by {download.uploadedBy}
                        </span>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Your learning journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Next Level</span>
                  <span className="text-sm font-medium">
                    {userStats.points} / {userStats.pointsToNextLevel}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Keep uploading resources to earn more points!
                </p>
              </div>

              <div className="space-y-3">
                {userStats.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 border rounded-lg ${
                      achievement.earned
                        ? "border-primary/30 bg-primary/5"
                        : "opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {achievement.earned ? (
                        <Award className="h-4 w-4 text-primary" />
                      ) : (
                        <Award className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-medium text-sm">
                        {achievement.name}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserProfile;
