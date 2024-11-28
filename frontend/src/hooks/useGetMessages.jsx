import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  // Function to fetch messages
  const getMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/${selectedConversation._id}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages(data); // Set messages after successful fetch
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch messages whenever a selected conversation changes
  useEffect(() => {
    if (selectedConversation?._id) {
      getMessages();
    }
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading, getMessages }; // Return getMessages
};

export default useGetMessages;
