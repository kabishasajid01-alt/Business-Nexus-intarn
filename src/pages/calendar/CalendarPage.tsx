import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, Sparkles, 
  TrendingUp, Users, DollarSign, Clock,
  Sun, Calendar as CalendarIcon, Moon, Globe
} from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24-hour format format text style e.g., "10:00")
  type: 'blue' | 'green' | 'brown';
}

interface SlotItem {
  id: string;
  startTime: string;
  endTime: string;
  recurring: string;
  days: string[];
}

export const CalendarPage: React.FC = () => {
  // --- STATES ---
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); // Live Real-time Date
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  
  const [events, setEvents] = useState<EventItem[]>([
    { id: '1', title: 'Pitch Review: EcoScale', date: '2026-07-08', time: '10:00', type: 'blue' },
    { id: '2', title: 'Team Sync', date: '2026-07-09', time: '12:00', type: 'green' },
    { id: '3', title: 'Investor Coffee', date: '2026-07-10', time: '09:00', type: 'brown' },
  ]);

  const [slots, setSlots] = useState<SlotItem[]>([
    { id: '1', startTime: '09:00 AM', endTime: '12:00 PM', recurring: 'Daily • Mon-Fri', days: ['M', 'T', 'W', 'T', 'F'] },
    { id: '2', startTime: '02:00 PM', endTime: '05:00 PM', recurring: 'Weekly • Tue, Thu', days: ['T', 'T'] },
    { id: '3', startTime: '07:00 PM', endTime: '09:00 PM', recurring: 'Custom • Jul 24 - Jul 28', days: ['W', 'T', 'F'] }
  ]);

  const [slotStart, setSlotStart] = useState('09:00 AM');
  const [slotEnd, setSlotEnd] = useState('05:00 PM');
  const [slotRecurring, setSlotRecurring] = useState('Weekly (Mon-Fri)');
  const [selectedDays, setSelectedDays] = useState<string[]>(['M', 'T', 'W', 'T', 'F']);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', type: 'blue' as const });

  // --- TOP COUNTERS SYNC ---
  const totalMeetings = events.length + 21; 
  const totalHours = (slots.length * 3.5).toFixed(1);

  // --- DYNAMIC CALENDAR CALCULATIONS ---
  const handlePrev = () => {
    const prev = new Date(currentDate);
    if (viewMode === 'month') prev.setMonth(prev.getMonth() - 1);
    else if (viewMode === 'week') prev.setDate(prev.getDate() - 7);
    else prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') next.setMonth(next.getMonth() + 1);
    else if (viewMode === 'week') next.setDate(next.getDate() + 7);
    else next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  // Helper: Get array of 7 days for current week view
  const getWeekDays = () => {
    const current = new Date(currentDate);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(current.setDate(diff));
    
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  // Helper: Get array of all days in current month view
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Day of week for first day (0 = Sunday, adjust to 1 = Monday)
    let startDay = firstDayOfMonth.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    const daysArray: (Date | null)[] = Array(startDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(new Date(year, month, i));
    }
    return daysArray;
  };

  // --- EVENT ACTION FOR FORM ---
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;
    
    const savedItem: EventItem = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date, // Form inputs send format standard YYYY-MM-DD
      time: newEvent.time,
      type: newEvent.type
    };

    setEvents([...events, savedItem]);
    setIsEventModalOpen(false);
    setNewEvent({ title: '', date: '', time: '', type: 'blue' });
  };

  const handleCreateSlot = () => {
    setSlots([...slots, { id: Date.now().toString(), startTime: slotStart, endTime: slotEnd, recurring: slotRecurring, days: selectedDays }]);
  };

  const toggleDaySelection = (day: string) => {
    if (selectedDays.includes(day)) setSelectedDays(selectedDays.filter(d => d !== day));
    else setSelectedDays([...selectedDays, day]);
  };

  const formatHeaderDate = () => {
    if (viewMode === 'month') {
      return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    } else if (viewMode === 'week') {
      const weeks = getWeekDays();
      return `${weeks[0].toLocaleString('default', { month: 'long' })} ${weeks[0].getDate()} – ${weeks[6].getDate()}, ${currentDate.getFullYear()}`;
    } else {
      return currentDate.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  const timeSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen text-gray-800">
      
      {/* 1. TOP CARDS STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Confirmed Meetings</p>
            <h3 className="text-3xl font-bold text-gray-900">{totalMeetings}</h3>
            <p className="text-xs text-green-600 font-medium">+8% vs last month</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Sparkles size={22} /></div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Requests</p>
            <h3 className="text-3xl font-bold text-gray-900">5</h3>
            <p className="text-xs text-amber-600 font-medium">Required action</p>
          </div>
          <div className="p-3 bg-teal-50 rounded-xl text-teal-600"><TrendingUp size={22} /></div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Investor Connections</p>
            <h3 className="text-3xl font-bold text-gray-900">136</h3>
            <p className="text-xs text-purple-600 font-medium">+12 new this month</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><Users size={22} /></div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Hours Scheduled</p>
            <h3 className="text-3xl font-bold text-gray-900">{totalHours}h</h3>
            <p className="text-xs text-gray-400">Calculated from live slots</p>
          </div>
          <div className="p-3 bg-green-500 rounded-xl text-white"><DollarSign size={22} /></div>
        </div>
      </div>

      {/* 2. CALENDAR CORE MIDDLE AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* VIEW CONTROLLER AREA */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 flex flex-col sm:flex-row justify-between items-center border-b border-gray-100 gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-sm md:text-base font-bold text-gray-900 min-w-[150px]">{formatHeaderDate()}</h2>
              <div className="flex border rounded-lg overflow-hidden bg-gray-50">
                <button onClick={handlePrev} className="p-1.5 hover:bg-gray-100 border-r"><ChevronLeft size={16} /></button>
                <button onClick={handleNext} className="p-1.5 hover:bg-gray-100"><ChevronRight size={16} /></button>
              </div>
              <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-xs border rounded-lg bg-white shadow-xs font-medium hover:bg-gray-50">Today</button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-1 rounded-xl flex gap-1 text-xs font-semibold text-gray-600">
                {(['day', 'week', 'month'] as const).map((m) => (
                  <button 
                    key={m} onClick={() => setViewMode(m)}
                    className={`px-4 py-1.5 capitalize rounded-lg ${viewMode === m ? 'bg-white text-gray-900 shadow-xs' : 'hover:text-gray-900'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              
              <button onClick={() => setIsEventModalOpen(true)} className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 hover:bg-blue-700">
                <Plus size={14} /> Add Event
              </button>
            </div>
          </div>

          {/* DYNAMIC RENDERING BOXES ACCORDING TO BUTTON MODE BUTTON SWITCH CLICK */}
          <div className="overflow-x-auto p-4">
            
            {/* MONTH VIEW FORMAT */}
            {viewMode === 'month' && (
              <div className="min-w-[600px]">
                <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs bg-gray-50 p-2 text-gray-500 rounded-t-xl">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1 border-l border-b border-gray-100 bg-gray-100/40 rounded-b-xl">
                  {getMonthDays().map((day, idx) => {
                    const dayStr = day ? day.toISOString().split('T')[0] : '';
                    const dayEvents = day ? events.filter(e => e.date === dayStr) : [];
                    return (
                      <div key={idx} className="bg-white min-h-[100px] p-2 border-r border-t border-gray-100 relative">
                        {day && (
                          <>
                            <span className={`text-xs font-bold ${day.toDateString() === new Date().toDateString() ? 'bg-blue-600 text-white w-5 h-5 inline-block text-center leading-5 rounded-full' : 'text-gray-700'}`}>{day.getDate()}</span>
                            <div className="mt-1 space-y-1">
                              {dayEvents.map(e => (
                                <div key={e.id} className={`text-[10px] p-1 rounded text-white font-medium truncate ${e.type === 'green' ? 'bg-emerald-600' : e.type === 'brown' ? 'bg-amber-800' : 'bg-blue-600'}`}>
                                  {e.title}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WEEK VIEW FORMAT */}
            {viewMode === 'week' && (
              <table className="w-full min-w-[600px] border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/70 border-b text-gray-500 font-semibold">
                    <th className="p-3 w-20 border-r"></th>
                    {getWeekDays().map((d, idx) => (
                      <th key={idx} className="p-2 text-center border-r">
                        <div className="uppercase text-[10px] tracking-wider text-gray-400">{d.toLocaleString('default', { weekday: 'short' })}</div>
                        <div className={`text-sm font-bold mt-0.5 inline-block w-6 h-6 leading-6 rounded-full ${d.toDateString() === new Date().toDateString() ? 'bg-blue-600 text-white' : 'text-gray-800'}`}>{d.getDate()}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {timeSlots.map((timeSlot) => (
                    <tr key={timeSlot} className="h-16 hover:bg-gray-50/30">
                      <td className="p-2 font-medium border-r text-gray-400 align-top">{timeSlot}</td>
                      {getWeekDays().map((day) => {
                        const dayStr = day.toISOString().split('T')[0];
                        const slotHour = timeSlot.substring(0, 2);
                        const cellEvents = events.filter(e => e.date === dayStr && e.time.startsWith(slotHour));
                        return (
                          <td key={day.toString()} className="border-r p-1 align-top relative min-w-[90px]">
                            {cellEvents.map(ev => (
                              <div key={ev.id} className={`p-1.5 rounded-lg text-white font-medium text-[10px] truncate ${ev.type === 'green' ? 'bg-emerald-600' : ev.type === 'brown' ? 'bg-amber-800' : 'bg-blue-600'}`}>
                                <strong>{ev.title}</strong>
                              </div>
                            ))}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* DAY VIEW FORMAT */}
            {viewMode === 'day' && (
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 p-2 text-gray-600 font-bold border-b">
                    <th className="p-2 w-20 border-r text-left">Time</th>
                    <th className="p-2 text-left pl-4">Scheduled Focus Events</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {timeSlots.map((timeSlot) => {
                    const dayStr = currentDate.toISOString().split('T')[0];
                    const slotHour = timeSlot.substring(0, 2);
                    const dayCellEvents = events.filter(e => e.date === dayStr && e.time.startsWith(slotHour));
                    return (
                      <tr key={timeSlot} className="h-14 hover:bg-gray-50/50">
                        <td className="p-2 border-r font-medium text-gray-400">{timeSlot}</td>
                        <td className="p-2 pl-4">
                          {dayCellEvents.map(ev => (
                            <div key={ev.id} className={`p-2 rounded-xl text-white max-w-md font-semibold text-[11px] ${ev.type === 'green' ? 'bg-emerald-600' : ev.type === 'brown' ? 'bg-amber-800' : 'bg-blue-600'}`}>
                              {ev.title} ({ev.time})
                            </div>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

          </div>
        </div>

        {/* 3. RIGHT MINI PANEL SIDEBAR PANEL LIST CONTAINER */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-900">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center text-[11px] font-medium">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((m, i) => <div key={i} className="text-gray-400">{m}</div>)}
              {Array.from({ length: 28 }).map((_, idx) => (
                <div key={idx} className={`p-1.5 rounded-full ${idx + 1 === currentDate.getDate() ? 'bg-blue-600 text-white font-bold' : 'text-gray-700'}`}>
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">My Calendars</h4>
            <div className="space-y-2 text-xs font-semibold text-gray-700">
              <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="rounded text-blue-600 w-4 h-4" /> <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span> My Calendar</label>
              <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="rounded text-emerald-600 w-4 h-4" /> <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span> Team Syncs</label>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-center"><h4 className="text-sm font-bold text-gray-900">Upcoming</h4><span className="text-xs text-blue-600 font-bold">View All</span></div>
            <div className="space-y-3">
              {events.slice(0, 3).map((ev) => (
                <div key={ev.id} className="flex border rounded-xl p-3 items-center gap-3 bg-slate-50/50">
                  <div className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-center font-bold text-xs">
                    <div>{ev.date.split('-')[2]}</div>
                  </div>
                  <div className="text-xs truncate">
                    <p className="font-bold text-gray-900 truncate">{ev.title}</p>
                    <p className="text-gray-400 mt-0.5">{ev.time} • Zoom</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 4. BOTTOM ACTION SLOTS PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 text-gray-900">
            <Clock className="text-blue-600" size={20} />
            <h3 className="font-bold text-base">Set Your Schedule</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <label className="text-gray-500 block mb-1">Start Time</label>
              <input type="text" value={slotStart} onChange={(e) => setSlotStart(e.target.value)} className="w-full bg-gray-50 border p-2.5 rounded-xl text-center" />
            </div>
            <div>
              <label className="text-gray-500 block mb-1">End Time</label>
              <input type="text" value={slotEnd} onChange={(e) => setSlotEnd(e.target.value)} className="w-full bg-gray-50 border p-2.5 rounded-xl text-center" />
            </div>
          </div>

          <div className="text-xs font-semibold">
            <label className="text-gray-500 block mb-1">Recurring Type</label>
            <select value={slotRecurring} onChange={(e) => setSlotRecurring(e.target.value)} className="w-full bg-gray-50 border p-2.5 rounded-xl">
              <option>Weekly (Mon-Fri)</option>
              <option>Daily</option>
            </select>
          </div>

          <button onClick={handleCreateSlot} className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl text-xs shadow-sm">
            Create Availability
          </button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-sm text-gray-900">Your Current Slots</h3>
          <div className="space-y-3">
            {slots.map((slot) => (
              <div key={slot.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Sun size={18}/></div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{slot.startTime} - {slot.endTime}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{slot.recurring}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold border-b pb-2">
              <div className="flex items-center gap-2 text-gray-900"><Globe size={16} className="text-blue-600"/> Timezone & Holidays</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[11px] text-gray-400">
              <div>Current Timezone: <strong className="text-gray-800 block mt-0.5">America/Chicago (CST)</strong></div>
              <div>Holiday Sync: <strong className="text-emerald-600 block mt-0.5">US Public Holidays Active</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL INPUT POPUP */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full mx-4 border">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Add New Calendar Event</h3>
            <form onSubmit={handleAddEvent} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-gray-500 mb-1">Meeting/Event Title</label>
                <input type="text" required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full border p-2.5 rounded-xl" placeholder="e.g. EcoScale Investor Call" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 mb-1">Date</label>
                  <input type="date" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full border p-2.5 rounded-xl" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Start Hour</label>
                  <input type="time" required value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="w-full border p-2.5 rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Color Tag Category</label>
                <select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value as any})} className="w-full border p-2.5 rounded-xl bg-white">
                  <option value="blue">Blue (My Calendar)</option>
                  <option value="green">Green (Team Syncs)</option>
                  <option value="brown">Brown (Holidays)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsEventModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};