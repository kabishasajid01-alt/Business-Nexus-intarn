// import React from 'react';
// import { FileText, Upload, Download, Trash2, Share2 } from 'lucide-react';
// import { Card, CardHeader, CardBody } from '../../components/ui/Card';
// import { Button } from '../../components/ui/Button';
// import { Badge } from '../../components/ui/Badge';

// const documents = [
//   {
//     id: 1,
//     name: 'Pitch Deck 2024.pdf',
//     type: 'PDF',
//     size: '2.4 MB',
//     lastModified: '2024-02-15',
//     shared: true
//   },
//   {
//     id: 2,
//     name: 'Financial Projections.xlsx',
//     type: 'Spreadsheet',
//     size: '1.8 MB',
//     lastModified: '2024-02-10',
//     shared: false
//   },
//   {
//     id: 3,
//     name: 'Business Plan.docx',
//     type: 'Document',
//     size: '3.2 MB',
//     lastModified: '2024-02-05',
//     shared: true
//   },
//   {
//     id: 4,
//     name: 'Market Research.pdf',
//     type: 'PDF',
//     size: '5.1 MB',
//     lastModified: '2024-01-28',
//     shared: false
//   }
// ];

// export const DocumentsPage: React.FC = () => {
//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
//           <p className="text-gray-600">Manage your startup's important files</p>
//         </div>
        
//         <Button leftIcon={<Upload size={18} />}>
//           Upload Document
//         </Button>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Storage info */}
//         <Card className="lg:col-span-1">
//           <CardHeader>
//             <h2 className="text-lg font-medium text-gray-900">Storage</h2>
//           </CardHeader>
//           <CardBody className="space-y-4">
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Used</span>
//                 <span className="font-medium text-gray-900">12.5 GB</span>
//               </div>
//               <div className="h-2 bg-gray-200 rounded-full">
//                 <div className="h-2 bg-primary-600 rounded-full" style={{ width: '65%' }}></div>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Available</span>
//                 <span className="font-medium text-gray-900">7.5 GB</span>
//               </div>
//             </div>
            
//             <div className="pt-4 border-t border-gray-200">
//               <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Access</h3>
//               <div className="space-y-2">
//                 <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
//                   Recent Files
//                 </button>
//                 <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
//                   Shared with Me
//                 </button>
//                 <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
//                   Starred
//                 </button>
//                 <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
//                   Trash
//                 </button>
//               </div>
//             </div>
//           </CardBody>
//         </Card>
        
//         {/* Document list */}
//         <div className="lg:col-span-3">
//           <Card>
//             <CardHeader className="flex justify-between items-center">
//               <h2 className="text-lg font-medium text-gray-900">All Documents</h2>
//               <div className="flex items-center gap-2">
//                 <Button variant="outline" size="sm">
//                   Sort by
//                 </Button>
//                 <Button variant="outline" size="sm">
//                   Filter
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardBody>
//               <div className="space-y-2">
//                 {documents.map(doc => (
//                   <div
//                     key={doc.id}
//                     className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                   >
//                     <div className="p-2 bg-primary-50 rounded-lg mr-4">
//                       <FileText size={24} className="text-primary-600" />
//                     </div>
                    
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2">
//                         <h3 className="text-sm font-medium text-gray-900 truncate">
//                           {doc.name}
//                         </h3>
//                         {doc.shared && (
//                           <Badge variant="secondary" size="sm">Shared</Badge>
//                         )}
//                       </div>
                      
