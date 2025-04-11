
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, Clock, Search, Plus } from "lucide-react";

const Forums = () => {
  // Initialize empty forum topics
  const forumTopics = [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold">Discussion Forums</h1>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search discussions..." className="pl-8" />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> New Topic
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Topics</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {forumTopics.length > 0 ? (
              forumTopics.map((topic) => (
                <Card key={topic.id} className={topic.isPinned ? "border-primary/20" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg hover:text-primary cursor-pointer">
                          {topic.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span>Started by {topic.author}</span>
                          {topic.isPinned && (
                            <Badge variant="outline" className="text-xs">
                              Pinned
                            </Badge>
                          )}
                        </CardDescription>
                      </div>
                      <Badge>{topic.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
                    <div className="flex justify-between w-full">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" /> {topic.replies} replies
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" /> {topic.views} views
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {topic.lastActivity}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p>No forum topics yet. Be the first to create a discussion!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="popular" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <p>Popular topics will appear here based on view and reply counts.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <p>Most recently active topics will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="unanswered" className="space-y-4">
            <Card>
              <CardContent className="p-8 text-center">
                <p>Topics without any replies will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Forums;
