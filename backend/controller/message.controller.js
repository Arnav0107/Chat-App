import Message from "../model/Message.js";
import User from "../model/User.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUser);
  } catch (err) {
    console.error("getAllContacts error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessageByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("getMessageByUserId error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const SendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("SendMessage error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getChatPatners = async (req, res) => {
  try {
    const LoggedInUserId = req.user._id;

    const message = await Message.find({
      $or: [{ senderId: LoggedInUserId }, { receiverId: LoggedInUserId }],
    }).sort({ createdAt: -1 });

    const chatPartnersIds = [
      ...new Set(
        message.map((msg) =>
          msg.senderId.equals(LoggedInUserId)
            ? msg.receiverId.toString()
            : msg.senderId.toString(),
        ),
      ),
    ];

    const chatPartners = await User.find({
      _id: { $in: chatPartnersIds },
    }).select("-password");

    res.status(200).json(chatPartners);
  } catch (err) {
    console.error("getChatPatners error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};