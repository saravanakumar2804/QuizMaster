import { useLocation } from "wouter";
import { User } from "lucide-react";

export default function AppBar() {
  const [, navigate] = useLocation();

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-2xl">📝</span>
          <h1 className="text-xl font-bold">QuizMaster</h1>
        </div>
        <div className="flex items-center space-x-3">
          <User className="h-5 w-5" />
          <span className="text-sm font-medium">Profile</span>
        </div>
      </div>
    </header>
  );
}
