import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserModel, ContentModel } from "./db.js";
import { JWT_PASSWORD } from "./config.js";
import { userMiddleWare } from "./middleware.js";
mongoose.connect("mongodb+srv://Username:ZYuIYHirOd6cYdm4@cluster0.mux57z4.mongodb.net/Brainly");
const app = express();
app.use(express.json());
app.post("/api/v1/signup", async (req, res) => {
    // zod validation, hash the password
    const username = req.body.username;
    const password = req.body.password;
    await UserModel.create({
        username: username,
        password: password
    });
    res.json({
        message: "User signed up"
    });
});
app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await UserModel.findOne({
        username,
        password
    });
    if (existingUser) {
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_PASSWORD);
        res.json({
            token
        });
    }
    else {
        res.status(403).json({
            message: "Incorrect credentials"
        });
    }
});
app.post("/api/v1/content", userMiddleWare, async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    await ContentModel.create({
        link,
        type,
        //@ts-ignore
        userId: req.userId,
        tags: []
    });
    res.json({
        message: "Content added"
    });
});
app.get("/api/v1/content", userMiddleWare, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    res.json({
        content
    });
});
app.delete("api/v1/content", (req, res) => {
});
app.post("api/v1/brain/share", (req, res) => {
});
app.get("api/v1/brain/:shareLink", (req, res) => {
});
app.listen(3000);
//# sourceMappingURL=index.js.map