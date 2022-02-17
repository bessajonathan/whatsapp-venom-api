import { config } from "dotenv";
import express from "express";
import { initVenom } from "./venom";
import routes from "./routes";

config();
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(routes);
app.set("view engine", "ejs");
app.set("views", "./src/views");

app.listen(process.env.PORT, async () => {
  console.log(`listening at the door ${process.env.PORT}`);

  await initVenom();
});
