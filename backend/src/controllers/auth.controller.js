import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
   const { fullname, email, password } = req.body;
   try {
      if (!fullname || !email || !password) {
         return res.status(400).json({ message: 'All fields are required' });
      }
      if (password.trim().length < 6) {
         return res
            .status(400)
            .json({ message: 'Password must be at least 6 characters' });
      }

      const user_db = await User.findOne({ email });
      if (user_db) {
         return res
            .status(400)
            .json({ message: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
         fullname,
         email,
         password: hashedPassword,
      });

      if (newUser) {
         generateToken(newUser._id, res);
         await newUser.save();
         return res
            .status(201)
            .json({ user: newUser, message: 'User created successfully' });
      } else {
         return res.status(500).json({ message: 'Something went wrong' });
      }
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error in signup route' });
   }
};

export const login = async (req, res) => {
   const { email, password } = req.body;
   try {
      if (!email || !password) {
         return res.status(400).json({ message: 'All fields are required' });
      }

      const user_db = await User.findOne({ email });
      if (!user_db) {
         return res.status(400).json({ message: 'User not found' });
      }

      const isPasswordCorrect = await bcrypt.compare(
         password,
         user_db.password
      );
      if (!isPasswordCorrect) {
         return res.status(400).json({ message: 'Invalid credentials' });
      }

      generateToken(user_db._id, res);

      return res
         .status(200)
         .json({ user: user_db, message: 'Login successful' });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error in login route' });
   }
};

export const logout = (req, res) => {
   try {
      res.cookie('jwt', '', { maxAge: 0 });
      return res.status(200).json({ message: 'Logout successful' });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error in logout route' });
   }
};

export const updateProfile = async (req, res) => {
   try {
      const { avatar } = req.body;
      const userId = req.user._id;
      if (!avatar) {
         return res.status(400).json({ message: 'Avatar is required' });
      }

      const uploadResponse = await cloudinary.uploader.upload(avatar);
      const updatedUser = await User.findByIdAndUpdate(
         userId,
         { avatar: uploadResponse.secure_url },
         { new: true }
      );
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error in updateProfile route' });
   }
};

export const checkAuth = async (req, res) => {
   try {
      return res.status(200).json(req.user);
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error in checkAuth route' });
   }
};
