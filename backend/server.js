import express from 'express';
import { config } from 'dotenv';
config();
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import connectDB from './db/db.js';
import {app, server} from './socket/socket.js';

import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import path from 'path';

const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use("/api/messages", messageRoutes);
app.use('/api/users', userRoutes);

app.use(express.static(path.join(__dirname, 'frontend/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'))
})
server.listen(PORT, () => {
  connectDB();
  console.log('Server started on port ' + PORT);
})