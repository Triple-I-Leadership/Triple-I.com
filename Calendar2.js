import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg'; // Replace with actual key
const supabase = createClient(supabaseUrl, supabaseKey);

const calendarGrid = document.querySelector('.calendar-grid');
const monthYear = document.getElementById('month-year');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const eventDetails = document.getElementById('event-details');

let currentDate = new Date();
let selectedDate = null;
let events = []; // Holds events fetched from Supabase

// Fetch events from Supabase
async function fetchEvents() {
    const { data, error } = await supabase
        .from("calendar_events")
        .select("event, description, required, date, end_date");

    if (error) {
        console.error("Error fetching events:", error);
        return;
    }

    events = data; // Store fetched events
    renderCalendar(currentDate);
}

// Helper function to generate all dates between a start and end date
function getDatesBetween(startDate, endDate) {
    let dates = [];
    let current = new Date(startDate);
    let last = new Date(endDate);

    while (current <= last) {
        dates.push(current.toISOString().split('T')[0]); // Format YYYY-MM-DD
        current.setDate(current.getDate() + 1);
    }
    return dates;
}

// Render calendar
function renderCalendar(date) {
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

    for (let i = 0; i < firstDay; i++) {
        calendarGrid.innerHTML += `<div class="day"></div>`;
    }

    for (let day = 1; day <= lastDate; day++) {
        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = day;
        dayElement.dataset.date = fullDate;

        // Find events that include this date
        const dayEvents = events.filter(event => {
            const eventDates = getDatesBetween(event.date, event.end_date || event.date);
            return eventDates.includes(fullDate);
        });

        if (dayEvents.length > 0) {
            const isRequired = dayEvents.some(event => event.required);
            dayElement.classList.add(isRequired ? 'required-event' : 'has-event');
        }

        dayElement.addEventListener('click', () => {
            selectedDate = fullDate;
            renderCalendar(currentDate);
            showEvents(fullDate);
        });

        calendarGrid.appendChild(dayElement);
    }
}

// Show events for selected date
function showEvents(date) {
    eventDetails.innerHTML = '';
    const dayEvents = events.filter(event => {
        const eventDates = getDatesBetween(event.date, event.end_date || event.date);
        return eventDates.includes(date);
    });

    if (dayEvents.length > 0) {
        dayEvents.forEach(event => {
            const li = document.createElement('li');
            li.classList.add('event');
            li.innerHTML = `<strong>${event.event}</strong>: ${event.description}`;
            li.style.color = event.required ? "red" : "black"; // Highlight required events
            eventDetails.appendChild(li);
        });
    } else {
        eventDetails.innerHTML = '<li class="event">No events for this day.</li>';
    }
}

// Navigation
prevButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

nextButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

// Initial fetch and render
fetchEvents();
