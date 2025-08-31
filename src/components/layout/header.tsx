import { GraduationCap, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenu?: boolean;
}

export function Header({ onMenuClick, showMenu = false }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/80">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {showMenu && (
              <Button variant="ghost" size="sm" onClick={onMenuClick}>
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">CollegeGuide</h1>
                <p className="text-xs text-muted-foreground">Choose College - Nepal</p>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/colleges" className="text-foreground hover:text-primary transition-colors">Colleges</Link>
            <Link to="/compare" className="text-foreground hover:text-primary transition-colors">Compare</Link>
            <Link to="/news" className="text-foreground hover:text-primary transition-colors">News</Link>
          </nav>
          
          <div className="flex items-center space-x-2">
            <Link to="/auth">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-gradient-hero hover:opacity-90">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}