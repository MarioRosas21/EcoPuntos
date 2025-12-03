// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const auth = getAuth();
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
      setChecking(false);
    });

    return () => unsub();
  }, []);

  if (checking) {
    return (
      <div style={{ textAlign: "center", padding: "30px" }}>
        Cargando...
      </div>
    );
  }

  return loggedIn ? children : <Navigate to="/" />;
}
