
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Loader, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";
import { useSupabaseStatus } from "@/hooks/useSupabaseStatus";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { status: dbStatus, error: dbError } = useSupabaseStatus();

  console.log("Login component rendered with auth state:", { isAuthenticated, user, authLoading, dbStatus });

  useEffect(() => {
    console.log("Login component mounted, auth state:", { isAuthenticated, user, authLoading });
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User authenticated, redirecting:", user.role, user.email);
      const redirectPath = user.role === "admin" ? "/admin" : "/home";
      console.log("Redirecting to:", redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with:", { email, password, isRegistering });
    
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    
    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isRegistering) {
        if (!name.trim()) {
          toast.error("Please enter your name");
          setIsLoading(false);
          return;
        }
        
        console.log("Attempting to register with:", { email, name });
        
        if (dbStatus === 'error') {
          toast.warning("Database connection issues detected. Registration may fail.");
        }
        
        await register(email, password, name);
      } else {
        console.log("Attempting to login with:", email);
        
        if (dbStatus === 'error') {
          toast.warning("Database connection issues detected. Limited functionality available.");
        }
        
        const success = await login(email, password);
        
        if (!success) {
          console.log("Login failed, resetting loading state");
          setIsLoading(false);
        } else {
          console.log("Login successful, awaiting redirect...");
        }
      }
    } catch (error: any) {
      console.error("Authentication error in component:", error);
      toast.error(error.message || "Authentication failed");
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setName("");
    setPassword("");
  };

  if (authLoading && !isLoading) {
    console.log("Showing auth checking state");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
        <span className="mt-4">Checking authentication status...</span>
        <span className="text-sm text-muted-foreground mt-2">This should only take a moment.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/50 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">LearnLeap</span>
          </div>
        </div>
        
        {dbStatus === 'error' && (
          <Alert variant="default" className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <AlertTitle>Connection Limited</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Database connection issues detected. Some features may be limited.
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isRegistering ? "Create an account" : "Welcome back"}
            </CardTitle>
            <CardDescription className="text-center">
              {isRegistering 
                ? "Enter your details to register" 
                : "Sign in to access your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
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
                  required
                  disabled={isLoading}
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
                  required
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || authLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    {isRegistering ? "Creating Account..." : "Signing in..."}
                  </span>
                ) : (
                  isRegistering ? "Create Account" : "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              {isRegistering ? (
                <p>
                  Already have an account?{" "}
                  <button 
                    type="button" 
                    onClick={toggleMode}
                    className="text-primary hover:underline font-medium"
                    disabled={isLoading}
                  >
                    Sign in
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{" "}
                  <button 
                    type="button" 
                    onClick={toggleMode}
                    className="text-primary hover:underline font-medium"
                    disabled={isLoading}
                  >
                    Create one
                  </button>
                </p>
              )}
            </div>
            
            {process.env.NODE_ENV !== "production" && (
              <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                <p>DB Status: {dbStatus}</p>
                <p>Auth Loading: {authLoading ? 'Yes' : 'No'}</p>
                <p>Form Loading: {isLoading ? 'Yes' : 'No'}</p>
                <p>Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
