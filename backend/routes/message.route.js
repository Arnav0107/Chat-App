import express from "express";
import { getAllContacts } from "../controller/message.controller.js";
import { ProtectRoute } from "../middleware/auth.middleware.js";
import { getMessageByUserId } from "../controller/message.controller.js";
import { SendMessage } from "../controller/message.controller.js";
import { getChatPatners } from "../controller/message.controller.js";
const router = express.Router();

router.get("/contacts", ProtectRoute, getAllContacts);
router.get("/chats", ProtectRoute, getChatPatners);
router.post("/send/:id", ProtectRoute, SendMessage); // ← move up, before /:id
router.get("/:id", ProtectRoute, getMessageByUserId);

export default router;
