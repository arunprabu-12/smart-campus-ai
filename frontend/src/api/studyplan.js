import apiClient from './client'

export const getTodayPlan = () => apiClient.get('/study-plan/today')
export const getPrecatDashboard = (courseId) => apiClient.get(`/study-plan/precat/${courseId}`)

export const generateStudyPlan = async (studentId, course) => {
  // Mock the Study Plan Agent behavior
  return new Promise((resolve) => {
    setTimeout(() => {
      const plan = [
        { date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), topic: "Topic A (Weak Area)", duration_minutes: 45, priority: "high" },
        { date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), topic: "Topic C (Weak Area)", duration_minutes: 30, priority: "medium" }
      ];

      // Update student's calendar
      const evts = JSON.parse(localStorage.getItem('student_events') || '[]');
      plan.forEach(p => {
        evts.push({ date: p.date, title: `Study: ${p.topic}` });
      });
      localStorage.setItem('student_events', JSON.stringify(evts));
      window.dispatchEvent(new Event('new_event'));

      // Send notification
      const notifs = JSON.parse(localStorage.getItem('student_notifications') || '[]');
      notifs.unshift({ text: `Your new study plan for ${course} is ready! We've added 2 study sessions to your calendar.`, date: new Date().toISOString() });
      localStorage.setItem('student_notifications', JSON.stringify(notifs));
      window.dispatchEvent(new Event('new_notification'));

      resolve({
        data: {
          action: "generate_study_plan",
          status: "success",
          details: {
            student_id: studentId,
            course: course,
            weak_topics: ["Topic A", "Topic C"],
            plan,
            calendar_updated: true,
            email_sent: true
          }
        }
      });
    }, 1500); // Simulate network delay
  });
}
