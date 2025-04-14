import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId, io } from '../lib/socket.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';

export const getUsers = async (req, res) => {
   try {
      const loggedInUserId = req.user._id;
      const filteredUsers = await User.find({
         _id: { $ne: loggedInUserId },
      }).select('-password');

      return res.status(200).json(filteredUsers);
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error in getUsers route' });
   }
};

export const getMessages = async (req, res) => {
   try {
      const { id: userToChatId } = req.params;
      const loggedInUserId = req.user._id;

      const messages = await Message.find({
         $or: [
            { senderId: loggedInUserId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: loggedInUserId },
         ],
      });

      return res.status(200).json(messages);
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error in getMessages route' });
   }
};

export const sendMessage = async (req, res) => {
   try {
      const { text, image } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user._id;

      let imageUrl;
      if (image) {
         const uploadResponse = await cloudinary.uploader.upload(image);
         imageUrl = uploadResponse.secure_url;
      }

      const message = new Message({
         senderId,
         receiverId,
         text,
         image: imageUrl,
      });
      await message.save();

      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
         io.to(receiverSocketId).emit('newMessage', message);
      }

      return res.status(201).json(message);
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error in sendMessage route' });
   }
};
