import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const calendarGrid = document.querySelector('.calendar-grid');
const monthYear = document.getElementById('month-year');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const eventDetails = document.getElementById('event-details');

// Initialize Supabase client
const supabase = createClient('https://fvypinxntxcpebvrrqpv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg');

// Fetch events from Supabase
async function fetchEvents() {
  const { data: session, error: sessionError } = await supabase.auth.getSession();
  
  console.log('Session data:', session);
  
  if (sessionError) {
    console.error('Error getting session:', sessionError);
    return [];
  }

  const user = session?.session?.user;
  console.log('Logged-in user:', user);
  
  if (!user) {
    console.error('No user logged in');
    return [];
  }

  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return data;
}

async function renderCalendar(date) {
  console.log('Rendering calendar for:', date);
  calendarGrid.innerHTML = `
    <div class="day-header">Sun</div>
    <div class="day-header">Mon</div>
    <div class="day-header">Tue</div>
    <div class="day-header">Wed</div>
    <div class="day-header">Thu</div>
    <div class="day-header">Fri</div>
    <div class="day-header">Sat</div>
  `;

  const year = date.getFullYear();
  const month = date.getMonth();

  monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const events = await fetchEvents();
  console.log('Fetched events:', events);

  for (let i = 0; i < firstDay; i++) {
    calendarGrid.innerHTML += `<div class="day"></div>`;
  }

  for (let day = 1; day <= lastDate; day++) {
    const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.textContent = day;
    dayElement.dataset.date = fullDate;

    if (events.some(event => event.date === fullDate)) {
      dayElement.classList.add('has-event');
      console.log('Highlighting event day:', fullDate);
    }

    dayElement.addEventListener('click', () => showEvents(fullDate, events));
    calendarGrid.appendChild(dayElement);
  }
}


function showEvents(date, events) {
  // Clear the existing events
  eventDetails.innerHTML = '';

  // Filter and display events for the selected date
  const dayEvents = events.filter(event => event.date === date);

  if (dayEvents.length > 0) {
    dayEvents.forEach(event => {
      const li = document.createElement('li');
      li.classList.add('event');
      li.innerHTML = `<strong>${event.title}</strong>: ${event.description}`;
      eventDetails.appendChild(li);
    });
  } else {
    eventDetails.innerHTML = '<li class="event">No events for this day.</li>';
  }
}

// Navigate to previous month
prevButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

// Navigate to next month
nextButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

// Initial render
renderCalendar(currentDate);
