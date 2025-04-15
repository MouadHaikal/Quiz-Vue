import { db, auth } from "../composables/useFirestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// ✅ Register user function
export const registerUser = async ({ email, password, username }) => {
  try {
    console.log("Registering with:", email, password, username);

    if (!auth) throw new Error("Firebase Auth is not initialized correctly");

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    console.log("User created successfully:", firebaseUser);

    await sendEmailVerification(firebaseUser);

    await setDoc(doc(db, "Users", firebaseUser.uid), {
      admin: false,
      answered: [],
      email: email,
      score: 0,
      username: username,
    });

    console.log("User document saved for:", username);
    return firebaseUser;

  } catch (error) {
    console.error("Firebase Error:", error);

    switch (error.code) {
      case 'auth/admin-restricted-operation':
        throw new Error("Account creation is restricted. Enable it in Firebase Console.");
      case 'auth/email-already-in-use':
        throw new Error("This email is already in use.");
      case 'auth/invalid-email':
        throw new Error("Invalid email address.");
      case 'auth/weak-password':
        throw new Error("Password is too weak.");
      case 'auth/network-request-failed':
        throw new Error("Network error. Please check your internet connection.");
      default:
        throw new Error(error.message);
    }
  }
};



//authentificate with google:
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  // Add basic scopes
  provider.addScope('email');

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Store user info in Firestore with only essential fields
    await setDoc(doc(db, "Users", user.uid), {
      admin: false,
      answered: [],
      email: user.email,
      score: 0,
      username: user.displayName
    }, { merge: true });

    return { user, error: null };
  } catch (error) {
    console.error("Erreur Google Auth:", error);
    return { user: null, error };
  }
}




