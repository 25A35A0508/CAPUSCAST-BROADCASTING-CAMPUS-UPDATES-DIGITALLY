
// auth.js - Authentication & Session Management


const DEFAULT_USERS = [
  { id: 1, name: "Dp",    email: "dp@pec.edu",  password: "dp@123", role: "student" },
  { id: 2, name: "Dr. Lakshmi",   email: "lakshmi@pec.edu",  password: "laxmi@23", role: "teacher" },
  { id: 3, name: "Prof. Ramesh",  email: "ramesh@pec.edu",  password: "ramesh@12", role: "teacher" },
  { id: 4, name: "Sai", email: "sai@pec.edu", password: "sai@111", role: "student" }
];

// Get all users — default + registered users from localStorage
function getAllUsers() {
  const stored = localStorage.getItem("registeredUsers");
  const registeredUsers = stored ? JSON.parse(stored) : [];
  return [...DEFAULT_USERS, ...registeredUsers];
}

function login(email, password) {
  const allUsers = getAllUsers();
  const user = allUsers.find(u => u.email === email && u.password === password);
  if (user) {
    const session = { id: user.id, name: user.name, email: user.email, role: user.role };
    localStorage.setItem("currentUser", JSON.stringify(session));
    return { success: true, user: session };
  }
  return { success: false, message: "Invalid email or password." };
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "../html/login.html";
}

function getCurrentUser() {
  const data = localStorage.getItem("currentUser");
  return data ? JSON.parse(data) : null;
}

function isLoggedIn() {
  return getCurrentUser() !== null;
}

function isTeacher() {
  const user = getCurrentUser();
  return user && user.role === "teacher";
}

function isStudent() {
  const user = getCurrentUser();
  return user && user.role === "student";
}

function requireLogin() {
  if (!isLoggedIn()) {
    alert("Please login to access this page.");
    window.location.href = "../html/login.html";
    return false;
  }
  return true;
}

function requireTeacher() {
  if (!isTeacher()) {
    alert("Access denied. Only teachers can access this page.");
    window.location.href = "../html/index.html";
    return false;
  }
  return true;
}

function register(name, email, password, role) {
  const allUsers = getAllUsers();
  const exists = allUsers.find(u => u.email === email);
  if (exists) return { success: false, message: "Email already registered." };

  // Save only to the registered users list in localStorage
  const stored = localStorage.getItem("registeredUsers");
  const registeredUsers = stored ? JSON.parse(stored) : [];
  const newUser = { id: Date.now(), name, email, password, role };
  registeredUsers.push(newUser);
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

  return { success: true, message: "Registration successful! Please login." };
}

function updateNavForRole() {
  const user = getCurrentUser();
  const loginLink = document.getElementById("nav-login");
  const logoutLink = document.getElementById("nav-logout");
  const userNameSpan = document.getElementById("nav-username");
  const dashboardLink = document.getElementById("nav-dashboard");

  if (user) {
    if (loginLink) loginLink.style.display = "none";
    if (logoutLink) logoutLink.style.display = "inline";
    if (userNameSpan) userNameSpan.textContent = `👤 ${user.name} (${user.role})`;
    if (dashboardLink) {
      dashboardLink.style.display = "inline";
      dashboardLink.href = user.role === "teacher" ? "../html/admindb.html" : "../html/studentdb.html";
      dashboardLink.textContent = user.role === "teacher" ? "Dashboard" : "My Portal";
    }
  } else {
    if (loginLink) loginLink.style.display = "inline";
    if (logoutLink) logoutLink.style.display = "none";
    if (userNameSpan) userNameSpan.textContent = "";
    if (dashboardLink) dashboardLink.style.display = "none";
  }
}
