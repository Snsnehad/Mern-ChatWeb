import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import useGetMessages from "../hooks/useGetMessages"; // Import your hook to get messages

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthContext();
  const { setMessages, selectedConversation } = useConversation();
  const { getMessages } = useGetMessages(); // Assuming you have this function

  const sendMessage = async (message) => {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/messages/send/${selectedConversation._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      await getMessages(); 
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;
