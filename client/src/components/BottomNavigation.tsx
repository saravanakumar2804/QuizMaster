import { useLocation } from "wouter";
import { Home, Compass, BarChart2, Settings } from "lucide-react";

interface BottomNavigationProps {
  activeItem: "home" | "explore" | "stats" | "settings";
}

export default function BottomNavigation({ activeItem }: BottomNavigationProps) {
  const [, navigate] = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="bg-white border-t shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-2">
          <button 
            className={`flex flex-col items-center px-4 py-2 ${activeItem === "home" ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => handleNavigate("/")}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </button>
          
          <button 
            className={`flex flex-col items-center px-4 py-2 ${activeItem === "explore" ? "text-primary" : "text-muted-foreground"}`}
          >
            <Compass className="h-5 w-5" />
            <span className="text-xs mt-1">Explore</span>
          </button>
          
          <button 
            className={`flex flex-col items-center px-4 py-2 ${activeItem === "stats" ? "text-primary" : "text-muted-foreground"}`}
          >
            <BarChart2 className="h-5 w-5" />
            <span className="text-xs mt-1">Stats</span>
          </button>
          
          <button 
            className={`flex flex-col items-center px-4 py-2 ${activeItem === "settings" ? "text-primary" : "text-muted-foreground"}`}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
