import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
import { venomClient } from "../venom";
config();

const venomInjected = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (venomClient == null || venomClient == undefined)
    return res.status(500).send({ error: "Venom-bot not injetected" });

  next();
};

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey == "") return res.status(401).send();

  if (apiKey != process.env.APIKEY) return res.status(401).send();

  next();
};

const validadeNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { to } = req.body;

  if (to == null || to == undefined || to == "") {
    return res.status(400).send({
      error: {
        message: "Phone not valid",
        example: "556100000000@c.us",
      },
    });
  }

  if (to.length != 18)
    return res.status(400).send({
      error: {
        message: "Phone not valid",
        example: "556100000000@c.us",
      },
    });

  if (!to.includes("@c.us"))
    return res.status(400).send({
      error: {
        message: "Phone not valid",
        example: "556100000000@c.us",
      },
    });

  next();
};

export { venomInjected, isAuth, validadeNumber };
