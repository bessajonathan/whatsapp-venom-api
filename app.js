const dotenv = require('dotenv')
const venom = require('venom-bot');
const express = require("express");
const app = express();
dotenv.config();
let venomClient = null;

app.use(express.json());

const verifyXapiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey == '')
    res.status(401).send();

  if (apiKey != process.env.APIKEY)
    res.status(401).send();

  next();
}

const verifyIfVenonIsInjected = async (req, res, next) => {

  if (venomClient == null || venom == undefined)
    res.status(500).send({ error: 'Venom-bot not injetected' });

  next();
}

app.post('/send-message', verifyXapiKey, verifyIfVenonIsInjected, (req, res) => {
  const { to, message } = req.body;

  if (!to || !message || to == '' || message == '')
    res.status(400).send();

  if (!to.includes('@c.us'))
    res.status(400).send({
      error: {
        message: 'Phone not valid',
        example: '556100000000@c.us'
      }
    });
  try {

    venomClient.sendText(to, message);
    res.status(201).send({});

  } catch (error) {
    res.status(500).send(error);
  }
})

app.post('/send-image', verifyXapiKey, verifyIfVenonIsInjected, (req, res) => {
  const { to, base64, filename, caption } = req.body;

  if (!to || !base64 || !filename || !caption, to == '' || base64 == '' || filename == '' || caption == '')
    res.status(400).send();

  if (!to.includes('@c.us'))
    res.status(400).send({
      error: {
        message: 'Phone not valid',
        example: '556100000000@c.us'
      }
    });

  try {

    venomClient.sendFileFromBase64(to, base64, filename, caption);
    res.status(201).send({});

  } catch (error) {
    res.status(500).send(error);
  }
})

app.listen(process.env.PORT, async () => {
  console.log(`listening at the door ${process.env.PORT}`);

  await initVenon();
});

const initVenon = async () => {
  venomClient = await venom.create({
    session: 'whatsapp-api', //name of session
    multidevice: false, // for version not multidevice use false.(default: true)
    createPathFileToken: true,
    headless: true,// Headless chrome
    disableSpins: true,//Will disable Spinnies animation, useful for containers (docker) for a better log
    disableWelcome: true // Will disable the welcoming message which appears in the beginning
  });

  await venomClient.getSessionTokenBrowser();

}