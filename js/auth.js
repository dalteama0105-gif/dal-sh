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
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Simple hardcoded check (Note: This is NOT secure for production)
  if (email === "admin@dal-sh.com" && password === "admin123") {
    // Save a "logged in" flag to the browser
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'admin.html';
  } else {
    document.getElementById('error').textContent = "Invalid credentials";
  }
}

function logout() {
  localStorage.removeItem('isLoggedIn');
  window.location.href = 'login.html';
}

// Add this to the bottom of js/auth.js to protect admin.html
if (window.location.pathname.endsWith('admin.html')) {
  if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'login.html';
  }
}