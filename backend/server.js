import express from 'express';
import { config } from 'dotenv';
config();
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import connectDB from './db/db.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
const app = express();
const PORT = process.env.PORT;

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// })
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use("/api/messages", messageRoutes);
app.use('/api/users', userRoutes);
app.listen(PORT, () => {
  connectDB();
  console.log('Server started on port ' + PORT);
})