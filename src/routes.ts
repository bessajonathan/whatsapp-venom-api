import { config } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { venomClient } from "./venom";
const routes = express.Router();
config();

const verifyIfRequestIfValid = async (req: Request, res: Response, next: NextFunction) => {

    const apiKey = req.headers['x-api-key'];
  
    if (!apiKey || apiKey == '')
      return res.status(401).send();
  
    if (apiKey != process.env.APIKEY)
      return res.status(401).send();
  
    if (venomClient == null || venomClient == undefined)
      return res.status(500).send({ error: 'Venom-bot not injetected' });
  
    const { to } = req.body;
  
    if (to.length != 18)
      return res.status(400).send({
        error: {
          message: 'Phone not valid',
          example: '556100000000@c.us'
        }
      });
  
  
    if (!to.includes('@c.us'))
      return res.status(400).send({
        error: {
          message: 'Phone not valid',
          example: '556100000000@c.us'
        }
      });
  
    next();
  }
  
  routes.post('/send-message', verifyIfRequestIfValid, (req: Request, res: Response) => {
    const { to, message } = req.body;
  
    if (!to || !message || to == '' || message == '') {
      res.status(400).send();
      return;
    }
  
  
    try {
  
      venomClient.sendText(to, message);
      res.status(201).send({});
  
    } catch (error) {
      res.status(500).send(error);
    }
  })
  
  routes.post('/send-link-preview', verifyIfRequestIfValid, (req: Request, res: Response) => {
    const { to, link_preview, message } = req.body;
  
    if (!to || !message || to == '' || message == '' || !link_preview || link_preview == '') {
      res.status(400).send();
      return;
    }
  
  
    try {
  
      venomClient.sendLinkPreview(to, link_preview, message);
      res.status(201).send({});
  
    } catch (error) {
      res.status(500).send(error);
    }
  })
  
  routes.post('/send-image', verifyIfRequestIfValid, (req: Request, res: Response) => {
    const { to, base64, filename, description } = req.body;
  
    if (to == '' || base64 == '' || filename == '' || description == '')
      return res.status(400).send();
  
    try {
  
      venomClient.sendFileFromBase64(to, base64, filename, description);
      res.status(201).send({});
  
    } catch (error) {
      res.status(500).send(error);
    }
  })
  
  
  //await multiDevice support
  // routes.post('/send-video', verifyIfRequestIfValid, (req: Request, res: Response) => {
  //   const { chatId, url, title } = req.body;
  
  //   if (chatId == '' || url == '' || title == '') {
  //     return res.status(400).send();
  //   }
  
  //   try {
  
  //     venomClient.sendLinkPreview(chatId, url, title);
  //     res.status(201).send({});
  
  //   } catch (error) {
  //     res.status(500).send(error);
  //   }
  // })

  export default routes;

