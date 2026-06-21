import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Book, FileText, Video, HelpCircle, BookOpen } from 'lucide-react';
import api from '../api';

interface SearchResults {
  modules: any[];
  resources: any[];
}

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ modules: [], resources: [] });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    try {
      const res = await api.get(`/search?q=${query}`);
      setResults(res.data);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'kuppi': return <Video size={16} />;
      case 'past_paper': return <BookOpen size={16} />;
      case 'assignment': return <FileText size={16} />;
      case 'quiz': return <HelpCircle size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Smart Search</h1>
      
      <form onSubmit={handleSearch} className="relative mb-12">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="text-muted-foreground" size={24} />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-card border-2 border-primary/20 rounded-full py-4 pl-12 pr-32 text-lg outline-none focus:border-primary/50 transition-colors shadow-lg shadow-primary/5"
          placeholder="Search for Laplace, CS2402, Mid Semester..."
        />
        <button 
          type="submit"
          disabled={loading}
          className="absolute inset-y-2 right-2 px-6 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="space-y-8">
        {results.modules.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 border-b border-border/50 pb-2">Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.modules.map(m => (
                <Link key={m._id} to={`/modules/${m.code}`} className="glass p-4 rounded-lg flex items-center gap-3 hover:bg-white/5 transition-colors border border-border/50">
                  <div className="bg-primary/10 text-primary p-2 rounded-md"><Book size={18} /></div>
                  <div>
                    <div className="font-bold">{m.code}</div>
                    <div className="text-sm text-muted-foreground">{m.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {results.resources.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 border-b border-border/50 pb-2">Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.resources.map(r => (
                <div key={r._id} className="glass p-4 rounded-lg flex flex-col gap-2 border border-border/50">
                  <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
                    {getIcon(r.type)}
                    <span className="capitalize">{r.type.replace('_', ' ')}</span>
                  </div>
                  <h3 className="font-bold">{r.title}</h3>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {r.description || 'No description'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 flex justify-between">
                     <span>Module: {r.module?.code}</span>
                     <span>By {r.uploadedBy?.name}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {r.fileUrl && <a href={import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') + r.fileUrl : `http://localhost:5000${r.fileUrl}`} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 bg-secondary text-secondary-foreground rounded text-sm font-medium hover:bg-secondary/80">View File</a>}
                    {r.link && <a href={r.link} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 bg-primary/10 text-primary rounded text-sm font-medium hover:bg-primary/20">Open Link</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && query && results.modules.length === 0 && results.resources.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No results found for "{query}". Try a different keyword.
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
