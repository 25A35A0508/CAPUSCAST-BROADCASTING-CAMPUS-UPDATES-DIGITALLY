
// events.js - Events Management

const DEFAULT_EVENTS = [
  
  { id: 1, title: "Hackathon Registration Open",   description: "All year student must register for Summer Hackathon.Every team must contain 4-5 students.", date: "2026-04-15", time: "10:00 AM",  location: "Seminar Hall",         organizer: "CSE", postedBy: "Prof. Ramesh" },
  { id: 2, title: "Sports Day 2026",  description: "Annual sports day with  events, team games and prize distribution ceremony.", date: "2026-04-22", time: "10:00 AM",  location: "College Sports Ground", organizer: "Sports Dept",  postedBy: "Admin"        }
];

function getEvents() {
  const stored = localStorage.getItem("events");
  if (!stored) {
    localStorage.setItem("events", JSON.stringify(DEFAULT_EVENTS));
    return DEFAULT_EVENTS;
  }
  return JSON.parse(stored);
}

function saveEvents(list) {
  localStorage.setItem("events", JSON.stringify(list));
}

function addEvent(title, description, date, time, location, organizer) {
  const user = getCurrentUser();
  if (!user || user.role !== "teacher") return { success: false, message: "Only teachers can add events." };
  const list = getEvents();
  list.unshift({ id: Date.now(), title, description, date, time, location, organizer, postedBy: user.name });
  saveEvents(list);
  return { success: true };
}

function deleteEvent(id) {
  const user = getCurrentUser();
  if (!user || user.role !== "teacher") return { success: false };
  let list = getEvents();
  list = list.filter(e => e.id !== id);
  saveEvents(list);
  return { success: true };
}

function renderEventCards(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const list = getEvents();
  const user = getCurrentUser();
  if (list.length === 0) {
    container.innerHTML = "<p style='text-align:center;color:#666;'>No events found.</p>";
    return;
  }
  container.innerHTML = list.map(e => `
    <div class="event-card">
      <h3>🎯 ${e.title}</h3>
      <p>${e.description}</p>
      <div class="event-meta">
        <span>📅 ${e.date}</span>
        <span>🕐 ${e.time}</span>
        <span>📍 ${e.location}</span>
        <span>🏢 ${e.organizer}</span>
      </div>
      <small>Posted by: ${e.postedBy}</small>
      ${user && user.role === "teacher" ? `
        <div class="card-actions">
          <button class="btn-delete" onclick="confirmDeleteEvent(${e.id})"> Delete</button>
        </div>` : ""}
    </div>
  `).join("");
}

function confirmDeleteEvent(id) {
  if (confirm("Delete this event?")) {
    deleteEvent(id);
    renderEventCards("events-container");
    showToast("Event deleted!", "success");
  }
}
