import { getInfo, emojiReaction } from "./utils.js";
import {
  timeIn,
  timeOut,
  TimedInError,
  TimedOutError,
} from "./GoogleSpreadSheet.js";

export function registerListeners(app) {
  app.message("!in", timeInMessageCallback);
  app.message("!out", timeOutMessageCallback);
}

async function timeInMessageCallback({ client, payload, logger }) {
  try {
    const { name, date, time } = await getInfo(client, payload);

    await timeIn(name, date, time);
    await emojiReaction("thumbsup", client, payload);
  } catch (error) {
    logger.error(error);

    if (error instanceof TimedInError) {
      // Message slack
      console.log(error.message);
    }
  }
}

async function timeOutMessageCallback({ client, payload, logger }) {
  try {
    const { name, date, time } = await getInfo(client, payload);

    await timeOut(name, date, time);
    await emojiReaction("thumbsup", client, payload);
  } catch (error) {
    logger.error(error);

    if (error instanceof TimedInError) {
      console.log(error.message);
    } else if (e instanceof TimedOutError) {
      console.log(error.message);
    }
  }
}
