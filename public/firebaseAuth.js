import { auth, provider } from './firebaseInit.js';
import { signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// Login with Google
export async function login() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("👤 Logged in as:", user.displayName);
    return user;
  } catch (err) {
    console.error("🔥 Login error:", err.message);
    throw err;
  }
}

// Logout
export async function logout() {
  try {
    await signOut(auth);
    console.log("👤 Logged out");
  } catch (err) {
    console.error("🔥 Logout error:", err.message);
    throw err;
  }
}
