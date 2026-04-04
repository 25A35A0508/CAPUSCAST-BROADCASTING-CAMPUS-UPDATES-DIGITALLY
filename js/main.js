// =============================================
// main.js - Page Initialization (runs on every page)
// =============================================

document.addEventListener("DOMContentLoaded", function () {
  updateNavForRole();
  setActiveNav();
  showRoleBadge();

  const page = window.location.pathname.split("/").pop();

  // ---- LOGIN PAGE ----
  if (page === "login.html") {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();
        const result = login(email, password);
        if (result.success) {
          showToast(`Welcome, ${result.user.name}!`, "success");
          setTimeout(() => {
            if (result.user.role === "teacher") window.location.href = "admindb.html";
            else window.location.href = "studentdb.html";
          }, 1000);
        } else {
          showToast(result.message, "error");
        }
      });
    }
  }

  // ---- REGISTER PAGE ----
  if (page === "register.html") {
    const regForm = document.getElementById("register-form");
    if (regForm) {
      regForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("reg-name").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const password = document.getElementById("reg-password").value.trim();
        const confirm = document.getElementById("reg-confirm").value.trim();
        const role = document.getElementById("reg-role").value;
        if (password !== confirm) { showToast("Passwords do not match!", "error"); return; }
        const result = register(name, email, password, role);
        showToast(result.message, result.success ? "success" : "error");
        if (result.success) setTimeout(() => window.location.href = "login.html", 1500);
      });
    }
  }

  // ---- NOTICES PAGE ----
  if (page === "notices.html") {
    renderNoticeCards("notices-container");
    filterNoticesByCategory("category-filter", "notices-container");
    setupSearch("notice-search", "notices-container", "notices");
  }

  // ---- ANNOUNCEMENTS PAGE ----
  if (page === "annoc.html") {
    renderAnnouncementCards("announcements-container");
    if (isTeacher()) {
      const addBtn = document.getElementById("add-announcement-btn");
      if (addBtn) addBtn.style.display = "inline-block";
    }
    const annForm = document.getElementById("add-announcement-form");
    if (annForm) {
      annForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const title = document.getElementById("ann-title").value.trim();
        const desc = document.getElementById("ann-desc").value.trim();
        const priority = document.getElementById("ann-priority").value;
        const result = addAnnouncement(title, desc, priority);
        if (result.success) {
          showToast("Announcement posted!", "success");
          annForm.reset();
          closeModal("add-announcement-modal");
          renderAnnouncementCards("announcements-container");
        }
      });
    }
  }

  // ---- EVENTS PAGE ----
  if (page === "event.html") {
    renderEventCards("events-container");
    if (isTeacher()) {
      const addBtn = document.getElementById("add-event-btn");
      if (addBtn) addBtn.style.display = "inline-block";
    }
    const evtForm = document.getElementById("add-event-form");
    if (evtForm) {
      evtForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const title    = document.getElementById("evt-title").value.trim();
        const desc     = document.getElementById("evt-desc").value.trim();
        const date     = document.getElementById("evt-date").value;
        const time     = document.getElementById("evt-time").value;
        const location = document.getElementById("evt-location").value.trim();
        const org      = document.getElementById("evt-organizer").value.trim();
        const result = addEvent(title, desc, date, time, location, org);
        if (result.success) {
          showToast("Event added!", "success");
          evtForm.reset();
          closeModal("add-event-modal");
          renderEventCards("events-container");
        }
      });
    }
  }

  // ---- ADD NOTICE PAGE ----
  if (page === "addnotice.html") {
    if (!requireTeacher()) return;
    const form = document.getElementById("add-notice-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const title    = document.getElementById("notice-title").value.trim();
        const desc     = document.getElementById("notice-desc").value.trim();
        const category = document.getElementById("notice-category").value;
        const start    = document.getElementById("notice-start").value;
        const end      = document.getElementById("notice-end").value;
        const result = addNotice(title, desc, category, start, end);
        showToast(result.message, result.success ? "success" : "error");
        if (result.success) { form.reset(); setTimeout(() => window.location.href = "managenotices.html", 1500); }
      });
    }
  }

  // ---- MANAGE NOTICES PAGE ----
  if (page === "managenotices.html") {
    if (!requireTeacher()) return;
    renderNoticeTable("notices-tbody");
    const editForm = document.getElementById("edit-notice-form");
    if (editForm) {
      editForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const id    = parseInt(document.getElementById("edit-id").value);
        const title = document.getElementById("edit-title").value.trim();
        const desc  = document.getElementById("edit-desc").value.trim();
        const cat   = document.getElementById("edit-category").value;
        const start = document.getElementById("edit-start").value;
        const end   = document.getElementById("edit-end").value;
        const result = updateNotice(id, title, desc, cat, start, end);
        showToast(result.success ? "Notice updated!" : result.message, result.success ? "success" : "error");
        if (result.success) { closeModal("edit-modal"); renderNoticeTable("notices-tbody"); }
      });
    }
  }

  // ---- ADMIN DASHBOARD ----
  if (page === "admindb.html") {
    if (!requireTeacher()) return;
    renderDashboardStats();
  }

  // ---- STUDENT DASHBOARD ----
  if (page === "studentdb.html") {
    if (!requireLogin()) return;
    renderDashboardStats();
    renderNoticeCards("recent-notices", "All");
  }

  // ---- INDEX PAGE ----
  if (page === "index.html" || page === "") {
    renderDashboardStats();
  }

  // ---- LOGOUT BUTTON ----
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
});
