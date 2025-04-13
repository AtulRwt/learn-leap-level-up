
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseStatus } from '@/hooks/useSupabaseStatus';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader, AlertCircle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { status, error } = useSupabaseStatus();
  
  useEffect(() => {
    // Only redirect if we're connected
    if (status === 'connected') {
      console.log("Database connection successful, redirecting to login");
      navigate('/login', { replace: true });
    } else if (status === 'error') {
      // Automatically redirect to login page after 3 seconds on error
      console.log("Database connection error, redirecting to login in 3 seconds");
      const timeout = setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [navigate, status]);

  const handleContinueAnyway = () => {
    console.log("User chose to continue despite database error");
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {status === 'checking' && (
        <div className="text-center space-y-4">
          <Loader className="h-8 w-8 animate-spin mx-auto" />
          <h1 className="text-2xl font-bold">Connecting to database...</h1>
          <p className="text-muted-foreground">Please wait while we connect to the service.</p>
        </div>
      )}
      
      {status === 'error' && (
        <div className="text-center space-y-4 max-w-md">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              There appears to be an issue with the database configuration. Redirecting to login...
            </AlertDescription>
          </Alert>
          
          <div className="p-4 bg-destructive/10 rounded-md text-left">
            <p className="font-mono text-sm break-words">{error}</p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
            <Button 
              onClick={handleContinueAnyway} 
              className="w-full"
            >
              Continue to Login Now
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            Note: Some features may be limited without a working database connection.
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;
