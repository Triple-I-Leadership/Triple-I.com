const calendarGrid = document.querySelector('.calendar-grid');
const monthYear = document.getElementById('month-year');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const eventDetails = document.getElementById('event-details');

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_KEY';
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

    const startDate = new Date(event.date);
    const endDate = new Date(event.end_date);
    if (isNaN(startDate) || isNaN(endDate)) return;

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().slice(0, 10);
      if (dateStr !== event.date) {
        multiDayEvents.add(dateStr);
      }
      events.push({ date: dateStr, title: event.event, description: event.description || "No description" });
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
    } else if (isMultiDay && !dayEvents.length) {
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

prevButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

fetchEvents();

