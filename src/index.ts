import { Client } from "whatsapp-web.js";
import fs from "fs";

const SESSION_FILE_PATH = "./session.json";

let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = JSON.parse(
    fs.readFileSync(SESSION_FILE_PATH, { encoding: "utf-8" })
  );
}

const client = new Client({
  // poner en false para poder dar de alta la sesión por qr, despues se puede poner en true para que no aparezca chromium
  puppeteer: { headless: true },
  session: sessionCfg,
});

client.initialize();

client.on("authenticated", (session) => {
  // console.log("AUTHENTICATED", session);
  sessionCfg = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessfull
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("qr", (qr) => {
  console.log("qr", qr);
});

client.on("ready", () => {
  console.log("Client ready");
});

client.on("message", (message) => {
  console.log(`Mensaje de: ${message.from}`);
  console.log(message.body);
  if (message.body === "!ping") {
    message.reply("pong");
  }
});

client.on("change_state", (state) => {
  console.log("CHANGE STATE", state);
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});
