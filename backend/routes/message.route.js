import express from "express";
import { sendMessage, getMessagesById , getAllUser , getChatPartners} from "../controller/message.controller.js";
import { authUser } from "../middleware/auth.user.js";
import ajMiddleware from "../middleware/arcjet.middleware.js";

const messageRouter = express.Router();
messageRouter.use(authUser);
// messageRouter.use(ajMiddleware);

messageRouter.post("/send/:id", sendMessage);

messageRouter.get("/contacts", getAllUser);
//messageRouter.get("/chats", getChatPartners);
//messageRouter.get("/:id", getMessagesById);

export default messageRouter;