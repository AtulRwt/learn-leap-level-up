
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goBack = () => {
    navigate(user?.role === "admin" ? "/admin" : "/home");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/50 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-destructive/10 p-3 rounded-full">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-lg text-muted-foreground mb-8">
          You don't have permission to access this page.
        </p>
        <Button onClick={goBack}>Back to Dashboard</Button>
      </div>
    </div>
  );
};

export default Unauthorized;
