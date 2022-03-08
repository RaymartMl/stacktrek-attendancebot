import dotenv from "dotenv";
import bolt from "@slack/bolt";
import { registerListeners } from "../listeners.js";

dotenv.config();

const app = new bolt.App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  port: process.env.PORT || 3000,
});

(async () => {
  try {
    await app.start();
    registerListeners(app);
    console.log("⚡️ Bolt app is running!");
  } catch (error) {
    console.log(`Could not start the slack bot ${error}`);
    process.exit(1);
  }
})();
