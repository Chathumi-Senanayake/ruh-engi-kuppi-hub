import { Link } from 'react-router-dom';
import { BookOpen, Video, Award, Users } from 'lucide-react';

const Home = () => {

  return (
    <div className="max-w-5xl mx-auto py-12 relative z-10 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">RUHEngiKuppiHub</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The ultimate central repository for Engineering Faculty students. 
          Find Kuppi videos, past papers, assignments, and AI-powered study guides all in one place.
        </p>
        
        <div className="mt-10 flex gap-4 justify-center">
          <Link to="/faculty" className="px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-full font-bold hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300">
            Browse Modules
          </Link>
          <Link to="/search" className="px-8 py-3 glass text-foreground rounded-full font-bold hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
            Search Resources
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/faculty" className="glass glass-hover p-6 rounded-2xl flex flex-col items-center text-center group cursor-pointer border border-white/10">
          <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Video size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Kuppi Videos</h3>
          <p className="text-sm text-muted-foreground">Catch up on missed lectures with student-recorded sessions.</p>
        </Link>

        <Link to="/faculty" className="glass glass-hover p-6 rounded-2xl flex flex-col items-center text-center group cursor-pointer border border-white/10">
          <div className="w-16 h-16 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <BookOpen size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Past Papers</h3>
          <p className="text-sm text-muted-foreground">Prepare for exams with a vast collection of previous papers.</p>
        </Link>

        <Link to="/faculty" className="glass glass-hover p-6 rounded-2xl flex flex-col items-center text-center group cursor-pointer border border-white/10">
          <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Users size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Community Driven</h3>
          <p className="text-sm text-muted-foreground">Upload resources, help juniors, and earn reputation points.</p>
        </Link>

        <Link to="/faculty" className="glass glass-hover p-6 rounded-2xl flex flex-col items-center text-center group cursor-pointer border border-white/10">
          <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Award size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
          <p className="text-sm text-muted-foreground">Generate tailored study guides and ask questions instantly.</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
