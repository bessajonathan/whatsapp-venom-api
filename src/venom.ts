import { Whatsapp, create } from "venom-bot";

let venomClient: Whatsapp;
let base64QrCode: string;
let status: string;

const chromiumArgs = [
  "--disable-web-security",
  "--no-sandbox",
  "--disable-web-security",
  "--aggressive-cache-discard",
  "--disable-cache",
  "--disable-application-cache",
  "--disable-offline-load-stale-cache",
  "--disk-cache-size=0",
  "--disable-background-networking",
  "--disable-default-apps",
  "--disable-extensions",
  "--disable-sync",
  "--disable-translate",
  "--hide-scrollbars",
  "--metrics-recording-only",
  "--mute-audio",
  "--unhandled-rejections=strict",
  "--no-first-run",
  "--safebrowsing-disable-auto-update",
  "--ignore-certificate-errors",
  "--ignore-ssl-errors",
  "--ignore-certificate-errors-spki-list",
];

const initVenom = async () => {
  base64QrCode = "https://fastqrcode.com/assets/img/qrcode_placeholder.svg";
  venomClient = await create(
    //session
    "whatsapp-api", //Pass the name of the client you want to start the bot
    //catchQR
    (base64Qrimg: string) => {
      base64QrCode = base64Qrimg;
    },
    // statusFind
    (statusSession: string) => {
      if (statusSession == "qrReadSuccess") {
        base64QrCode =
          "https://imagepng.org/wp-content/uploads/2019/12/check-icone-300x300.png";
        status = "Connected";
        return;
      }

      status = statusSession;
    },
    // options
    {
      multidevice: false, // for version not multidevice use false.(default: true)
      headless: true, // Headless chrome
      devtools: false, // Open devtools by default
      useChrome: true, // If false will use Chromium instance
      logQR: false, // Logs QR automatically in terminal
      browserArgs: chromiumArgs, //Original parameters  ---Parameters to be added into the chrome browser instance
      disableSpins: true, // Will disable Spinnies animation, useful for containers (docker) for a better log
      disableWelcome: true, // Will disable the welcoming message which appears in the beginning
      updatesLog: false, // Logs info updates automatically in terminal
    }
  );
};

export { initVenom, venomClient, base64QrCode, status };
