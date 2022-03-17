import { Request, Response } from "express";
import { venomClient } from "../venom";

const sendMessage = async (req: Request, res: Response) => {
  const { to, message } = req.body;

  if (!to || !message || to == "" || message == "") {
    res.status(400).send();
    return;
  }

  try {
    await venomClient.sendText(to, message);
    res.status(201).send({});
  } catch (error) {
    res.status(500).send(error);
  }
};

const sendImage = async (req: Request, res: Response) => {
  const { to, base64, message } = req.body;

  if (!base64 || !message || base64 == "" || message == "")
    return res.status(400).send();

  try {
    await venomClient.sendFileFromBase64(to, base64, "", message);
    res.status(201).send({});
  } catch (error) {
    res.status(500).send(error);
  }
};

const sendVideo = async (req: Request, res: Response) => {
  const { to, url, message } = req.body;

  if (!url || !message || url == "" || message == "") {
    return res.status(400).send();
  }

  try {
    await venomClient.sendLinkPreview(to, url, message);
    res.status(201).send({});
  } catch (error) {
    res.status(500).send(error);
  }
};

export { sendMessage, sendImage, sendVideo };
