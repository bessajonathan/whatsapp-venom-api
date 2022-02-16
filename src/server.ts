import { config } from "dotenv";
import express from "express";
import {initVenom} from "./venom";
import routes from "./routes";

config();
const app = express();
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT, async () => {
  console.log(`listening at the door ${process.env.PORT}`);

  await initVenom();
});
