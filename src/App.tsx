
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Pages
import Login from "@/pages/Login";
import StudentHome from "@/pages/StudentHome";
import AdminHome from "@/pages/AdminHome";
import UploadResource from "@/pages/UploadResource";
import UserProfile from "@/pages/UserProfile";
import PremiumContent from "@/pages/PremiumContent";
import ExamPrep from "@/pages/ExamPrep";
import ContactAdmin from "@/pages/ContactAdmin";
import ResourcesManagement from "@/pages/ResourcesManagement";
import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";

// Components
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={["student", "admin"]} />}>
                <Route path="/home" element={<StudentHome />} />
                <Route path="/upload" element={<UploadResource />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/premium" element={<PremiumContent />} />
                <Route path="/exams" element={<ExamPrep />} />
                <Route path="/contact" element={<ContactAdmin />} />
              </Route>
              
              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/admin" element={<AdminHome />} />
                <Route path="/resources" element={<ResourcesManagement />} />
              </Route>
              
              {/* Default Routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
