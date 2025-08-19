const calendarGrid = document.querySelector('.calendar-grid');
const monthYear = document.getElementById('month-year');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const eventDetails = document.getElementById('event-details');

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const supabaseUrl = SUPABASEURL;
const supabaseKey = SUPABASEKEY;
const supabase = createClient(supabaseUrl, supabaseKey);

let currentDate = new Date();
let selectedDate = null;
let events = [];

// ✅ Function to Convert UTC Time to Local
function convertToLocalTime(utcDateTime) {
    const date = new Date(utcDateTime);
    return {
        date: date.toISOString().slice(0, 10), // YYYY-MM-DD format for event matching
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) // Local time
    };
}

async function fetchEvents() {
  const { data, error } = await supabase.from('calendar_events').select('id, event, date, end_date, description, required');

  if (error) {
    console.error('Error fetching events:', error);
    return;
  }

  console.log("Raw Events from DB:", data); // Debugging output

  events = data.map(event => {
    if (!event || !event.date || !event.end_date) {
      console.warn("Skipping invalid event:", event);
      return null;
    }

    const startDateLocal = convertToLocalTime(event.date);
    const endDateLocal = convertToLocalTime(event.end_date);

    return {
      date: startDateLocal.date, 
      title: `${startDateLocal.time} - ${endDateLocal.time}`,
      description: event.description || "No description",
      required: event.required || false // Ensure required flag is accounted for
    };
  }).filter(event => event !== null);

  console.log("Processed Events:", events); // Debugging output

  renderCalendar(currentDate);
}

// ✅ Render Calendar and Highlight Events
function renderCalendar(date) {
  calendarGrid.innerHTML = ` 
    <div class="day-header">Sun</div>
    <div class="day-header">Mon</div>
    <div class="day-header">Tue</div>
    <div class="day-header">Wed</div>
    <div class="day-header">Thu</div>
    <div class="day-header">Fri</div>
    <div class="day-header">Sat</div>`
  ;

  const year = date.getFullYear();
  const month = date.getMonth();
  monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // Add empty divs for padding before first day of month
  for (let i = 0; i < firstDay; i++) {
    calendarGrid.innerHTML += '<div class="day empty"></div>';
  }

  // Add actual day numbers with events
  for (let day = 1; day <= lastDate; day++) {
    const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.textContent = day;
    dayElement.dataset.date = fullDate;

    const dayEvents = events.filter(event => event.date === fullDate);
    if (dayEvents.length > 0) {
      dayElement.classList.add('has-event');
    }

    // Highlight selected date
    if (selectedDate === fullDate) {
      dayElement.classList.add('selected');
    }

    dayElement.addEventListener('click', () => {
      selectedDate = fullDate;
      highlightSelectedDate();
      showEvents(fullDate);
    });

    calendarGrid.appendChild(dayElement);
  }
}

// ✅ Highlight Selected Date
function highlightSelectedDate() {
  document.querySelectorAll('.day.selected').forEach(el => el.classList.remove('selected'));
  const selectedElement = document.querySelector(`.day[data-date='${selectedDate}']`);
  if (selectedElement) {
    selectedElement.classList.add('selected');
  }
}

// ✅ Show Events for Selected Date
function showEvents(date) {
  eventDetails.innerHTML = ''; 
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

// ✅ Navigate Between Months
prevButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

// ✅ Initial Fetch and Render
fetchEvents();
