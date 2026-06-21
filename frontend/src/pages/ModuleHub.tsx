import React, { useEffect, useState, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Video, BookOpen, FileText, HelpCircle, Bot, Upload, X, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Module {
  _id: string;
  code: string;
  name: string;
  description?: string;
  year: number;
  semester: number;
}

interface Resource {
  _id: string;
  title: string;
  description?: string;
  type: string;
  fileUrl?: string;
  link?: string;
  uploadedBy: { name: string, points: number };
  createdAt: string;
}

const ModuleHub = () => {
  const { code } = useParams();
  const [module, setModule] = useState<Module | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [showUpload, setShowUpload] = useState(false);
  const [uploadType, setUploadType] = useState('kuppi');
  const [file, setFile] = useState<File | null>(null);
  const { user, token } = useAuth();
  
  const [studyGuide, setStudyGuide] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    fetchModuleAndResources();
  }, [code]);

  const fetchModuleAndResources = async () => {
    try {
      const [modRes, resRes] = await Promise.all([
        api.get(`/modules/${code}`),
        api.get(`/resources/${code}`)
      ]);
      setModule(modRes.data);
      setResources(resRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      alert("Please login to upload resources.");
      return;
    }
    const formData = new FormData(e.currentTarget);
    formData.append('type', uploadType);
    formData.append('moduleCode', code || '');
    if (file) formData.append('file', file);

    try {
      await api.post('/resources', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          // Authorization is handled by api interceptor
        }
      });
      setShowUpload(false);
      setFile(null);
      fetchModuleAndResources(); // Refresh list
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload. Ensure you are logged in.');
    }
  };

  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await api.delete(`/resources/${id}`);
        fetchModuleAndResources();
      } catch (error) {
        alert("Failed to delete. Ensure you are an admin.");
      }
    }
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !editingResource) return;
    const formData = new FormData(e.currentTarget);
    try {
      await api.put(`/resources/${editingResource._id}`, {
        title: formData.get('title'),
        description: formData.get('description'),
        link: formData.get('link')
      });
      setEditingResource(null);
      fetchModuleAndResources();
    } catch (error) {
      alert("Failed to update. Ensure you are an admin.");
    }
  };

  if (loading) return <div className="text-center py-20">Loading module...</div>;
  if (!module) return <div className="text-center py-20 text-red-500">Module not found</div>;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'kuppi', label: 'Kuppis', icon: Video },
    { id: 'past_paper', label: 'Past Papers', icon: BookOpen },
    { id: 'assignment', label: 'Assignments', icon: FileText },
    { id: 'quiz', label: 'Quizzes', icon: HelpCircle },
    { id: 'ai', label: 'AI Assistant', icon: Bot },
  ];

  const currentResources = resources.filter(r => r.type === activeTab);

  return (
    <div className="max-w-6xl mx-auto pb-20 relative">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold mb-2">{module.code}: {module.name}</h1>
          <div className="flex gap-4 text-muted-foreground">
            <span>Year {module.year}</span>
            <span>&bull;</span>
            <span>Semester {module.semester}</span>
          </div>
        </div>
        <button 
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
        >
          <Upload size={18} /> Upload Resource
        </button>
      </div>

      <div className="flex overflow-x-auto border-b border-border/50 mb-8 pb-px scrollbar-hide">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab.id 
                  ? 'border-primary text-primary bg-primary/5' 
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="glass p-8 rounded-xl border border-border/50">
            <h2 className="text-2xl font-bold mb-4">Module Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              {module.description || 'No description provided for this module yet.'}
            </p>
          </div>
        )}

        {['kuppi', 'past_paper', 'assignment', 'quiz'].includes(activeTab) && (
          <div>
            {currentResources.length === 0 ? (
              <div className="glass p-12 rounded-xl border border-border/50 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  {React.createElement(tabs.find(t => t.id === activeTab)?.icon || FileText, { size: 32 })}
                </div>
                <h2 className="text-2xl font-bold mb-2 capitalize">{activeTab.replace('_', ' ')} Repository</h2>
                <p className="text-muted-foreground mb-6">No resources uploaded yet. Be the first to contribute!</p>
                <button 
                  onClick={() => { setUploadType(activeTab); setShowUpload(true); }}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Upload Resource
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentResources.map(res => (
                  <div key={res._id} className="glass p-5 rounded-xl border border-border/50 hover:bg-white/5 transition-colors relative group">
                    {user?.role === 'admin' && (
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingResource(res)} className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/40" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(res._id)} className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                    <h3 className="font-bold text-lg mb-1 pr-16">{res.title}</h3>
                    {res.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{res.description}</p>}
                    
                    <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                       <span>By {res.uploadedBy.name}</span>
                       <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">+{res.uploadedBy.points} pts</span>
                    </div>

                    <div className="flex gap-2">
                      {res.fileUrl && (
                        <a href={import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') + res.fileUrl : `http://localhost:5000${res.fileUrl}`} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 bg-secondary text-secondary-foreground rounded text-sm font-medium hover:bg-secondary/80">
                          View File
                        </a>
                      )}
                      {res.link && (
                        <a href={res.link} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 bg-primary/10 text-primary rounded text-sm font-medium hover:bg-primary/20">
                          Open Link
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="glass p-8 rounded-xl border border-border/50">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Bot className="text-blue-500" /> AI Assistant</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Generate Study Guide */}
              <div className="border border-border/50 p-6 rounded-lg bg-card">
                <h3 className="text-lg font-bold mb-2">Study Guide Generator</h3>
                <p className="text-sm text-muted-foreground mb-4">Generate a comprehensive study guide tailored specifically for {module.name}.</p>
                <button 
                  onClick={async () => {
                    setStudyGuide('Generating (this might take a few seconds)...');
                    try {
                      const res = await api.post('/ai/study-guide', { moduleCode: module.code });
                      setStudyGuide(res.data.content);
                    } catch (e) {
                      setStudyGuide('Failed to generate study guide. Please check your Gemini API key.');
                    }
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 w-full mb-4"
                >
                  Generate Study Guide
                </button>
                {studyGuide && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-md max-h-[300px] overflow-y-auto text-sm whitespace-pre-wrap font-mono">
                    {studyGuide}
                  </div>
                )}
              </div>

              {/* Chat */}
              <div className="border border-border/50 p-6 rounded-lg bg-card flex flex-col h-[400px]">
                <h3 className="text-lg font-bold mb-2">AI Tutor Chat</h3>
                <div className="flex-1 overflow-y-auto mb-4 bg-muted/10 p-4 rounded-md space-y-4">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`p-3 rounded-lg text-sm w-fit max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'}`}>
                      {msg.content}
                    </div>
                  ))}
                </div>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!chatInput) return;
                    const newMsg = chatInput;
                    setChatMessages([...chatMessages, { role: 'user', content: newMsg }]);
                    setChatInput('');
                    try {
                      const res = await api.post('/ai/chat', { moduleCode: module.code, message: chatInput, history: chatMessages });
                      setChatMessages(prev => [...prev, { role: 'ai', content: res.data.reply }]);
                    } catch (e) {
                      setChatMessages(prev => [...prev, { role: 'ai', content: 'Error: Could not reach AI. Check your Gemini API key.' }]);
                    }
                  }}
                  className="flex gap-2"
                >
                  <input 
                    type="text" 
                    value={chatInput} 
                    onChange={e => setChatInput(e.target.value)} 
                    className="flex-1 bg-white/5 text-foreground placeholder:text-muted-foreground border border-white/10 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50" 
                    placeholder="Ask a question..."
                  />
                  <button type="submit" className="px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90">Send</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-border">
            <div className="flex justify-between items-center p-4 border-b border-border bg-muted/30">
              <h2 className="text-lg font-bold">Upload Resource</h2>
              <button onClick={() => setShowUpload(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Resource Type</label>
                <select 
                  value={uploadType} 
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-full bg-white/5 text-foreground placeholder:text-muted-foreground border border-white/10 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="kuppi" className="bg-[#0b0f19] text-white">Kuppi (Video/Link)</option>
                  <option value="past_paper" className="bg-[#0b0f19] text-white">Past Paper</option>
                  <option value="assignment" className="bg-[#0b0f19] text-white">Assignment</option>
                  <option value="quiz" className="bg-[#0b0f19] text-white">Quiz</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required name="title" type="text" className="w-full bg-white/5 text-foreground placeholder:text-muted-foreground border border-white/10 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. 2023 End Semester Paper" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                <textarea name="description" rows={3} className="w-full bg-white/5 text-foreground placeholder:text-muted-foreground border border-white/10 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Brief details about the resource..."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">File Upload</label>
                  <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-foreground file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">External Link</label>
                  <input name="link" type="url" className="w-full bg-white/5 text-foreground placeholder:text-muted-foreground border border-white/10 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. YouTube URL" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowUpload(false)} className="px-4 py-2 font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90">Submit Resource</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {editingResource && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-border">
            <div className="flex justify-between items-center p-4 border-b border-border bg-muted/30">
              <h2 className="text-lg font-bold">Edit Resource</h2>
              <button onClick={() => setEditingResource(null)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required name="title" defaultValue={editingResource.title} type="text" className="w-full bg-white/5 text-foreground placeholder:text-muted-foreground border border-white/10 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea name="description" defaultValue={editingResource.description} rows={3} className="w-full bg-white/5 text-foreground placeholder:text-muted-foreground border border-white/10 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">External Link</label>
                <input name="link" defaultValue={editingResource.link} type="url" className="w-full bg-white/5 text-foreground placeholder:text-muted-foreground border border-white/10 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingResource(null)} className="px-4 py-2 font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleHub;
