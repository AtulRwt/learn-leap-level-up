
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Message {
  id: number;
  subject: string;
  content: string;
  date: string;
  status: "pending" | "resolved";
}

const ContactAdmin = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock message history
  const [messageHistory, setMessageHistory] = useState<Message[]>([
    {
      id: 1,
      subject: "Question about premium access",
      content: "I'm wondering how to upgrade to premium...",
      date: "March 10, 2024",
      status: "resolved",
    },
    {
      id: 2,
      subject: "Resource upload issue",
      content: "I'm having trouble uploading PDF files larger than 5MB...",
      date: "March 15, 2024",
      status: "pending",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast.error("Please complete all fields");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Add message to history
      const newMessage: Message = {
        id: Date.now(),
        subject,
        content: message,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        status: "pending",
      };
      
      setMessageHistory([newMessage, ...messageHistory]);
      
      // Reset form
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
      
      toast.success("Message sent successfully!");
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2">Contact Admin</h1>
          <p className="text-muted-foreground">
            Have questions or issues? Send a message to the platform administrators
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Send Message</span>
                </CardTitle>
                <CardDescription>
                  Our team will respond to your message as soon as possible
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input 
                      id="name" 
                      value={user?.name} 
                      disabled 
                      className="bg-muted"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Your Email</Label>
                    <Input 
                      id="email" 
                      value={user?.email} 
                      disabled 
                      className="bg-muted"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What is your message about?"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your question or issue in detail..."
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending Message..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Message History</h2>
            
            {messageHistory.length === 0 ? (
              <div className="text-center py-8 border rounded-lg">
                <p className="text-muted-foreground">
                  You haven't sent any messages yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messageHistory.map((msg) => (
                  <Card key={msg.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{msg.subject}</CardTitle>
                        <Badge
                          className={
                            msg.status === "resolved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                          }
                        >
                          {msg.status === "resolved" ? (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Resolved</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Pending</span>
                            </div>
                          )}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {msg.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-2">{msg.content}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" className="w-full text-xs">
                        View Full Conversation
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactAdmin;
