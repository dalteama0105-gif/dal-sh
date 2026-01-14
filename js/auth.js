/*
// Replace these values with your Firebase project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Login (used on login.html)
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('error');
  errorEl.textContent = '';
  auth.signInWithEmailAndPassword(email, password)
    .then(()=> { window.location.href = 'admin.html'; })
    .catch(e => { errorEl.textContent = e.message; });
}

// Logout (used on admin.html)
function logout() {
  auth.signOut().then(()=> { window.location.href = 'login.html'; });
}

// Protect admin.html
auth.onAuthStateChanged(user => {
  if (!user && window.location.pathname.endsWith('admin.html')) {
    window.location.href = 'login.html';
  }
});
*/


// js/auth.js - BYPASS MODE

// Login function (used on login.html)
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('error');
  
  // Reset error message
  if (errorEl) errorEl.textContent = '';

  // 1. Developer / Admin Login
  if (email === "admin123" && password === "admin123") {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('userName', 'Admin');
    window.location.href = 'admin.html';
  } 
  // 2. Standard User Login (Demo)
  else if (email === "user123" && password === "user123") {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'user');
    localStorage.setItem('userName', 'User');
    window.location.href = 'home.html';
  } 
  // Invalid Credentials
  else {
    if (errorEl) {
      errorEl.textContent = "Invalid credentials.";
    } else {
      alert("Invalid credentials");
    }
  }
}

// Logout function
function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userName');
  window.location.href = 'index.html';
}

// Protect admin.html
// This runs specifically when auth.js is loaded (which happens in admin.html)
if (window.location.pathname.endsWith('admin.html')) {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userRole = localStorage.getItem('userRole');

  if (!isLoggedIn) {
    // Not logged in -> Go to login
    window.location.href = 'index.html';
  } else if (userRole !== 'admin') {
    // Logged in but not admin -> Kick to home
    alert("Access Denied: You do not have permission to view the Admin Panel.");
    window.location.href = 'index.html';
  }
}

// Protect admin.html
// This runs specifically when auth.js is loaded (which happens in admin.html)
if (window.location.pathname.endsWith('home.html')) {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userRole = localStorage.getItem('userRole');

  if (!isLoggedIn) {
    // Not logged in -> Go to login
    window.location.href = 'index.html';
  } else if (userRole !== 'user') {
    // Logged in but not admin -> Kick to home
    alert("Access Denied: You do not have permission to view.");
    window.location.href = 'index.html';
  }
}