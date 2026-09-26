import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    if (!conversationId || !text) {
      return res.status(400).json({
        message: "Conversation ID and message text are required",
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants.some(
      (participantId) =>
        participantId.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not a participant in this conversation",
      });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      text,
    });

    res.status(201).json({
      message,
    });
  } catch (error) {
    console.error("Send message error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants.some(
      (participantId) =>
        participantId.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not a participant in this conversation",
      });
    }

    const messages = await Message.find({
      conversation: conversationId,
    }).sort({ createdAt: 1 });

    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};