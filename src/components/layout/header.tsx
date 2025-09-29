import { GraduationCap, Menu, User, LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenu?: boolean;
}

export function Header({ onMenuClick, showMenu = false }: HeaderProps) {
  const { user, signOut, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  <Link 
                    to="/" 
                    className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/colleges" 
                    className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Colleges
                  </Link>
                  <Link 
                    to="/compare" 
                    className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Compare
                  </Link>
                  <Link 
                    to="/news" 
                    className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    News
                  </Link>
                  
                  {/* Mobile auth section */}
                  <div className="border-t pt-4 mt-4">
                    {user ? (
                      <>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" size="sm" className="w-full mb-2">Admin</Button>
                          </Link>
                        )}
                        <div className="text-sm text-muted-foreground mb-2 px-4">{user.email}</div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            signOut();
                            setMobileMenuOpen(false);
                          }}
                          className="w-full"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" size="sm" className="w-full">Login</Button>
                        </Link>
                        <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                          <Button size="sm" className="bg-gradient-hero hover:opacity-90 w-full">Sign Up</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop auth section */}
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="outline" size="sm">Admin</Button>
                    </Link>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem disabled>
                        {user.email}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm" className="bg-gradient-hero hover:opacity-90">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}