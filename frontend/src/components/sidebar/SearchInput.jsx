import React, { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useCoversation";
import { useGetConversation } from "../../hooks/useGetConversations.js";
import toast from "react-hot-toast";

// ------------------------------------------------------------------
// search input above sidebar

// functions
// - update setSelectedConversation with matching User entered in <input>
// ------------------------------------------------------------------
const SearchInput = () => {
  const [search, setSearch] = useState("");
  const { setSelectedConversation } = useConversation(); //  selected/highlighted user from sidebar
  const { conversations } = useGetConversation(); // []of users, JS Object for sidebar

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;

    if (search.length < 3) {
      return toast.error("Search term must be 3 characters long ");
    }

    // .includes -> returns true or false
    // .find  -> returns the element itself or undefined
    const conversation = conversations.find((c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()),
    );

    //sidebar user found - highlight
    if (conversation) {
      setSelectedConversation(conversation);
      setSearch(""); //clear input field
    } else {
      return toast.error("No user found");
    }
  };

  return (
    // search input + search Icon at the top
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="Search..."
        className="input input-bordered rounded-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit" className="btn btn-circle bg-sky-500 text-white">
        <IoSearchSharp className="w-6 h-6 outline-none" />
      </button>
    </form>
  );
};

export default SearchInput;
