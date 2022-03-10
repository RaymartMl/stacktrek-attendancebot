import dotenv from "dotenv";
import bolt from "@slack/bolt";
import { registerListeners } from "../listeners.js";
import {
  generateReceiverEvent,
  isUrlVerificationRequest,
  parseRequestBody,
} from "../utils.js";

dotenv.config();

export async function handler(event) {
  const payload = parseRequestBody(event.body, event.headers["content-type"]);

  if (isUrlVerificationRequest(payload)) {
    return {
      statusCode: 200,
      body: payload?.challenge,
    };
  }

  const slackEvent = generateReceiverEvent(payload);
  await app.processEvent(slackEvent);

  return {
    statusCode: 200,
    body: "",
  };
}

const expressReceiver = new bolt.ExpressReceiver({
  signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
  processBeforeResponse: true,
});

const app = new bolt.App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  receiver: expressReceiver,
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
