import supabase from "/supabase.js";

async function fetchEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('id, event, description, date, end_date, required');
  
    if (error) {
      console.error('Error fetching events:', error);
      return;
    }
  
    const container = document.querySelector('.event-container');
    container.innerHTML = ''; // Clear default content
  
    data.forEach(event => {
      const card = document.createElement('div');
      card.className = 'event-card';
  
      const title = document.createElement('h2');
      title.textContent = event.event;
  
      const desc = document.createElement('p');
      desc.textContent = event.description;
  
      const date = document.createElement('p');
      date.textContent = `From: ${new Date(event.date).toLocaleDateString()} To: ${new Date(event.end_date).toLocaleDateString()}`;
  
      const required = document.createElement('p');
      required.textContent = `Required: ${event.required ? 'Yes' : 'No'}`;
  
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(date);
      card.appendChild(required);
  
      container.appendChild(card);
    });
  }
  
  fetchEvents();