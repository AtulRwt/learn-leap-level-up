
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Upload, 
  User, 
  BookOpen, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Settings,
  Files
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const Sidebar = ({ className }: SidebarProps) => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems: NavItem[] = [
    {
      title: "Home",
      href: user?.role === "admin" ? "/admin" : "/home",
      icon: Home,
    },
    {
      title: "Upload Resource",
      href: "/upload",
      icon: Upload,
    },
    {
      title: "My Profile",
      href: "/profile",
      icon: User,
    },
    {
      title: "Resources",
      href: "/premium",
      icon: BookOpen,
    },
    {
      title: "Exam Prep",
      href: "/exams",
      icon: BookOpen,
    },
    {
      title: "Contact Admin",
      href: "/contact",
      icon: MessageSquare,
    },
    {
      title: "All Resources",
      href: "/resources",
      icon: Files,
      adminOnly: true,
    },
    {
      title: "Settings",
      href: "/profile",
      icon: Settings,
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen relative transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="font-semibold text-lg text-primary">LearnLeap</div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("absolute right-0 -mr-3 bg-background rounded-full border shadow-sm", 
            collapsed && "mx-auto")}
          onClick={toggleSidebar}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="py-4">
        <nav className="space-y-1 px-2">
          {navItems
            .filter(item => !item.adminOnly || user?.role === "admin")
            .map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "sidebar-link",
                    isActive ? "active" : "",
                    collapsed && "justify-center px-2"
                  )
                }
              >
                <item.icon className={cn("h-5 w-5", collapsed && "mx-auto")} />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
