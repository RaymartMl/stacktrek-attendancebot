import { getInfo, emojiReaction, getMentionUserIds } from "./utils.js";
import {
  TimedInError,
  TimedOutError,
  timeIn,
  timeOut,
} from "./GoogleSpreadSheet.js";
import { onlyDixiBot } from "./middlewares.js";
import { subtype } from "@slack/bolt";
import { debugListeners } from "./debugListeners.js";

export function registerListeners(app) {
  app.message(subtype("bot_message"), onlyDixiBot("Time-in"), timeInCallback);
  app.message(subtype("bot_message"), onlyDixiBot("Time-out"), timeOutCallback);
  app.event("app_mention", appMentionCallback);

  // debugListeners(app);
}

async function timeInCallback({ message, client, logger }) {
  try {
    const userIds = getMentionUserIds(message.attachments);
    const { name, date, time } = await getInfo(userIds[0], message, client);

    await timeIn(name, date, time);
    await emojiReaction("thumbsup", client, message);
  } catch (error) {
    logger.error(error);
    if (error instanceof TimedInError) {
      await emojiReaction("x", client, message);
    }
  }
}

async function timeOutCallback({ message, client, logger }) {
  try {
    const userIds = getMentionUserIds(message.attachments);
    const { name, date, time } = await getInfo(userIds[0], message, client);

    await timeOut(name, date, time);
    await emojiReaction("thumbsup", client, message);
  } catch (error) {
    logger.error(error);
    if (error instanceof TimedInError || error instanceof TimedOutError) {
      await emojiReaction("x", client, message);
    }
  }
}

async function appMentionCallback({ message, say, logger }) {
  try {
    console.log("here");
    await say(`<@${message.user}> Hello there!`);
  } catch (error) {
    logger.error(error);
  }
}
