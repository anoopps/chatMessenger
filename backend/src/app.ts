// imports
import express from 'express';
import cors from 'cors';


// app definition
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// auth router
import authRouter from "./routes/auth.routes";
app.use('/api/v1/auth', authRouter);

// chatroom APIs
import chatRouter from "./routes/chatroom.routes";
app.use('/api/v1/chatrooms', chatRouter);

app.use('/', (req, res) => {
    res.status(200).json({ message: "Server is up and running" });
});

// app export
export default app;