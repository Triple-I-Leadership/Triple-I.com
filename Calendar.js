import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const calendarGrid = document.querySelector('.calendar-grid');
const monthYear = document.getElementById('month-year');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const eventDetails = document.getElementById('event-details');

// Supabase client setup
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

let currentDate = new Date();

// Fetch events from Supabase
async function fetchEvents() {
  const { data, error } = await supabase
    .from('events')  // Replace 'events' with your table name
    .select('date, title, description')
    .eq('date', currentDate.toISOString().split('T')[0]); // Optionally filter by date if needed

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return data;
}

// Render calendar grid
async function renderCalendar(date) {
  // Clear the grid except for headers
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

  // Set month-year heading
  monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

  // Get the first and last day of the month
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // Add empty divs for days before the first day
  for (let i = 0; i < firstDay; i++) {
    calendarGrid.innerHTML += `<div class="day"></div>`;
  }

  // Fetch events for the current month
  const events = await fetchEvents();

  // Add day numbers
  for (let day = 1; day <= lastDate; day++) {
    const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.textContent = day;
    dayElement.dataset.date = fullDate;

    // Highlight days with events
    if (events.some(event => event.date === fullDate)) {
      dayElement.classList.add('has-event');
    }

    // Add event listener for day click
    dayElement.addEventListener('click', () => showEvents(fullDate));

    calendarGrid.appendChild(dayElement);
  }
}

// Show events for a selected day
async function showEvents(date) {
  // Fetch events for the selected date
  const events = await fetchEvents();

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

