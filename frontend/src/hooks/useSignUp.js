//its js file and its used to send requests
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  //destructure
  const signUp = async ({
    fullName,
    username,
    password,
    confirmPassword,
    gender,
  }) => {
    const success = handleInputErrors(
      fullName,
      username,
      password,
      confirmPassword,
      gender,
    );
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, //type of data being sent is Json text
        body: JSON.stringify({
          fullName,
          username,
          password,
          confirmPassword,
          gender,
        }), // HTTP body must be a string, not a raw JS object
      });
      const data = await res.json(); //res.json() parses JSON string → JS object

      if (data.error) {
        throw new Error(data.error); //error from Backend
      }

      //localstorage - user stays logged in even after a refresh
      localStorage.setItem("chat-user", JSON.stringify(data));

      setAuthUser(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading };
};

const handleInputErrors = (
  fullName,
  username,
  password,
  confirmPassword,
  gender,
) => {
  if (!fullName || !username || !password || !confirmPassword || !gender) {
    toast.error("Please fill in all the Fields");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password should be atleast 6 characters");
    return false;
  }
  return true;
};
