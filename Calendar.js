const calendarGrid = document.querySelector('.calendar-grid');
const monthYear = document.getElementById('month-year');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const eventDetails = document.getElementById('event-details');

// Placeholder events (you can fetch these from a database)
const events = [
  { date: '2025-01-15', title: 'Team Meeting', description: 'Monthly team meeting at 10 AM.' },
  { date: '2025-01-20', title: 'Doctor Appointment', description: 'Annual check-up at 3 PM.' },
  { date: '2025-01-25', title: 'Birthday Party', description: 'John\'s birthday celebration at 7 PM.' },
];

let currentDate = new Date();

function renderCalendar(date) {
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

function showEvents(date) {
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
