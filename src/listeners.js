import { getInfo, emojiReaction } from "./utils.js";
import {
  timeIn,
  timeOut,
  TimedInError,
  TimedOutError,
} from "./GoogleSpreadSheet.js";

export function registerListeners(app) {
  app.message("in", timeInMessageCallback);
  app.message("out", timeOutMessageCallback);
}

async function timeInMessageCallback({
  client,
  payload,
  message,
  logger,
  say,
}) {
  try {
    const { name, date, time } = await getInfo(client, payload);

    await timeIn(name, date, time);
    client.chat.postMessage({
      blocks: [
        {
          type: "context",
          elements: [
            {
              type: "image",
              image_url:
                "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
              alt_text: "cute cat",
            },
            {
              type: "mrkdwn",
              text: `<@${message.user}> just timed in.`,
            },
          ],
        },
      ],
      channel: "C0354HTU8SU",
      text: `<@${message.user}> just timed in.`,
    });

    await emojiReaction("thumbsup", client, payload);
  } catch (error) {
    if (error instanceof TimedInError) {
      say(error.message);
    } else {
      logger.error(error);
    }
  }
}

async function timeOutMessageCallback({
  client,
  payload,
  message,
  logger,
  say,
}) {
  try {
    const { name, date, time } = await getInfo(client, payload);

    await timeOut(name, date, time);

    client.chat.postMessage({
      blocks: [
        {
          type: "context",
          elements: [
            {
              type: "image",
              image_url:
                "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
              alt_text: "cute cat",
            },
            {
              type: "mrkdwn",
              text: `<@${message.user}> just time out.`,
            },
          ],
        },
      ],
      channel: "C0354HTU8SU",
      text: `<@${message.user}> just time out.`,
    });

    await emojiReaction("thumbsup", client, payload);
  } catch (error) {
    if (error instanceof TimedInError) {
      say(error.message);
    } else if (error instanceof TimedOutError) {
      say(error.message);
    } else {
      logger.error(error);
    }
  }
}
