import { getInfo, emojiReaction, getMentionUserIds } from "./utils.js";
import { timeIn, timeOut } from "./GoogleSpreadSheet.js";
import { onlyDixiBot } from "./middlewares.js";
import { subtype } from "@slack/bolt";

export function registerListeners(app) {
  app.message(subtype("bot_message"), onlyDixiBot("Time-in"), timeInCallback);
  app.message(subtype("bot_message"), onlyDixiBot("Time-out"), timeOutCallback);
}

async function timeInCallback({ message, client, logger }) {
  try {
    const userIds = getMentionUserIds(message.attachments);
    const { name, date, time } = await getInfo(userIds[0], message, client);

    timeIn(name, date, time);
    await emojiReaction("thumbsup", client, message);
  } catch (error) {
    logger.error(error);
  }
}

async function timeOutCallback({ message, client, logger }) {
  try {
    const userIds = getMentionUserIds(message.attachments);
    const { name, date, time } = await getInfo(userIds[0], message, client);

    timeOut(name, date, time);
    await emojiReaction("thumbsup", client, message);
  } catch (error) {
    logger.error(error);
  }
}
