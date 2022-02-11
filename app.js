const dotenv = require('dotenv')
const venom = require('venom-bot');
const express = require("express");
const app = express();
dotenv.config();
let venomClient = null;

app.use(express.json());

const verifyIfRequestIfValid = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey == '')
    return res.status(401).send();

  if (apiKey != process.env.APIKEY)
    return res.status(401).send();

  if (venomClient == null || venom == undefined)
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

app.post('/send-message', verifyIfRequestIfValid, (req, res) => {
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

app.post('/send-link-preview', verifyIfRequestIfValid, (req, res) => {
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

app.post('/send-image', verifyIfRequestIfValid, (req, res) => {
  const { to, base64, filename, description } = req.body;

  if (!to || !base64 || !filename || !description, to == '' || base64 == '' || filename == '' || description == '')
    return res.status(400).send();

  try {

    venomClient.sendFileFromBase64(to, base64, filename, description);
    res.status(201).send({});

  } catch (error) {
    res.status(500).send(error);
  }
})



// app.post('/send-video', verifyIfRequestIfValid, (req, res) => {
//   const { chatId, url, title } = req.body;

//   if (!chatId || !url || !title, chatId == '' || url == '' || title == '') {
//     return res.status(400).send();
//   }

//   try {

//     venomClient.sendMessageWithThumb('',url,title,'descrição','texto',chatId)
//     res.status(201).send({});

//   } catch (error) {
//     res.status(500).send(error);
//   }
// })

app.listen(process.env.PORT, async () => {
  console.log(`listening at the door ${process.env.PORT}`);

  await initVenon();
});

const chromiumArgs = [
  '--disable-web-security', '--no-sandbox', '--disable-web-security',
  '--aggressive-cache-discard', '--disable-cache', '--disable-application-cache',
  '--disable-offline-load-stale-cache', '--disk-cache-size=0',
  '--disable-background-networking', '--disable-default-apps', '--disable-extensions',
  '--disable-sync', '--disable-translate', '--hide-scrollbars', '--metrics-recording-only',
  '--mute-audio', '--no-first-run', '--safebrowsing-disable-auto-update',
  '--ignore-certificate-errors', '--ignore-ssl-errors', '--ignore-certificate-errors-spki-list'
];

const initVenon = async () => {
  venomClient = await venom.create({
    session: 'whatsapp-api', //name of session
    multidevice: false, // for version not multidevice use false.(default: true)
    createPathFileToken: true,
    headless: true,// Headless chrome
    disableSpins: true,//Will disable Spinnies animation, useful for containers (docker) for a better log
    disableWelcome: true, // Will disable the welcoming message which appears in the beginning
    browserArgs: chromiumArgs
  });
}