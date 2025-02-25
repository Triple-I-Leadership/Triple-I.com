// ✅ Initialize Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
const supabase = createClient(supabaseUrl, supabaseKey);

const calendarGrid = document.querySelector('.calendar-grid');
const monthYear = document.getElementById('month-year');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const eventDetails = document.getElementById('event-details');

let currentDate = new Date();
let selectedDate = null;
let events = [];

// ✅ Convert UTC to Local Time
function convertToLocalTime(utcDateTime) {
    if (!utcDateTime) return "N/A";
    const date = new Date(utcDateTime);
    return {
        date: date.toISOString().slice(0, 10),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    };
}

// ✅ Fetch Events from Supabase
async function fetchEvents() {
    const { data, error } = await supabase.from('calendar_events').select('id, event, date, end_date, description, required');
    if (error) {
        console.error('Error fetching events:', error);
        return;
    }
    
    events = data.map(event => {
        if (!event || !event.date || !event.end_date) return null;

        const startDateLocal = convertToLocalTime(event.date);
        const endDateLocal = convertToLocalTime(event.end_date);

        return {
            date: startDateLocal.date,
            title: `${startDateLocal.time} - ${endDateLocal.time}`,
            description: event.description || "No description",
            required: event.required // ✅ Track required events
        };
    }).filter(event => event !== null);

    renderCalendar(currentDate);
}

// ✅ Render Calendar
function renderCalendar(date) {
    calendarGrid.innerHTML = `
        <div class="day-header">Sun</div>
        <div class="day-header">Mon</div>
        <div class="day-header">Tue</div>
        <div class="day-header">Wed</div>
        <div class="day-header">Thu</div>
        <div class="day-header">Fri</div>
        <div class="day-header">Sat</div>`;

    const year = date.getFullYear();
    const month = date.getMonth();
    monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendarGrid.innerHTML += '<div class="day empty"></div>';
    }

    for (let day = 1; day <= lastDate; day++) {
        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = day;
        dayElement.dataset.date = fullDate;

        const dayEvents = events.filter(event => event.date === fullDate);
        if (dayEvents.length > 0) {
            if (dayEvents.some(event => event.required)) {
                dayElement.classList.add('required-event');
            } else {
                dayElement.classList.add('has-event');
            }
        }

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
            if (event.required) {
                li.style.backgroundColor = 'red'; // Highlight required events
                li.style.color = 'white';
            }
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

// ✅ CSS Styling for Events
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .has-event { background-color: #ffcc00 !important; color: black; font-weight: bold; border-radius: 5px; }
    .required-event { background-color: red !important; color: white; font-weight: bold; border-radius: 5px; }
    .multi-day-event { background-color: #87CEEB !important; color: black; border-radius: 5px; }
  </style>
`);
