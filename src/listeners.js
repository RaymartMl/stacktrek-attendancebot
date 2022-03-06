import { getInfo, emojiReaction, getMentionUserIds } from "./utils.js";
import { timeIn, timeOut } from "./GoogleSpreadSheet.js";
import { onlyDixiBot, onlyTimeInTimeOut } from "./middlewares.js";
import { subtype } from "@slack/bolt";

export function registerListeners(app) {
  app.message(subtype("bot_message"), onlyDixiBot("Time-In"), timeInCallback);
  // app.message("Time-Out", onlyDixiBot, onlyTimeInTimeOut, timeOutCallback);
  // app.message("hello", ({ message }) => console.log(message));
}

async function timeInCallback({ message, client, logger }) {
  try {
    const userIds = getMentionUserIds(message.attachments);
    const { name, date, time } = await getInfo(userIds[0], message, client);

    timeIn(name, date, time);
  } catch (error) {
    logger.error(error);
  }
}

async function timeOutCallback({ message, client, logger }) {
  try {
    const userIds = getMentionUserIds(message.attachments);
    const { name, date, time } = await getInfo(userIds[0], message, client);

    timeOut(name, date, time);
  } catch (error) {
    logger.error(error);
  }
}
