
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const { login, register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === "admin" ? "/admin" : "/home");
    }
  }, [isAuthenticated, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    if (isRegistering && !name) {
      toast.error("Please enter your name");
      return;
    }
    
    setLoading(true);
    try {
      if (isRegistering) {
        // Register new user
        await register(email, password, name);
        setIsRegistering(false);
      } else {
        // Login existing user
        await login(email, password);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleTestAccountClick = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    setIsRegistering(false);
  };

  // Create test accounts when the page loads
  useEffect(() => {
    const createTestAccounts = async () => {
      try {
        // You'd typically do this in a backend script, not in the frontend
        // This is just for testing purposes
      } catch (error) {
        console.error("Error creating test accounts:", error);
      }
    };
    
    // Uncomment this if you want to automatically create test accounts
    // createTestAccounts();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/50 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">LearnLeap</span>
          </div>
        </div>
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isRegistering ? "Create an account" : "Welcome back"}
            </CardTitle>
            <CardDescription className="text-center">
              {isRegistering 
                ? "Sign up to start learning" 
                : "Sign in to access your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    required={isRegistering}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isRegistering && (
                    <a href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </a>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isRegistering ? "Creating account..." : "Signing in..."}
                  </>
                ) : (
                  isRegistering ? "Sign up" : "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-sm">
            <Button
              variant="ghost"
              type="button"
              className="w-full text-primary"
              onClick={() => setIsRegistering(!isRegistering)}
              disabled={loading}
            >
              {isRegistering
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </Button>
            
            {!isRegistering && (
              <>
                <p className="w-full text-center font-medium text-muted-foreground">
                  Create your own account to test:
                </p>
                <div className="w-full flex flex-col gap-1">
                  <p className="text-xs text-center text-muted-foreground">
                    The test accounts shown previously might not be set up.
                    <br />
                    Please register a new account or create these in Supabase.
                  </p>
                </div>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
