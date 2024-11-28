import Message from "../models/message.js";
// import User from "../models/user";
import mongoose from "mongoose";
import Conversation from "../models/conversation.js";
import { getReceiverSocketId } from "../socket/socket.js";
import {io} from "../socket/socket.js"
export const sendMessage = async (req,res)=>{
  try {
    const {message} = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
console.log(receiverId, senderId);

const senderObjectId =new mongoose.Types.ObjectId(senderId);
const receiverObjectId = new mongoose.Types.ObjectId(receiverId);
console.log(senderObjectId, receiverObjectId)
    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderObjectId, receiverObjectId],
      },
    });

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderObjectId, receiverObjectId],
      });
    }

    // Now you can update the conversation or add the message as needed
    const newMessage = new Message({
      senderId: senderObjectId,
      receiverId: receiverObjectId,
      conversationId: conversation._id,
      message,
    });
    if(newMessage){
      conversation.messages.push(newMessage._id);
    }
    
    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({status:201, newMessage});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); 
    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};