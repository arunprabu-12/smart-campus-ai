import React, { useState } from 'react';

export default function CalendarView({ events = [], storageKey = 'student_events' }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (newEventTitle.trim() && selectedDate) {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      stored.push({ date: selectedDate.toISOString(), title: newEventTitle });
      localStorage.setItem(storageKey, JSON.stringify(stored));
      window.dispatchEvent(new Event('new_event'));
      setNewEventTitle('');
      setShowModal(false);
    }
  };

  const renderCells = () => {
    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="p-2 border border-slate-700/50 bg-slate-800/20 min-h-[80px]" />);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = new Date().toDateString() === new Date(year, month, i).toDateString();
      const cellDate = new Date(year, month, i);
      const dayEvents = events.filter(e => {
        const ed = new Date(e.date);
        return ed.getDate() === i && ed.getMonth() === month && ed.getFullYear() === year;
      });

      cells.push(
        <div key={i} onClick={() => handleDayClick(cellDate)} className={`p-2 border border-slate-700/50 min-h-[80px] cursor-pointer ${isToday ? 'bg-indigo-900/40' : 'bg-slate-800/40'} transition hover:bg-slate-700/40`}>
          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-indigo-400' : 'text-slate-300'}`}>{i}</div>
          <div className="flex flex-col gap-1">
            {dayEvents.map((evt, idx) => (
              <div key={idx} className="text-xs px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 truncate" title={evt.title}>
                {evt.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return cells;
  };

  const selectedDayEvents = selectedDate 
    ? events.filter(e => {
        const ed = new Date(e.date);
        return ed.getDate() === selectedDate.getDate() && ed.getMonth() === selectedDate.getMonth() && ed.getFullYear() === selectedDate.getFullYear();
      })
    : [];

  return (
    <>
      <div className="w-full bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl relative z-0">
        <div className="flex items-center justify-between p-4 bg-slate-800/50 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            📅 {monthNames[month]} {year}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>◀</button>
            <button onClick={nextMonth} className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▶</button>
          </div>
        </div>
        <div className="grid grid-cols-7 border-b border-slate-700/50 bg-slate-800/30">
          {days.map(d => (
            <div key={d} className="p-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-slate-900">
          {renderCells()}
        </div>
      </div>

      {showModal && selectedDate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <h3 className="text-lg font-bold text-white">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-xl leading-none">&times;</button>
            </div>
            
            <div className="p-5">
              <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Planned Events</h4>
              {selectedDayEvents.length === 0 ? (
                <p className="text-slate-500 text-sm italic mb-4">No plans for this day.</p>
              ) : (
                <ul className="space-y-2 mb-6">
                  {selectedDayEvents.map((evt, idx) => (
                    <li key={idx} className="bg-slate-800/80 p-3 rounded-lg text-slate-200 text-sm border border-slate-700/50 flex items-center gap-2">
                      <span className="text-indigo-400 text-lg">📌</span> {evt.title}
                    </li>
                  ))}
                </ul>
              )}

              <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Add New Plan</h4>
              <form onSubmit={handleAddEvent} className="flex gap-2">
                <input 
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Study Physics..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
                <button type="submit" disabled={!newEventTitle.trim()} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
