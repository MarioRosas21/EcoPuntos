// hooks/useUserData.js
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function useUserData() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUser({ uid: u.uid, email: u.email, ...snap.data() });
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, loading };
}
