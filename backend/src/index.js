import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import healthCheckRoutes from './routes/healthcheck.route.js';
import connectDB from './lib/db.js';
import { app, server } from './lib/socket.js';

dotenv.config();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
   })
);

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/healthcheck', healthCheckRoutes);

server.listen(port, () => {
   console.log('server started', port);
   connectDB();
});
