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

// 1. Fake Login function (called by login.html)
function login() {
    // Simply redirect to admin page without checking password
    window.location.href = 'admin.html';
}

// 2. Fake Logout function (called by admin.html)
function logout() {
    window.location.href = 'login.html';
}

// 3. Remove the "onAuthStateChanged" check so it doesn't kick you out
// (We leave this empty so the admin page doesn't redirect you back to login)