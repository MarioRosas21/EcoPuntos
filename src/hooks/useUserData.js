import { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function useUserData() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setUser({
            uid: firebaseUser.uid,   // ✅ AQUI LE REGRESAMOS EL UID
            ...snap.data()
          });
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}
