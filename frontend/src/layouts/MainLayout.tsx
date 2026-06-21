import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Home, Search, Library, User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      
      {/* Animated Deep Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[150px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[150px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[150px] animate-blob animation-delay-4000" />
      </div>

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 glass flex flex-col hidden md:flex z-10 relative">
        <div className="p-6">
          <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 tracking-tight">
            RUHEngiKuppiHub
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-muted-foreground hover:text-foreground font-medium">
            <Home size={20} />
            Home
          </Link>
          <Link to="/faculty" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-muted-foreground hover:text-foreground font-medium">
            <Library size={20} />
            Faculty
          </Link>
          <Link to="/search" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-muted-foreground hover:text-foreground font-medium">
            <Search size={20} />
            Search
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10 bg-black/20">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold tracking-wide">{user.name}</div>
                  <div className="text-xs text-primary font-medium">{user.points} pts</div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 w-full rounded-md hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 text-muted-foreground font-medium"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-300 w-full"
            >
              <LogIn size={18} />
              Login / Sign Up
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="p-8 min-h-full animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
