
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      console.log("User authenticated as:", user?.role, user?.email);
      navigate(user?.role === "admin" ? "/admin" : "/home");
    }
  }, [isAuthenticated, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        await register(email, password, name);
      } else {
        console.log("Submitting login form with:", email);
        await login(email, password);
        // Login success will be handled by the auth change listener
      }
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    // Clear form on mode toggle
    setName("");
    setPassword("");
  };

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
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
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
                  >
                    Create one
                  </button>
                </p>
              )}
            </div>
            {!isRegistering && (
              <p className="w-full text-center text-sm text-muted-foreground">
                Test accounts:<br />
                <span className="font-semibold">admin@example.com / admin123</span><br />
                <span className="font-semibold">student@example.com / student123</span><br />
                <span className="font-semibold">premium@example.com / premium123</span>
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
