
// ui.js - UI Utilities (Toast, Modal, Filter, Search)

function showToast(message, type = "success") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  setTimeout(() => { toast.className = "toast"; }, 3500);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "none";
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "flex";
}

function filterNoticesByCategory(selectId, containerId) {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.addEventListener("change", () => {
    renderNoticeCards(containerId, select.value);
  });
}

function setupSearch(inputId, containerId, type = "notices") {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    let items = type === "notices" ? getNotices() : type === "events" ? getEvents() : getAnnouncements();
    const filtered = items.filter(i => i.title.toLowerCase().includes(query) || i.description.toLowerCase().includes(query));
    const container = document.getElementById(containerId);
    if (!container) return;
    if (filtered.length === 0) {
      container.innerHTML = `<p style='text-align:center;color:#666;padding:20px;'>No results found for "<strong>${query}</strong>"</p>`;
      return;
    }
    if (type === "notices") {
      const user = getCurrentUser();
      container.innerHTML = filtered.map(n => `
        <div class="notice-card">
          <span class="badge badge-${n.category.toLowerCase()}">${n.category}</span>
          <h3>${n.title}</h3>
          <p>${n.description}</p>
          <small>📅 ${n.postedOn} | 👤 ${n.postedBy} | ⏳ ${n.endDate}</small>
          ${user && user.role === "teacher" ? `
            <div class="card-actions">
              <button class="btn-edit" onclick="openEditNotice(${n.id})">✏️ Edit</button>
              <button class="btn-delete" onclick="confirmDeleteNotice(${n.id})">Delete</button>
            </div>` : ""}
        </div>`).join("");
    }
  });
}

function setActiveNav() {
  const links = document.querySelectorAll(".navbar nav a");
  const current = window.location.pathname.split("/").pop();
  links.forEach(link => {
    const href = link.getAttribute("href").split("/").pop();
    if (href === current) link.classList.add("active");
    else link.classList.remove("active");
  });
}

function showRoleBadge() {
  const user = getCurrentUser();
  const badge = document.getElementById("role-badge");
  if (badge && user) {
    badge.textContent = user.role === "teacher" ? " Faculty" : " Student";
    badge.className = `role-badge role-${user.role}`;
  }
}

function getDashboardStats() {
  return {
    notices: getNotices().length,
    announcements: getAnnouncements().length,
    events: getEvents().length
  };
}

function renderDashboardStats() {
  const stats = getDashboardStats();
  const noticeCount = document.getElementById("stat-notices");
  const announcCount = document.getElementById("stat-announcements");
  const eventCount = document.getElementById("stat-events");
  if (noticeCount) noticeCount.textContent = stats.notices;
  if (announcCount) announcCount.textContent = stats.announcements;
  if (eventCount) eventCount.textContent = stats.events;
}
