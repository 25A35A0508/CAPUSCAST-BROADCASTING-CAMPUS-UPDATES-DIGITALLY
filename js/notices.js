
// notices.js - Notice Management (Add/Edit/Delete/View)

const DEFAULT_NOTICES = [
  { id: 1, title: "Sem Exam Schedule Released", description: "sem exams will be held from May 4 to May 20. All students must carry their hall tickets.", category: "Exam",    startDate: "2026-05-04", endDate: "2026-05-20", postedBy: "Dr. Lakshmi",  postedOn: "2026-04-01" },
  { id: 2, title: "College Closed on Aprial 14th",       description: " Due to Ambedkhar Jayanti",                                                  category: "Holiday", startDate: "2026-04-14", endDate: "2026-05-14", postedBy: "Admin",       postedOn: "2026-04-13" },
  { id: 3, title: "Library Hours Updated",           description: "Library will be remain open from 9 AM to 5.30 PM on all working days.",                                              category: "General", startDate: "2026-04-01", endDate: "2026-06-01", postedBy: "Admin",       postedOn: "2026-04-01" }
];

function getNotices() {
  const stored = localStorage.getItem("notices");
  if (!stored) {
    localStorage.setItem("notices", JSON.stringify(DEFAULT_NOTICES));
    return DEFAULT_NOTICES;
  }
  return JSON.parse(stored);
}

function saveNotices(notices) {
  localStorage.setItem("notices", JSON.stringify(notices));
}

function addNotice(title, description, category, startDate, endDate) {
  const user = getCurrentUser();
  if (!user || user.role !== "teacher") {
    return { success: false, message: "Only teachers can add notices." };
  }
  const notices = getNotices();
  const newNotice = {
    id: Date.now(),
    title, description, category, startDate, endDate,
    postedBy: user.name,
    postedOn: new Date().toISOString().split("T")[0]
  };
  notices.unshift(newNotice);
  saveNotices(notices);
  return { success: true, message: "Notice posted successfully!" };
}

function deleteNotice(id) {
  const user = getCurrentUser();
  if (!user || user.role !== "teacher") return { success: false, message: "Access denied." };
  let notices = getNotices();
  notices = notices.filter(n => n.id !== id);
  saveNotices(notices);
  return { success: true };
}

function updateNotice(id, title, description, category, startDate, endDate) {
  const user = getCurrentUser();
  if (!user || user.role !== "teacher") return { success: false, message: "Access denied." };
  let notices = getNotices();
  const idx = notices.findIndex(n => n.id === id);
  if (idx === -1) return { success: false, message: "Notice not found." };
  notices[idx] = { ...notices[idx], title, description, category, startDate, endDate };
  saveNotices(notices);
  return { success: true };
}

function getNoticesByCategory(category) {
  const notices = getNotices();
  if (!category || category === "All") return notices;
  return notices.filter(n => n.category === category);
}

function renderNoticeCards(containerId, category = "All") {
  const container = document.getElementById(containerId);
  if (!container) return;
  const notices = getNoticesByCategory(category);
  const user = getCurrentUser();
  if (notices.length === 0) {
    container.innerHTML = "<p style='text-align:center;color:#666;'>No notices found.</p>";
    return;
  }
  container.innerHTML = notices.map(n => `
    <div class="notice-card">
      <span class="badge badge-${n.category.toLowerCase()}">${n.category}</span>
      <h3>${n.title}</h3>
      <p>${n.description}</p>
      <small>📅 Posted: ${n.postedOn} &nbsp;|&nbsp; 👤 ${n.postedBy} &nbsp;|&nbsp; ⏳ Expires: ${n.endDate}</small>
      ${user && user.role === "teacher" ? `
        <div class="card-actions">
          <button class="btn-edit" onclick="openEditNotice(${n.id})"> Edit</button>
          <button class="btn-delete" onclick="confirmDeleteNotice(${n.id})"> Delete</button>
        </div>` : ""}
    </div>
  `).join("");
}

function renderNoticeTable(tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const notices = getNotices();
  tbody.innerHTML = notices.map(n => `
    <tr>
      <td>${n.title}</td>
      <td><span class="badge badge-${n.category.toLowerCase()}">${n.category}</span></td>
      <td>${n.postedBy}</td>
      <td>${n.postedOn}</td>
      <td>${n.endDate}</td>
      <td>
        <button class="btn-edit" onclick="openEditNotice(${n.id})"> Edit</button>
        <button class="btn-delete" onclick="confirmDeleteNotice(${n.id})"> Delete</button>
      </td>
    </tr>
  `).join("");
}

function confirmDeleteNotice(id) {
  if (confirm("Are you sure you want to delete this notice?")) {
    deleteNotice(id);
    if (document.getElementById("notices-tbody")) renderNoticeTable("notices-tbody");
    if (document.getElementById("notices-container")) renderNoticeCards("notices-container");
    showToast("Notice deleted successfully!", "success");
  }
}

function openEditNotice(id) {
  const notices = getNotices();
  const n = notices.find(x => x.id === id);
  if (!n) return;
  document.getElementById("edit-id").value = n.id;
  document.getElementById("edit-title").value = n.title;
  document.getElementById("edit-desc").value = n.description;
  document.getElementById("edit-category").value = n.category;
  document.getElementById("edit-start").value = n.startDate;
  document.getElementById("edit-end").value = n.endDate;
  document.getElementById("edit-modal").style.display = "flex";
}
