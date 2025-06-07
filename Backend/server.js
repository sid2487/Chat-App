import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.route.js";


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*"}
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// sockets.on(....) : It's a listener on the server-side WebSocket that waits for a named event to be emitted from the client side. When the server "hears" the event, it runs the callback function you define.

const onlineUser = new Map();

io.on("connection", (socket) => {
    console.log("Socket connected", socket.id);

    socket.on("add-user", (userId) => {
        onlineUser.set(userId, socket.id);
    });

    // data = {to: "user456", from: "user678", text: "hello"}
    socket.on("send-msg", (data) => { 
        const sendUserSocket = onlineUser.get(data.to); // jisko msg bhej rhe ho uski socket id check kr lenge online users wale map me.
        if(sendUserSocket){ // he is online
            io.to(sendUserSocket).emit("msg-receive", data); // usi ko msg send kr do
        }
    });

    socket.on("typing", ({ to }) => {
        const toSocket = onlineUser.get(to);
        if(toSocket) io.to(toSocket).emit("typing", true);
    });

    socket.on("stop-typing", ({ to }) => {
        const toSocket = onlineUser.get(to);
        if(toSocket) io.to(toSocket).emit("typing", false);
    })
})


const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})