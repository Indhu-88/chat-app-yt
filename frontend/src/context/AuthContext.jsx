import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

// ---------------------------------------------------------------------
// Instead of writing useContext(AuthContext) everywhere,
// call useAuthContext() and instantly get { authUser, setAuthUser }

// {authUser}
// {_id: '6a11f1e2419d58b2ea6ca0c2', fullName: 'Tony', username: 'Tony_123', profilePic: 'https://avatar.iran.liara.run/public/boy?username=Tony_123'}

// ---------------------------------------------------------------------

const AuthContext = createContext(); // share state across your component tree

// for useSignUp.jsx
export const useAuthContext = () => {
  return useContext(AuthContext);
};

// JSON.parse - turns it into a real JavaScript object
// localStorage sets it in useLogin which is JS Object with ._id, fullname, username, profilePic etc
// for main.jsx
export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("chat-user")) || null,
  );

  // Whatever is wrapped inside <AuthContextProvider> ... </AuthContextProvider> (like <App />)
  // becomes the “children.” Those children now have access to the shared authentication state.
  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
