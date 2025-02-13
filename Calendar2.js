const calendarGrid = document.querySelector('.calendar-grid');
const monthYear = document.getElementById('month-year');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const eventDetails = document.getElementById('event-details');

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
const supabase = createClient(supabaseUrl, supabaseKey);

let currentDate = new Date();
let selectedDate = null;
let events = [];
let multiDayEvents = new Set();

async function fetchEvents() {
    const { data, error } = await supabase.from('calendar_events').select('id, event, date, end_date, description');

    if (error) {
        console.error('Error fetching events:', error);
        return;
    }

    events = [];
    multiDayEvents.clear();

    data.forEach(event => {
        if (!event || !event.date || !event.end_date) return;

        // Convert Supabase UTC dates into local timezone
        const startDate = new Date(event.date + "T00:00:00Z");
        const endDate = new Date(event.end_date + "T23:59:59Z");

        const localStartDate = new Date(startDate.toLocaleString("en-US", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));
        const localEndDate = new Date(endDate.toLocaleString("en-US", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));

        if (isNaN(localStartDate) || isNaN(localEndDate)) return;

        let currentDate = new Date(localStartDate);
        let eventTimeRange = formatTime(localStartDate) + " - " + formatTime(localEndDate);

        while (currentDate <= localEndDate) {
            const dateStr = currentDate.toISOString().slice(0, 10);

            if (dateStr !== localStartDate.toISOString().slice(0, 10)) {
                multiDayEvents.add(dateStr);
            }

            if (dateStr === localStartDate.toISOString().slice(0, 10)) {
                eventTimeRange = `${formatDate(localStartDate)} ${formatTime(localStartDate)} - ${formatDate(localEndDate)} ${formatTime(localEndDate)}`;
            }

            events.push({
                date: dateStr,
                title: eventTimeRange,
                description: event.description || "No description"
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }
    });

    renderCalendar(currentDate);
}

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
        calendarGrid.innerHTML += '<div class="day empty"></div>';
    }

    for (let day = 1; day <= lastDate; day++) {
        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = day;
        dayElement.dataset.date = fullDate;

        const dayEvents = events.filter(event => event.date === fullDate);
        const isMultiDay = multiDayEvents.has(fullDate);

        if (dayEvents.length > 0) {
            dayElement.classList.add('has-event');
        } else if (isMultiDay) {
            dayElement.classList.add('multi-day-event');
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

function highlightSelectedDate() {
    document.querySelectorAll('.day.selected').forEach(el => el.classList.remove('selected'));
    const selectedElement = document.querySelector(`.day[data-date='${selectedDate}']`);
    if (selectedElement) {
        selectedElement.classList.add('selected');
    }
}

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

// Format time (e.g., "7:30 AM")
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
}

// Format date (e.g., "Feb 12th")
function formatDate(date) {
    const options = { month: 'short', day: 'numeric' };
    const daySuffix = getDaySuffix(date.getDate());
    return date.toLocaleDateString('en-US', options) + daySuffix;
}

// Date suffix (st, nd, rd, th)
function getDaySuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

// Navigate months
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

