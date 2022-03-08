import { timeIn, TimedInError } from "./GoogleSpreadSheet.js";
import { emojiReaction, getInfo } from "./utils.js";

export function debugListeners(app) {
  app.message("normal-debug", normalDebugCallback);
  app.message("error-debug", errorDebugCallback);
  app.message("time-in-debug", timeInDebugCallback);
}

async function normalDebugCallback({ message, client, logger, say }) {
  try {
    say("hello");
    await emojiReaction("thumbsup", client, message);
  } catch (error) {
    logger.error(error);
  }
}

async function errorDebugCallback({ logger }) {
  try {
    throw new Error("Debugging Error");
  } catch (error) {
    logger.error(error);
  }
}

async function timeInDebugCallback({ message, client, logger }) {
  try {
    const { name, date, time } = await getInfo(message.user, message, client);

    await timeIn(name, date, time);
    await emojiReaction("thumbsup", client, message);
  } catch (error) {
    logger.error(error);
    if (error instanceof TimedInError) {
      await emojiReaction("x", client, message);
    }
  }
}
