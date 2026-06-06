import { useState, useEffect } from "react";
import toast from "react-hot-toast";

//  sends req to Backend to fetch users and saves it in conversation[] and returns it
//  along with loading state

export const useGetConversation = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  //should run only once and not for every render
  //this fn gets users for sidebar
  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users"); //GET req
        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }
        setConversations(data); //list of Users
      } catch (error) {
        toast.error(error.messsage);
      } finally {
        setLoading(false);
      }
    };
    getConversations();
  }, []); //[] ->  useEffect runs only once after the initial render.

  return { loading, conversations };
};

// -----------------------------------------------------------------------------
// data
// 0 : {_id: '6a11f1e2419d58b2ea6ca0c2', fullName: 'Tony', username: 'Tony_123', gender: 'male', profilePic: 'https://avatar.iran.liara.run/public/boy?username=Tony_123', …}
// 1 : {_id: '6a1838426cfbe24289f3c3ad', fullName: 'john', username: 'john_123', gender: 'male', profilePic: 'https://avatar.iran.liara.run/public/boy?username=john_123', …}
// 2 : {_id: '6a1891b75ea1320e7d53abbb', fullName: 'holy', username: 'holy_flax', gender: 'female', profilePic: 'https://avatar.iran.liara.run/public/girl?username=holy_flax', …}
