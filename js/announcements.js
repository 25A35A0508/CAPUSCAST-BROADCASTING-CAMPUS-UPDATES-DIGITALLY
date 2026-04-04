
// announcements.js - Announcements Management


const DEFAULT_ANNOUNCEMENTS = [
  { id: 1, title: "Scholarship Applications Open",  description: "Government scholarship applications are now open. Last date: 25 April. Visit the scholarship portal.", priority: "high",   postedBy: "Admin",        postedOn: "2026-04-01" },
  { id: 2, title: "Library Timing Extended",        description: "Library will now remain open from 8 AM to 8 PM on all working days including Saturdays.",           priority: "medium", postedBy: "Dr. Lakshmi",  postedOn: "2026-04-02" },
  { id: 4, title: "Fee Payment Reminder",           description: "Last date for fee payment is April 30. Kindly pay to avoid late fine.",                              priority: "high",   postedBy: "Admin",        postedOn: "2026-04-01" },
  
];

function getAnnouncements() {
  const stored = localStorage.getItem("announcements");
  if (!stored) {
    localStorage.setItem("announcements", JSON.stringify(DEFAULT_ANNOUNCEMENTS));
    return DEFAULT_ANNOUNCEMENTS;
  }
  return JSON.parse(stored);
}

function saveAnnouncements(list) {
  localStorage.setItem("announcements", JSON.stringify(list));
}

function addAnnouncement(title, description, priority) {
  const user = getCurrentUser();
  if (!user || user.role !== "teacher") return { success: false, message: "Only teachers can add announcements." };
  const list = getAnnouncements();
  list.unshift({ id: Date.now(), title, description, priority, postedBy: user.name, postedOn: new Date().toISOString().split("T")[0] });
  saveAnnouncements(list);
  return { success: true };
}

function deleteAnnouncement(id) {
  const user = getCurrentUser();
  if (!user || user.role !== "teacher") return { success: false };
  let list = getAnnouncements();
  list = list.filter(a => a.id !== id);
  saveAnnouncements(list);
  return { success: true };
}

function renderAnnouncementCards(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const list = getAnnouncements();
  const user = getCurrentUser();
  if (list.length === 0) {
    container.innerHTML = "<p style='text-align:center;color:#666;'>No announcements found.</p>";
    return;
  }
  container.innerHTML = list.map(a => `
    <div class="announcement-card priority-${a.priority}">
      <span class="priority-badge priority-${a.priority}">${a.priority.toUpperCase()}</span>
      <h3>${a.title}</h3>
      <p>${a.description}</p>
      <small>📅 ${a.postedOn} &nbsp;|&nbsp; 👤 ${a.postedBy}</small>
      ${user && user.role === "teacher" ? `
        <div class="card-actions">
          <button class="btn-delete" onclick="confirmDeleteAnnouncement(${a.id})"> Delete</button>
        </div>` : ""}
    </div>
  `).join("");
}

function confirmDeleteAnnouncement(id) {
  if (confirm("Delete this announcement?")) {
    deleteAnnouncement(id);
    renderAnnouncementCards("announcements-container");
    showToast("Announcement deleted!", "success");
  }
}
