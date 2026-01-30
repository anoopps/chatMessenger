// imports
import express from 'express';


// app definition
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// load router
import authRouter from "./routes/authRoutes";
app.use('/auth', authRouter);


app.use('/', (req, res) => {
    res.status(200).json({ message: "Server is up and running" });
});

// app export
export default app;