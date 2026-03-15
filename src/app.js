import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin :process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit : "32kb"}))
app.use(express.urlencoded({extended:true,limit:"32kb"}))
app.use(express.static("public"));
app.use(cookieParser());


//routes import
import userRouter from "./routes/user.routes.js";

//routes declaration 
app.use("/api/v1/users",userRouter);

import videoRouter from './routes/video.routes.js'
app.use("/api/v1/videos",videoRouter)
//http://localhost:8000/api/v1/users/register

import commentRouter from './routes/comment.routes.js'

app.use("/api/v1/comments",commentRouter)

import likeRouter from './routes/like.routes.js'

app.use("/api/v1/likes",likeRouter);

import tweetRouter from './routes/tweet.routes.js';

app.use("/api/v1/tweets",tweetRouter);


import playlistRouter from './routes/playlist.routes.js'

app.use("/api/v1/playlists",playlistRouter)


import subscriptionRouter from './routes/subscription.routes.js'

app.use("/api/v1/subscription",subscriptionRouter)

import dashboardRouter from './routes/dashboard.routes.js'

app.use("/api/v1/dashboard",dashboardRouter)

export {app};