import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./router/userRoutes.js";
import auctionItemRouter from "./router/auctionItemRoutes.js";
import bidRouter from "./router/bidRoutes.js";
import commissionRouter from "./router/commissionRouter.js";
import superAdminRouter from "./router/superAdminRoutes.js";
import { endedAuctionCron } from "./automation/endedAuctionCron.js";
import { verifyCommissionCron } from "./automation/verifyCommissionCron.js";

const app = express();
config({ path: "./config/config.env" });

// -------------------- CORS --------------------
app.use(
  cors({
    origin: [process.env.FRONTEND_URL], // e.g. http://localhost:5173
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // allow cookies
  })
);

// -------------------- MIDDLEWARES --------------------
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// -------------------- ROUTES --------------------
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auctionitem", auctionItemRouter);
app.use("/api/v1/bid", bidRouter);
app.use("/api/v1/commission", commissionRouter);
app.use("/api/v1/superadmin", superAdminRouter);

// -------------------- ERROR HANDLER --------------------
app.use(errorMiddleware);

// -------------------- CRON JOBS --------------------
endedAuctionCron();
verifyCommissionCron();

// -------------------- DATABASE CONNECTION --------------------
connection();

export default app;
