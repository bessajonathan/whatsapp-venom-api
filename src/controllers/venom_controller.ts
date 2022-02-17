import { Request, Response } from "express";
import { initVenom } from "../venom";

const rebootVenom = (req: Request, res: Response) => {
  try {
    initVenom();
    res.status(201).send({
      message: "Venon reboot,please scanner new qrcode",
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export { rebootVenom };
