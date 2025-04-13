
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
    // Always redirect to login after a brief delay, regardless of DB status
    if (status !== 'checking') {
      const timeout = setTimeout(() => {
        console.log("Redirecting to login from Index page");
        navigate('/login', { replace: true });
      }, status === 'error' ? 1500 : 500);
      
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
            <AlertTitle>Connection Warning</AlertTitle>
            <AlertDescription>
              There appears to be an issue with the database connection. Some features may be limited.
            </AlertDescription>
          </Alert>
          
          <div className="p-4 bg-destructive/10 rounded-md text-left max-h-40 overflow-y-auto">
            <p className="font-mono text-sm break-words">{error}</p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={handleContinueAnyway} 
              className="w-full"
            >
              Continue to Login
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            The app will continue with cached data where possible.
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;
