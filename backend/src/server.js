import dotenv from "dotenv"
import connectDatabase from "./database/index.js"
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config({
    path: './env'
});

console.log("Cors origin env", process.env.CORS_ORIGIN);

const app = new express();

const corsOptions = {
    origin: [process.env.CORS_ORIGIN, "https://rainbow-vacherin-596f62.netlify.app/"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));


connectDatabase()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
    app.get("/", (req,res) => {
        res.status(200).json({ message: "You are good to go" })
    })
})
.catch((err) => {
    console.log("MongoDB connection failed !!!", err);
})

app.use(express.json( {limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"))
app.use(cookieParser());


import questionRouter from "./routes/question.routes.js";
import formRouter from "./routes/form.routes.js"
import answerRouter from "./routes/answer.routes.js"


app.use("/question", questionRouter);
app.use("/form", formRouter)
app.use("/answer", answerRouter)



