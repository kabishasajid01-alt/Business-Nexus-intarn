import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Send, Smile, MessageCircle, Info, Phone, Video, Mic, MicOff, 
  VideoOff, PhoneOff, Volume2, VolumeX, Grid, UserPlus, 
  ScreenShare, Radio, Square, Download
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ChatMessage } from '../../components/chat/ChatMessage';
import { ChatUserList } from '../../components/chat/ChatUserList';
import { useAuth } from '../../context/AuthContext';
import { Message } from '../../types';
import { findUserById } from '../../data/users';
import { getMessagesBetweenUsers, sendMessage, getConversationsForUser } from '../../data/messages';

export const ChatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // --- CALLING STATES ---
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null);
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'connected' | 'incoming'>('idle');
  
  // Hardware/UI Controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isScreenSwapped, setIsScreenSwapped] = useState(false);

  // Timer Control
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Recording & Real Camera Stream Elements
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mockStreamRef = useRef<MediaStream | null>(null);
  
  // REAL CAMERA LIVE TRACKING REFERENCES
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const chatPartner = userId ? findUserById(userId) : null;

  // Syncing active databases
  useEffect(() => {
    if (currentUser) {
      setConversations(getConversationsForUser(currentUser.id));
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && userId) {
      setMessages(getMessagesBetweenUsers(currentUser.id, userId));
    }
  }, [currentUser, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Hook to instantly attach stream whenever video tags toggle on screen
  useEffect(() => {
    if (localStream && localVideoRef.current && !isVideoOff) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, callStatus, isScreenSwapped, isVideoOff]);

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callStatus]);

  const formatTimer = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60).toString().padStart(2, '0');
    const s = (totalSecs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- MATRIX SIMULATORS ---
  const triggerInboundMock = (type: 'voice' | 'video') => {
    setCallType(type);
    setCallStatus('incoming');
  };

  const triggerOutboundMock = async (type: 'voice' | 'video') => {
    setCallType(type);
    setCallStatus('connected');
    if (type === 'video') {
      setTimeout(() => { safelyStartCamera(); }, 150);
    }
  };

  const handleAcceptCall = () => {
    setCallStatus('connected');
    if (callType === 'video') {
      setTimeout(() => { safelyStartCamera(); }, 150);
    }
  };

  const handleEndOrDecline = () => {
    safelyStopCameraAndRecording();
    setCallType(null);
    setCallStatus('idle');
    setIsScreenSwapped(false);
    setIsScreenSharing(false);
  };

  // --- REAL CAMERA ENGINE ENGINE ---
  const safelyStartCamera = async () => {
    try {
      // Browser permissions request for real hardware
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mockStreamRef.current = stream;
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Built-in Recording Node initialization
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      mediaRecorder.onstop = () => { setRecordedChunks([new Blob(chunks, { type: 'video/webm' })]); };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) {
      console.error("Camera Hardware Access Denied or Missing:", e);
      alert("Please allow Camera and Mic permission to start real-time video feed!");
    }
  };

  const safelyStopCameraAndRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try { mediaRecorderRef.current.stop(); } catch (e) {}
    }
    if (mockStreamRef.current) {
      mockStreamRef.current.getTracks().forEach(t => t.stop());
    }
    if (localStream) {
      localStream.getTracks().forEach(t => t.stop());
    }
    setLocalStream(null);
    setIsRecording(false);
  };

  const triggerDownload = () => {
    if (recordedChunks.length === 0) return;
    const url = URL.createObjectURL(recordedChunks[0]);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-meeting-tape-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !userId) return;

    const message = sendMessage({
      senderId: currentUser.id,
      receiverId: userId,
      content: newMessage
    });

    setMessages([...messages, message]);
    setNewMessage('');
    setConversations(getConversationsForUser(currentUser.id));
  };

  if (!currentUser) return null;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white border border-gray-200 rounded-lg overflow-hidden relative">
      
      {/* LEFT SIDEBAR LIST */}
      {callStatus === 'idle' && (
        <div className="hidden md:block w-1/3 lg:w-1/4 border-r border-gray-200 h-full overflow-hidden">
          <ChatUserList conversations={conversations} />
        </div>
      )}

      {/* WORKSPACE AREA */}
      <div className="flex-1 flex flex-col relative bg-slate-50 overflow-hidden h-full">
        
        {/* MATRIX TESTING TOP BAR */}
        {callStatus === 'idle' && chatPartner && (
          <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs font-mono tracking-tight z-10">
            <span>🔧 LOCAL CALL MATRIX TESTING:</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => triggerInboundMock('voice')} className="bg-emerald-600 hover:bg-emerald-500 px-2 py-1 rounded font-bold transition-all">↓ Inbound Voice</button>
              <button type="button" onClick={() => triggerInboundMock('video')} className="bg-indigo-600 hover:bg-indigo-500 px-2 py-1 rounded font-bold transition-all">↓ Inbound Video</button>
            </div>
          </div>
        )}

        {/* 1. STANDARD IDLE CHAT VIEW */}
        {callStatus === 'idle' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
            {chatPartner ? (
              <>
                <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-white shadow-sm">
                  <div className="flex items-center">
                    <Avatar
                      src={chatPartner.avatarUrl}
                      alt={chatPartner.name}
                      size="md"
                      status={chatPartner.isOnline ? 'online' : 'offline'}
                      className="mr-3"
                    />
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">{chatPartner.name}</h2>
                      <p className="text-sm text-gray-500">
                        {chatPartner.isOnline ? 'Online' : 'Last seen recently'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button 
                      type="button"
                      onClick={() => triggerOutboundMock('voice')}
                      className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <Phone size={20} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => triggerOutboundMock('video')}
                      className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <Video size={20} />
                    </button>
                    <div className="w-px h-6 bg-gray-200 mx-1" />
                    <Button variant="ghost" size="sm" className="rounded-full p-2">
                      <Info size={18} />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <ChatMessage
                          key={message.id}
                          message={message}
                          isCurrentUser={message.senderId === currentUser.id}
                        />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <MessageCircle size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700">No messages yet</h3>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 p-4 bg-white">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Button type="button" variant="ghost" size="sm" className="rounded-full p-2">
                      <Smile size={20} />
                    </Button>
                    <Input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      fullWidth
                      className="flex-1"
                    />
                    <Button type="submit" size="sm" disabled={!newMessage.trim()} className="rounded-full p-2 w-10 h-10 flex items-center justify-center">
                      <Send size={18} />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-4">
                <h2 className="text-xl font-medium text-gray-700">Select a conversation</h2>
              </div>
            )}
          </div>
        )}

        {/* 2. INCOMING DIALOGUE MODAL MODIFIER */}
        {callStatus === 'incoming' && chatPartner && (
          <div className="absolute inset-0 bg-slate-950/90 z-50 flex flex-col items-center justify-center animate-fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-6 border border-slate-100">
              <img src={chatPartner.avatarUrl} alt={chatPartner.name} className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-blue-500 shadow-xl" />
              <div>
                <h3 className="text-xl font-bold text-slate-800">{chatPartner.name}</h3>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-1">Incoming {callType} Call...</p>
              </div>
              <div className="flex justify-center gap-6">
                <button type="button" onClick={handleEndOrDecline} className="bg-rose-600 p-4 rounded-full text-white shadow-lg"><PhoneOff size={24} /></button>
                <button type="button" onClick={handleAcceptCall} className="bg-emerald-600 p-4 rounded-full text-white shadow-lg"><Phone size={24} /></button>
              </div>
            </div>
          </div>
        )}

        {/* 3. AUDIO INTERACTION VIEWFRAME LAYOUT (image_2e4919.png) */}
        {callType === 'voice' && callStatus === 'connected' && chatPartner && (
          <div className="flex-1 bg-[#f4f6fa] flex h-full w-full animate-fade-in">
            <div className="flex-1 flex flex-col items-center justify-center p-6 border-r border-gray-200">
              <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm border border-gray-200/60 p-8 flex flex-col items-center justify-between min-h-[540px]">
                <div className="bg-[#edf2ff] text-[#3b5bdb] font-bold text-xs px-5 py-1.5 rounded-full">IN CALL — {formatTimer(seconds)}</div>
                <div className="relative w-36 h-36 rounded-full shadow-md overflow-hidden my-4">
                  <img src={chatPartner.avatarUrl} alt={chatPartner.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center space-y-1.5">
                  <h2 className="text-2xl font-extrabold text-slate-900">{chatPartner.name}</h2>
                  <p className="text-xs text-gray-500 font-medium">Senior Investment Partner • Global Equity</p>
                </div>
                <div className="flex items-center justify-center gap-5 w-full border-t border-slate-100 pt-6">
                  <button type="button" onClick={() => setIsMuted(!isMuted)} className={`p-3.5 rounded-full border ${isMuted ? 'bg-amber-100 text-amber-700' : 'bg-slate-100'}`}><MicOff size={16} /></button>
                  <button type="button" onClick={handleEndOrDecline} className="p-4.5 rounded-full bg-rose-600 text-white shadow-xl shadow-rose-600/20"><PhoneOff size={22} /></button>
                  <button type="button" onClick={() => setIsSpeakerOn(!isSpeakerOn)} className={`p-3.5 rounded-full border ${isSpeakerOn ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}><Volume2 size={16} /></button>
                </div>
              </div>
            </div>
            <div className="w-80 bg-white border-l border-gray-200 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Live Notes</h4>
              <div className="bg-blue-50/50 border-l-4 border-blue-600 p-3 rounded-r-xl"><h5 className="text-xs font-bold text-slate-800">Q3 Series B Round</h5></div>
            </div>
          </div>
        )}

        {/* 4. IMMERSIVE VIDEO CALL WITH ACTUAL RUNNING LAPTOP CAMERA (image_2e497f.jpg) */}
        {callType === 'video' && callStatus === 'connected' && chatPartner && (
          <div className="flex-1 flex h-full w-full bg-slate-950 animate-fade-in">
            
            {/* LEFT STREAM AREA WINDOW */}
            <div className="flex-1 relative flex flex-col justify-between bg-slate-900 border-r border-slate-800">
              
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <div className="bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-white text-[11px] font-bold">{chatPartner.name}</div>
                {isRecording && <div className="bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg animate-pulse"><Radio size={12} /> RECORDING</div>}
                {recordedChunks.length > 0 && !isRecording && <button type="button" onClick={triggerDownload} className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg"><Download size={12} /> Save Recording</button>}
              </div>

              {/* Central Frame Viewport Container */}
              <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden">
                {!isScreenSwapped ? (
                  // Normal Viewport State: Remote contact profile full-screen
                  <div className="w-full h-full relative">
                    <img src={chatPartner.avatarUrl} alt="Remote Feeds" className="w-full h-full object-cover filter brightness-90" />
                  </div>
                ) : (
                  // Swapped Viewport State: YOUR OWN REAL LIFE WEBRTC VIDEO ELEMENT (FULL SCREEN)
                  <div className="w-full h-full bg-black relative flex items-center justify-center">
                    {isVideoOff ? (
                      <VideoOff size={44} className="text-slate-600" />
                    ) : (
                      <video 
                        ref={localVideoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover transform scale-x-[-1]" 
                      />
                    )}
                  </div>
                )}

                {/* Corner PIP Thumbnail (Clicking triggers Layout Stream Swap) */}
                <div 
                  onClick={() => setIsScreenSwapped(!isScreenSwapped)}
                  className="absolute bottom-4 right-4 w-40 h-28 bg-slate-900 border-2 border-blue-500 rounded-xl overflow-hidden shadow-2xl cursor-pointer hover:scale-105 transition-transform z-30"
                  title="Switch Views"
                >
                  {isScreenSwapped ? (
                    <img src={chatPartner.avatarUrl} alt="Mini Investor" className="w-full h-full object-cover" />
                  ) : (
                    // YOUR OWN REAL LIFE WEBRTC VIDEO ELEMENT (MINI WINDOW WINDOW BOX)
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 relative">
                      {isVideoOff ? (
                        <VideoOff size={18} className="text-slate-500" />
                      ) : (
                        <video 
                          ref={localVideoRef} 
                          autoPlay 
                          playsInline 
                          muted 
                          className="w-full h-full object-cover transform scale-x-[-1]" 
                        />
                      )}
                    </div>
                  )}
                  <span className="absolute bottom-1 right-2 bg-black/60 px-1.5 py-0.5 rounded text-[9px] text-white font-mono z-10">
                    {!isScreenSwapped ? 'You' : 'Remote'}
                  </span>
                </div>
              </div>

              {/* Bottom Toolbar Control Rails */}
              <div className="p-4 bg-slate-950 border-t border-slate-900 flex items-center justify-center gap-4 z-20">
                <button type="button" onClick={() => setIsVideoOff(!isVideoOff)} className={`p-3 rounded-xl ${isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                  {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
                </button>
                <button type="button" onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-xl ${isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                  {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button type="button" onClick={() => setIsScreenSharing(!isScreenSharing)} className={`p-3 rounded-xl ${isScreenSharing ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                  <ScreenShare size={18} />
                </button>
                <div className="w-px h-6 bg-slate-800" />
                <button type="button" onClick={handleEndOrDecline} className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
                  <PhoneOff size={14} /> End Interaction
                </button>
              </div>
            </div>

            {/* RIGHT SPLIT SIDE CHAT PANE PANEL */}
            <div className="w-85 flex flex-col bg-white h-full border-l border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-slate-50">
                <Avatar src={chatPartner.avatarUrl} size="sm" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{chatPartner.name}</h4>
                  <p className="text-[10px] text-emerald-600 font-extrabold uppercase">INVESTOR • PLATFORM</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} isCurrentUser={message.senderId === currentUser.id} />
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-slate-50 flex gap-2">
                <input 
                  type="text" 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)} 
                  placeholder="Send a private text note..." 
                  className="flex-1 bg-white text-xs px-3 py-2.5 rounded-xl border border-gray-300 text-slate-800" 
                />
                <button type="submit" className="bg-blue-600 text-white p-2.5 rounded-xl"><Send size={14} /></button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
