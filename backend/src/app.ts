// imports
import express from 'express';
import cors from 'cors';


// app definition
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// load router
import authRouter from "./routes/authRoutes";
app.use('/api/v1/auth', authRouter);




app.use('/', (req, res) => {
    res.status(200).json({ message: "Server is up and running" });
});

// app export
export default app;