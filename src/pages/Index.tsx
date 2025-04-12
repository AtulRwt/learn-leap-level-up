
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseStatus } from '@/hooks/useSupabaseStatus';
import { Loader } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { status, error } = useSupabaseStatus();
  
  useEffect(() => {
    // Only redirect if we're connected
    if (status === 'connected') {
      // Redirect to login page
      navigate('/login');
    }
  }, [navigate, status]);

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
          <h1 className="text-2xl font-bold text-destructive">Connection Error</h1>
          <p className="text-muted-foreground">
            Unable to connect to the database. This could be due to:
          </p>
          <ul className="list-disc text-left ml-8">
            <li>Network connectivity issues</li>
            <li>Database service unavailability</li>
            <li>Authentication configuration problems</li>
          </ul>
          <div className="p-4 bg-destructive/10 rounded-md text-left">
            <p className="font-mono text-sm">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Index;
