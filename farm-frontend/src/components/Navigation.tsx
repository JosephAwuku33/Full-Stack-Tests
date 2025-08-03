import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Sprout } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60 w-full">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Sprout className="h-6 w-6 text-primary" />
          FarmFresh
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Products
          </Link>
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Farmers
          </Link>
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
            About
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="default" size="sm">
            <ShoppingCart className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">Cart</span>
          </Button>
          
          <Button variant="default" size="sm">
            <User className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">Account</span>
          </Button>
          
          <Link to="/login">
            <Button size="sm">Sign In</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};