//                       <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
//                         <span>{doc.type}</span>
//                         <span>{doc.size}</span>
//                         <span>Modified {doc.lastModified}</span>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-2 ml-4">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-2"
//                         aria-label="Download"
//                       >
//                         <Download size={18} />
//                       </Button>
                      
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-2"
//                         aria-label="Share"
//                       >
//                         <Share2 size={18} />
//                       </Button>
                      
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-2 text-error-600 hover:text-error-700"
//                         aria-label="Delete"
//                       >
//                         <Trash2 size={18} />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardBody>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, Share2, PenTool, CheckCircle2, X, Star } from 'lucide-react';
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
  // Navigation filters state
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
    },
    {
      id: 3,
      name: 'NDA_Partnership_Final.pdf',
      type: 'PDF',
      size: '950 KB',
      lastModified: '2026-07-08',
      shared: true,
      status: 'Signed',
      fileUrl: null,
      signature: 'initial-mock',
      starred: false,
      isDeleted: false
    }
  ]);

  // Selected document for Chamber Preview/Signing
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [isSigning, setIsSigning] = useState<boolean>(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isDrawing = useRef<boolean>(false);

  // 1. ADVANCED FILE UPLOAD (FileReader handles Base64 for 100% Iframe Rendering)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.name.split('.').pop()?.toUpperCase() || 'PDF';
    const fileSizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    const currentDate = new Date().toISOString().split('T')[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;

      const newDoc: DocumentItem = {
        id: Date.now(),
        name: file.name,
        type: fileType,
        size: fileSizeStr,
        lastModified: currentDate,
        shared: false,
        status: 'Draft',
        fileUrl: base64Url, // Storing base64 string ensures rendering inside iframe flawlessly
        signature: null,
        starred: false,
        isDeleted: false
      };

      setDocuments([newDoc, ...documents]);
      setSelectedDoc(newDoc);
      setIsSigning(false);
      setActiveFilter('Recent Files');
    };

    reader.readAsDataURL(file); // Converts file directly to fully readable viewer string
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
      alert(`Downloading simulated secure contract: ${doc.name}`);
    }
  };

  // 3. Delete / Trash Management Feature
  const handleDelete = (id: number) => {
    const updatedDocs = documents.map(doc => {
      if (doc.id === id) {
        if (doc.isDeleted) {
          return null; // Permanent Delete if already in Trash
        }
        return { ...doc, isDeleted: true }; // Move to Trash
      }
      return doc;
    }).filter(Boolean) as DocumentItem[];

    setDocuments(updatedDocs);
    if (selectedDoc?.id === id) {
      setSelectedDoc(null);
      setIsSigning(false);
    }
  };

  // 4. Star Toggle Action
  const toggleStar = (id: number) => {
    setDocuments(documents.map(doc => doc.id === id ? { ...doc, starred: !doc.starred } : doc));
    if (selectedDoc?.id === id) {
      setSelectedDoc(selectedDoc ? { ...selectedDoc, starred: !selectedDoc.starred } : null);
    }
  };

  // 5. Sidebar Tabs / Filter Logic
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

  // Status Labels Handler
  const getStatusBadge = (status: 'Draft' | 'In Review' | 'Signed') => {
    switch (status) {
      case 'Signed': return <Badge variant="success" size="sm">Signed</Badge>;
      case 'In Review': return <Badge variant="warning" size="sm">In Review</Badge>;
      default: return <Badge variant="primary" size="sm">Draft</Badge>;
    }
  };

  // 6. Canvas E-Signature Pad Functionalities
  const getMousePos = (canvas: HTMLCanvasElement, e: React.MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
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

  const stopDrawing = () => {
    isDrawing.current = false;
  };

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

  const updateStatus = (id: number, newStatus: 'Draft' | 'In Review' | 'Signed') => {
    const updatedDocs = documents.map(doc => 
      doc.id === id ? { ...doc, status: newStatus } : doc
    );
    setDocuments(updatedDocs);
    if (selectedDoc && selectedDoc.id === id) {
      setSelectedDoc({ ...selectedDoc, status: newStatus });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept=".pdf,.xlsx,.xls,.docx,.doc" 
      />

      {/* Top Header */}
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
      
      {/* Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Filter Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Storage</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Used</span>
                  <span className="font-medium text-gray-900">12.5 GB</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-2 bg-primary-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available</span>
                  <span className="font-medium text-gray-900">7.5 GB</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Access</h3>
                <div className="space-y-1">
                  {['Recent Files', 'Shared with Me', 'Starred', 'Trash'].map((item) => (
                    <button 
                      key={item} 
                      onClick={() => { setActiveFilter(item); setSelectedDoc(null); setIsSigning(false); }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        activeFilter === item 
                          ? 'bg-blue-100 text-primary-700 font-medium' 
                          : 'text-gray-700 hover:bg-blue-50 hover:text-primary-700'
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
        
        {/* Central Document Registry List Section */}
        <div className={`transition-all duration-300 ${selectedDoc ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <Card>
            <CardHeader className="flex justify-between items-center border-b border-gray-50">
              <h2 className="text-lg font-medium text-gray-900">{activeFilter}</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Sort by</Button>
                <Button variant="outline" size="sm">Filter</Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No contracts or items available inside this workspace section.
                  </div>
                ) : (
                  filteredDocuments.map(doc => (
                    <div
                      key={doc.id}
                      onClick={() => { setSelectedDoc(doc); setIsSigning(false); }}
                      className={`flex items-center p-4 rounded-lg transition-all duration-200 cursor-pointer border ${
                        selectedDoc?.id === doc.id 
                          ? 'bg-blue-50/70 border-primary-300 shadow-sm' 
                          : 'bg-white border-transparent hover:bg-slate-50/80 hover:border-gray-100'
                      }`}
                    >
                      <div className="p-2 bg-primary-100 text-primary-700 rounded-lg mr-4">
                        <FileText size={24} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-medium text-gray-900 truncate max-w-[140px] md:max-w-xs">
                            {doc.name}
                          </h3>
                          {doc.shared && <Badge variant="secondary" size="sm">Shared</Badge>}
                          {getStatusBadge(doc.status)}
                        </div>
                        
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>{doc.type}</span>
                          <span>{doc.size}</span>
                          <span>Modified {doc.lastModified}</span>
                        </div>
                      </div>
                      
                      {/* Active Actions */}
                      <div className="flex items-center gap-1 ml-4" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => toggleStar(doc.id)}
                          className="p-1.5 rounded hover:bg-slate-100 transition-colors"
                          title={doc.starred ? "Unstar" : "Star"}
                        >
                          <Star size={16} className={doc.starred ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
                        </button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2 text-gray-500 hover:text-primary-600" 
                          onClick={() => handleDownload(doc)}
                          title="Download"
                        >
                          <Download size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2 text-error-500 hover:text-error-600" 
                          onClick={() => handleDelete(doc.id)}
                          title={doc.isDeleted ? "Delete Permanently" : "Move to Trash"}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Preview and Signature Pad Processing Section */}
        {selectedDoc && (
          <div className="lg:col-span-1 animate-slide-in">
            <Card className="border-primary-200 shadow-md sticky top-6 bg-white">
              <CardHeader className="flex justify-between items-center bg-blue-50/50 border-b border-blue-100 py-3">
                <span className="text-xs font-bold text-primary-900 tracking-wide uppercase">Chamber Studio</span>
                <button 
                  onClick={() => { setSelectedDoc(null); setIsSigning(false); }} 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </CardHeader>
              <CardBody className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 break-words">{selectedDoc.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Current Status: <span className="font-semibold">{selectedDoc.status}</span></p>
                </div>

                {/* Status Selection Logic */}
                {selectedDoc.status !== 'Signed' && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Update State:</label>
                    <select 
                      value={selectedDoc.status}
                      onChange={(e) => updateStatus(selectedDoc.id, e.target.value as any)}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-400"
                    >
                      <option value="Draft">Draft</option>
                      <option value="In Review">In Review</option>
                    </select>
                  </div>
                )}

                {/* Interactive Dynamic Signature Drawing Studio */}
                {isSigning ? (
                  <div className="space-y-3 p-3 bg-blue-50/50 border border-blue-200 rounded-xl text-center">
                    <span className="text-xs font-semibold text-primary-900 block">Draw E-Signature Pad</span>
                    <div className="bg-white rounded-lg border border-blue-200 overflow-hidden shadow-inner">
                      <canvas 
                        ref={canvasRef}
                        width={220}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="cursor-crosshair w-full bg-white block"
                      />
                    </div>
                    <div className="flex gap-1.5 justify-center">
                      <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-auto" onClick={() => setIsSigning(false)}>Cancel</Button>
                      <Button size="sm" variant="outline" className="text-xs text-primary-700 border-primary-200 px-2 py-1 h-auto" onClick={clearSignature}>Clear</Button>
                      <Button size="sm" className="text-xs bg-success-500 hover:bg-success-600 text-white px-2 py-1 h-auto" onClick={saveSignature}>Apply</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Live Iframe Document View Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner flex flex-col">
                      <span className="text-[10px] bg-slate-200 py-1 text-center font-bold text-slate-600 tracking-wider uppercase block">
                        Live Chamber Monitor
                      </span>
                      {selectedDoc.fileUrl ? (
                        /* Embedded Iframe Render with full Base64 Data Stream Support */
                        <iframe 
                          src={selectedDoc.fileUrl} 
                          title="Document Live Preview Frame" 
                          className="w-full h-64 border-0"
                        />
                      ) : (
                        /* Placeholder UI state for mock initial files */
                        <div className="p-4 text-center text-xs text-gray-400 italic min-h-[140px] flex flex-col justify-center items-center">
                          <p className="font-semibold text-gray-700 not-italic mb-1">Simulated Secure Data</p>
                          <p>Upload a custom contract file to trigger the live monitor frame immediately.</p>
                        </div>
                      )}

                      {/* Display Applied Mockup Signature */}
                      {selectedDoc.status === 'Signed' && (
                        <div className="p-3 bg-white border-t border-slate-200 flex flex-col items-center justify-center">
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle2 size={10} className="text-success-500" /> Digitally Authed
                          </span>
                          {selectedDoc.signature && selectedDoc.signature !== 'initial-mock' ? (
                            <img src={selectedDoc.signature} alt="E-Sign Display" className="max-h-12 mt-1 object-contain bg-white p-1 rounded border border-gray-100" />
                          ) : (
                            <div className="font-serif italic font-bold text-primary-800 text-sm mt-1 border border-dashed border-success-400 bg-success-50/50 px-3 rounded">
                              Authorized Signee
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Launch Pad Action to trigger Drawing Board */}
                    {selectedDoc.status !== 'Signed' && (
                      <Button 
                        leftIcon={<PenTool size={14} />} 
                        className="w-full text-xs py-2 bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
                        onClick={() => setIsSigning(true)}
                      >
                        Sign Document
                      </Button>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
};