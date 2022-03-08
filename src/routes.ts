import { config } from "dotenv";
import express, { Request, Response } from "express";
import { base64QrCode, status } from "./venom";
import {
  sendMessage,
  sendImage,
  sendVideo,
} from "./controllers/send_controller";
import { rebootVenom } from "./controllers/venom_controller";

import {
  isAuth,
  venomInjected,
  validadeNumber,
} from "./middlewares/middleware";

const routes = express.Router();
config();

routes.get("/", (req: Request, res: Response) => {
  res.render("index", { qrCode: base64QrCode, status: status });
});

routes.post(
  "/send-message",
  isAuth,
  venomInjected,
  validadeNumber,
  sendMessage
);

routes.post("/send-image", isAuth, venomInjected, validadeNumber, sendImage);

//await multiDevice support
//routes.post("/send-video", isAuth, venomInjected, validadeNumber, sendVideo);

routes.post("/venom-reboot", isAuth, rebootVenom);

export default routes;
