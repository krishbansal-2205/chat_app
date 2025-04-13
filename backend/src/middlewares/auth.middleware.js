import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
   try {
      const token = req.cookies.jwt;
      if (!token) {
         res.status(401).json({ message: 'Unauthorized- no token found' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
         res.status(401).json({ message: 'Unauthorized- invalid token' });
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
         res.status(404).json({ message: 'Unauthorized- user not found' });
      }

      req.user = user;
      next();
   } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error in protectRoutes middleware' });
   }
};
