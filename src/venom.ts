import { Whatsapp, create } from "venom-bot";
let venomClient: Whatsapp;

const chromiumArgs = [
  '--disable-web-security', '--no-sandbox', '--disable-web-security',
  '--aggressive-cache-discard', '--disable-cache', '--disable-application-cache',
  '--disable-offline-load-stale-cache', '--disk-cache-size=0',
  '--disable-background-networking', '--disable-default-apps', '--disable-extensions',
  '--disable-sync', '--disable-translate', '--hide-scrollbars', '--metrics-recording-only',
  '--mute-audio', '--no-first-run', '--safebrowsing-disable-auto-update',
  '--ignore-certificate-errors', '--ignore-ssl-errors', '--ignore-certificate-errors-spki-list'
];

const initVenom = async () => {
  try {
    venomClient = await create({
      session: 'whatsapp-api', //name of session
      multidevice: false, // for version not multidevice use false.(default: true)
      createPathFileToken: true,
      headless: true,// Headless chrome
      disableSpins: true,//Will disable Spinnies animation, useful for containers (docker) for a better log
      disableWelcome: true, // Will disable the welcoming message which appears in the beginning
      browserArgs: chromiumArgs
    });
  } catch (error) {
    console.log(error);
  }

}

export {
  initVenom,
  venomClient
};