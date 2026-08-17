import React from 'react';
import CalendarView from '../components/CalendarView';

export default function CalendarPage() {
  const [events, setEvents] = React.useState(() => {
    const defaultEvents = [
      { date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), title: 'Math Assignment Due' },
      { date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), title: 'Physics Midterm' },
    ];
    const stored = JSON.parse(localStorage.getItem('student_events') || '[]');
    return [...defaultEvents, ...stored];
  });

  React.useEffect(() => {
    function handleStorage() {
      const defaultEvents = [
        { date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), title: 'Math Assignment Due' },
        { date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), title: 'Physics Midterm' },
      ];
      const stored = JSON.parse(localStorage.getItem('student_events') || '[]');
      setEvents([...defaultEvents, ...stored]);
    }
    window.addEventListener('storage', handleStorage);
    window.addEventListener('new_event', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('new_event', handleStorage);
    }
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">My Calendar</h1>
        <p className="text-slate-400">Track your assignments, tests, and important dates.</p>
      </div>
      <CalendarView events={events} />
    </div>
  );
}
