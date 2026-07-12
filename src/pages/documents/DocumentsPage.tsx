import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, Share2, PenTool, CheckCircle2, X, Star, ChevronUp, ChevronDown, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface DocumentItem {
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  status: 'Draft' | 'In Review' | 'Signed';
  fileUrl: string | null;
  signature: string | null;
  starred: boolean;
  isDeleted: boolean;
}

export const DocumentsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('Recent Files');

  // Initial Documents Data State
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 1,
      name: 'Seed_Investment_Agreement.pdf',
      type: 'PDF',
      size: '2.4 MB',
      lastModified: '2026-06-15',
      shared: true,
      status: 'Draft',
      fileUrl: null,
      signature: null,
      starred: true,
      isDeleted: false
    },
    {
      id: 2,
      name: 'Founder_Vesting_Contract.pdf',
      type: 'PDF',
      size: '1.8 MB',
      lastModified: '2026-07-01',
      shared: false,
      status: 'In Review',
      fileUrl: null,
      signature: null,
      starred: false,
      isDeleted: false
    }
  ]);

  // View States
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false); // Full screen modal trigger
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isDrawing = useRef<boolean>(false);

  // 1. Real-Time File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.name.split('.').pop()?.toUpperCase() || 'PDF';
    const fileSizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    const currentDate = new Date().toISOString().split('T')[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      const realBase64Data = event.target?.result as string;

      const newDoc: DocumentItem = {
        id: Date.now(),
        name: file.name,
        type: fileType,
        size: fileSizeStr,
        lastModified: currentDate,
        shared: false,
        status: 'Draft',
        fileUrl: realBase64Data,
        signature: null,
        starred: false,
        isDeleted: false
      };

      setDocuments([newDoc, ...documents]);
      setSelectedDoc(newDoc);
      setIsFullScreen(true); // Upload hote hi direct Full Screen open ho jaye
      setIsSigning(false);
      setCurrentPage(1);
      setZoomScale(100);
      setActiveFilter('Recent Files');
    };

    reader.readAsDataURL(file);
  };

  // 2. Download Feature
  const handleDownload = (doc: DocumentItem) => {
    if (doc.fileUrl) {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Simulated download for default file: ${doc.name}`);
    }
  };

  // 3. Delete Management Feature
  const handleDelete = (id: number) => {
    const updatedDocs = documents.map(doc => {
      if (doc.id === id) {
        if (doc.isDeleted) return null;
        return { ...doc, isDeleted: true };
      }
      return doc;
    }).filter(Boolean) as DocumentItem[];

    setDocuments(updatedDocs);
    if (selectedDoc?.id === id) {
      setSelectedDoc(null);
      setIsFullScreen(false);
    }
  };

  // 4. Star Toggle Action
  const toggleStar = (id: number) => {
    setDocuments(documents.map(doc => doc.id === id ? { ...doc, starred: !doc.starred } : doc));
    if (selectedDoc?.id === id) {
      setSelectedDoc(selectedDoc ? { ...selectedDoc, starred: !selectedDoc.starred } : null);
    }
  };

  // 5. Sidebar Filters
  const filteredDocuments = documents.filter(doc => {
    if (activeFilter === 'Trash') return doc.isDeleted;
    if (doc.isDeleted) return false; 
    
    switch (activeFilter) {
      case 'Shared with Me': return doc.shared;
      case 'Starred': return doc.starred;
      case 'Recent Files':
      default: return true;
    }
  });

  const getStatusBadge = (status: 'Draft' | 'In Review' | 'Signed') => {
    switch (status) {
      case 'Signed': return <Badge variant="success" size="sm">Signed</Badge>;
      case 'In Review': return <Badge variant="warning" size="sm">In Review</Badge>;
      default: return <Badge variant="primary" size="sm">Draft</Badge>;
    }
  };

  // 6. E-Signature Drawing Engine
  const getMousePos = (canvas: HTMLCanvasElement, e: React.MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    isDrawing.current = true;
    const pos = getMousePos(canvas, e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getMousePos(canvas, e);
    ctx.lineTo(pos.x, pos.y);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#1E3A8A'; 
    ctx.stroke();
  };

  const stopDrawing = () => { isDrawing.current = false; };
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedDoc) return;
    const sigData = canvas.toDataURL(); 
    const updatedDocs = documents.map(doc => 
      doc.id === selectedDoc.id ? { ...doc, status: 'Signed' as const, signature: sigData } : doc
    );
    setDocuments(updatedDocs);
    setSelectedDoc({ ...selectedDoc, status: 'Signed', signature: sigData });
    setIsSigning(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept="application/pdf,image/*" 
      />

      {/* Main Dashboard Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-blue-50">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Processing Chamber</h1>
          <p className="text-gray-600">Upload agreements, view secure previews, track states, and apply e-signatures.</p>
        </div>
        
        <Button 
          leftIcon={<Upload size={18} />} 
          onClick={() => fileInputRef.current?.click()}
          className="bg-primary-600 hover:bg-primary-700 text-white"
        >
          Upload Document
        </Button>
      </div>
      
      {/* Grid Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Filter Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader><h2 className="text-lg font-medium text-gray-900">Storage</h2></CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Used</span>
                  <span className="font-medium text-gray-900">12.5 GB</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-2 bg-primary-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Access</h3>
                <div className="space-y-1">
                  {['Recent Files', 'Shared with Me', 'Starred', 'Trash'].map((item) => (
                    <button 
                      key={item} 
                      onClick={() => { setActiveFilter(item); setSelectedDoc(null); }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        activeFilter === item ? 'bg-blue-100 text-primary-700 font-medium' : 'text-gray-700 hover:bg-blue-50'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Central Files Registry Grid Column */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="border-b border-gray-50">
              <h2 className="text-lg font-medium text-gray-900">{activeFilter}</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">No contracts available inside this section.</div>
                ) : (
                  filteredDocuments.map(doc => (
                    <div
                      key={doc.id}
                      onClick={() => { setSelectedDoc(doc); setIsFullScreen(true); setIsSigning(false); }}
                      className="flex items-center p-4 rounded-lg bg-white border border-gray-100 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <div className="p-2 bg-primary-100 text-primary-700 rounded-lg mr-4">
                        <FileText size={24} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h3>
                          {getStatusBadge(doc.status)}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>{doc.type}</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => toggleStar(doc.id)} className="p-1.5 rounded hover:bg-slate-100">
                          <Star size={16} className={doc.starred ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
                        </button>
                        <Button variant="ghost" size="sm" className="p-2" onClick={() => handleDownload(doc)}><Download size={16} /></Button>
                        <Button variant="ghost" size="sm" className="p-2 text-error-500" onClick={() => handleDelete(doc.id)}><Trash2 size={16} /></Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* 2. 100% FULL SCREEN LIVE PREVIEW MODAL OVERLAY */}
      {isFullScreen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 md:p-6 animate-fade-in">
          <div className="bg-white w-full h-full max-w-6xl rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
            
            {/* Modal Header bar */}
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-400" size={22} />
                <div>
                  <h2 className="text-base font-bold truncate max-w-md">{selectedDoc.name}</h2>
                  <p className="text-xs text-gray-400">Chamber Status: {selectedDoc.status}</p>
                </div>
              </div>
              <button 
                onClick={() => { setIsFullScreen(false); setSelectedDoc(null); }} 
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Split Screen Modal Body Content */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 overflow-hidden bg-slate-100">
              
              {/* Left Viewer Panel (Takes 3 columns for absolute screenshot replication layout) */}
              <div className="lg:col-span-3 p-4 flex justify-center items-start overflow-auto relative bg-slate-800">
                
                {/* Screenshot Exact Floating Controls stack */}
                <div className="absolute right-4 top-6 z-30 flex flex-col bg-black/85 text-white rounded-xl p-2 shadow-xl space-y-3 items-center border border-white/10">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold">{currentPage}</span>
                    <span className="w-4 h-[1px] bg-white/30 my-0.5"></span>
                    <span className="text-[10px] text-gray-400">4</span>
                  </div>
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="p-1 hover:bg-white/20 rounded text-white"><ChevronUp size={14} /></button>
                  <button onClick={() => setCurrentPage(p => Math.min(4, p + 1))} className="p-1 hover:bg-white/20 rounded text-white"><ChevronDown size={14} /></button>
                  <button onClick={() => setZoomScale(z => Math.min(160, z + 10))} className="p-1 hover:bg-white/20 rounded text-white"><ZoomIn size={14} /></button>
                  <button onClick={() => setZoomScale(z => Math.max(60, z - 10))} className="p-1 hover:bg-white/20 rounded text-white"><ZoomOut size={14} /></button>
                </div>

                {/* Real-time Renderer Box Viewport */}
                <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-2xl flex justify-center items-start p-2">
                  {selectedDoc.fileUrl ? (
                    <div style={{ transform: `scale(${zoomScale / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s' }} className="w-full h-full">
                      <iframe src={selectedDoc.fileUrl} title="Full screen Viewer Monitor" className="w-full h-full border-0 min-h-[70vh]" />
                    </div>
                  ) : (
                    <div className="p-12 text-center text-gray-400 italic flex flex-col justify-center items-center h-full w-full space-y-3">
                      <FileText size={48} className="text-gray-300 animate-pulse" />
                      <p className="font-bold text-gray-700 not-italic">Simulated Frame Content</p>
                      <p className="text-xs max-w-sm">Please upload a local file to enjoy the absolute real-time fullscreen dashboard stream.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side Signature Action Controls Panel */}
              <div className="lg:col-span-1 bg-white p-6 border-l border-gray-200 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Sign Chamber Protocol</h3>
                    <p className="text-xs text-gray-500 mt-1">Review the documentation and authorize using the digital pad below.</p>
                  </div>

                  {/* Active Signature Drawer Pad Logic */}
                  {isSigning ? (
                    <div className="space-y-3 p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-center animate-slide-in">
                      <span className="text-xs font-semibold text-primary-900 block">Draw Signature Workspace</span>
                      <div className="bg-white rounded-lg border border-blue-200 overflow-hidden shadow-inner">
                        <canvas 
                          ref={canvasRef} width={240} height={140}
                          onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                          className="cursor-crosshair w-full bg-white block"
                        />
                      </div>
                      <div className="flex gap-2 justify-center pt-1">
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => setIsSigning(false)}>Cancel</Button>
                        <Button size="sm" variant="outline" className="text-xs text-primary-700" onClick={clearSignature}>Clear</Button>
                        <Button size="sm" className="text-xs bg-success-500 text-white" onClick={saveSignature}>Save & Apply</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedDoc.status !== 'Signed' ? (
                        <Button 
                          leftIcon={<PenTool size={16} />} 
                          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-xl font-medium text-sm transition-all shadow-md"
                          onClick={() => setIsSigning(true)}
                        >
                          Sign Document
                        </Button>
                      ) : (
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
                          <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                            <CheckCircle2 size={14} className="text-emerald-500" /> Document Certified
                          </span>
                          {selectedDoc.signature && selectedDoc.signature !== 'initial-mock' ? (
                            <img src={selectedDoc.signature} alt="Sign" className="max-h-16 mx-auto object-contain bg-white p-1 rounded border border-emerald-100" />
                          ) : (
                            <div className="font-serif italic font-bold text-emerald-900 text-sm py-1 bg-white border border-dashed border-emerald-300 rounded">
                              Authorized Signature
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Footer Actions inside Full Screen Panel */}
                <div className="pt-6 border-t border-gray-100 flex flex-col gap-2">
                  <Button variant="outline" className="w-full text-xs" leftIcon={<Download size={14} />} onClick={() => handleDownload(selectedDoc)}>
                    Download Document
                  </Button>
                  <Button variant="ghost" className="w-full text-xs text-gray-500" onClick={() => { setIsFullScreen(false); setSelectedDoc(null); }}>
                    Back to Dashboard
                  </Button>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};