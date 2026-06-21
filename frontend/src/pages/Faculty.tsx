import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Folder, ChevronRight, Book, ArrowLeft, Layers, Calendar } from 'lucide-react';

interface Department {
  _id: string;
  name: string;
  code: string;
}

interface Module {
  _id: string;
  code: string;
  name: string;
  department?: Department;
  year: number;
  semester: number;
}

const Faculty = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, modRes] = await Promise.all([
          api.get('/modules/departments'),
          api.get('/modules'),
        ]);
        setDepartments(deptRes.data);
        setModules(modRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading academic structure...</div>;
  }

  const getSemestersForYear = (year: number) => {
    return [year * 2 - 1, year * 2];
  };

  const resetSelection = () => {
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedDept(null);
  };

  const handleBack = () => {
    if (selectedDept) setSelectedDept(null);
    else if (selectedSemester) setSelectedSemester(null);
    else if (selectedYear) setSelectedYear(null);
  };

  const renderBreadcrumbs = () => {
    return (
      <div className="flex items-center gap-2 text-muted-foreground mb-8 text-sm">
        <button onClick={resetSelection} className="hover:text-primary transition-colors flex items-center gap-1">
          <Folder size={16} /> Faculty
        </button>
        {selectedYear && (
          <>
            <ChevronRight size={14} />
            <button 
              onClick={() => { setSelectedSemester(null); setSelectedDept(null); }}
              className={`hover:text-primary transition-colors ${!selectedSemester ? 'text-foreground font-medium' : ''}`}
            >
              Year {selectedYear}
            </button>
          </>
        )}
        {selectedSemester && (
          <>
            <ChevronRight size={14} />
            <button 
              onClick={() => setSelectedDept(null)}
              className={`hover:text-primary transition-colors ${!selectedDept ? 'text-foreground font-medium' : ''}`}
            >
              Semester {selectedSemester}
            </button>
          </>
        )}
        {selectedDept && (
          <>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">{selectedDept.name}</span>
          </>
        )}
      </div>
    );
  };

  // Level 1: Years
  if (!selectedYear) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Academic Structure</h1>
        {renderBreadcrumbs()}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(year => (
            <button 
              key={`year-${year}`}
              onClick={() => setSelectedYear(year)}
              className="glass p-6 rounded-xl hover:bg-primary/5 transition-all group flex flex-col items-center justify-center gap-4 border border-border/50 hover:border-primary/30"
            >
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar size={32} />
              </div>
              <h2 className="text-xl font-bold">Year {year}</h2>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Level 2: Semesters
  if (!selectedSemester) {
    const sems = getSemestersForYear(selectedYear);
    return (
      <div>
        <div className="flex items-center gap-4 mb-8">
          <button onClick={handleBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold">Select Semester</h1>
        </div>
        {renderBreadcrumbs()}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {sems.map(sem => (
            <button 
              key={`sem-${sem}`}
              onClick={() => setSelectedSemester(sem)}
              className="glass p-8 rounded-xl hover:bg-blue-500/5 transition-all group flex flex-col items-center justify-center gap-4 border border-border/50 hover:border-blue-500/30"
            >
              <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers size={32} />
              </div>
              <h2 className="text-2xl font-bold">Semester {sem}</h2>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Level 3 & 4: Departments & Modules
  const semModules = modules.filter(m => m.year === selectedYear && m.semester === selectedSemester);

  if (selectedYear > 1 && !selectedDept) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-8">
          <button onClick={handleBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold">Select Department</h1>
        </div>
        {renderBreadcrumbs()}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map(dept => (
            <button 
              key={dept._id}
              onClick={() => setSelectedDept(dept)}
              className="glass p-6 rounded-xl hover:bg-purple-500/5 transition-all group flex flex-col items-center justify-center gap-4 border border-border/50 hover:border-purple-500/30 text-center"
            >
              <div className="w-16 h-16 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Folder size={32} />
              </div>
              <div>
                <h2 className="text-lg font-bold">{dept.name}</h2>
                <div className="text-sm text-muted-foreground mt-1">{dept.code}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Modules List
  let displayModules = semModules;
  if (selectedYear > 1 && selectedDept) {
    displayModules = semModules.filter(m => m.department?._id === selectedDept._id);
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={handleBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold">Modules</h1>
      </div>
      {renderBreadcrumbs()}
      
      {displayModules.length === 0 ? (
        <div className="glass p-12 rounded-xl border border-border/50 text-center flex flex-col items-center">
           <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
             <Book size={32} />
           </div>
           <h2 className="text-2xl font-bold mb-2">No Modules Found</h2>
           <p className="text-muted-foreground">Modules for this selection haven't been added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayModules.map(m => (
            <Link 
              key={m._id} 
              to={`/modules/${m.code}`}
              className="glass p-6 rounded-xl hover:bg-white/5 transition-all group flex items-start gap-4 border border-border/50 hover:border-primary/50"
            >
              <div className="bg-primary/10 text-primary p-3 rounded-lg group-hover:scale-110 transition-transform shrink-0">
                <Book size={24} />
              </div>
              <div>
                <div className="font-bold text-lg leading-tight mb-1">{m.code}</div>
                <div className="text-sm text-muted-foreground">{m.name}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Faculty;
