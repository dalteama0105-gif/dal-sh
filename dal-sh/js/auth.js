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
