import { getTimeInHash } from "../utils.js";
import { addTimeGsheets } from "./sheets.js";

export function registerListeners(app) {
  app.shortcut("global_time_in", timeInCallback);
  app.view("time_in_modal", timeInModalCallback);
  app.shortcut("global_time_out", timeOutCallback);
  app.view("time_out_modal", timeOutModalCallback);
  app.message("!in", timeInMessageCallback);
  app.message("!out", timeOutMessageCallback);
}

async function timeInCallback({ shortcut, ack, client, logger }) {
  try {
    await ack();

    const result = await client.views.open({
      trigger_id: shortcut.trigger_id,
      view: {
        callback_id: "time_in_modal",
        type: "modal",
        title: {
          type: "plain_text",
          text: "Stacktrek Attendance Bot",
          emoji: true,
        },
        submit: {
          type: "plain_text",
          text: "Submit",
          emoji: true,
        },
        close: {
          type: "plain_text",
          text: "Cancel",
          emoji: true,
        },
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "Time-in",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: "Time will automatically log after submit.",
              emoji: true,
            },
          },
          {
            type: "divider",
          },
          {
            type: "input",
            block_id: "doingToday",
            element: {
              type: "plain_text_input",
              multiline: true,
              action_id: "doingToday",
            },
            label: {
              type: "plain_text",
              text: "What will you do today",
              emoji: true,
            },
          },
        ],
      },
    });

    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
}

async function timeInModalCallback({ body, ack, client, view, logger }) {
  try {
    await ack();

    const { user } = await client.users.info({
      user: body.user.id,
    });
    const { date, time } = getTimeInHash(view["hash"]);
    const doingToday = view.state.values.doingToday.doingToday.value;

    await addTimeGsheets({
      name: user.real_name,
      date,
      timeIn: time,
      doingToday,
    });
  } catch (error) {
    logger.error(error);
  }
}

async function timeOutCallback({ shortcut, ack, client, logger }) {
  try {
    await ack();

    const result = await client.views.open({
      trigger_id: shortcut.trigger_id,
      view: {
        callback_id: "time_out_modal",
        type: "modal",
        title: {
          type: "plain_text",
          text: "Stacktrek Attendance Bot",
          emoji: true,
        },
        submit: {
          type: "plain_text",
          text: "Submit",
          emoji: true,
        },
        close: {
          type: "plain_text",
          text: "Cancel",
          emoji: true,
        },
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "Time-Out",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: "Time will automatically log after submit.",
              emoji: true,
            },
          },
          {
            type: "divider",
          },
          {
            type: "input",
            block_id: "doToday",
            element: {
              type: "plain_text_input",
              multiline: true,
              action_id: "doToday",
            },
            label: {
              type: "plain_text",
              text: "What did you do today",
              emoji: true,
            },
          },
          {
            type: "divider",
          },
          {
            type: "input",
            block_id: "willDo",
            element: {
              type: "plain_text_input",
              multiline: true,
              action_id: "willDo",
            },
            label: {
              type: "plain_text",
              text: "What are you planning to do next",
              emoji: true,
            },
          },
          {
            type: "divider",
          },
          {
            type: "input",
            block_id: "impediments",
            element: {
              type: "plain_text_input",
              multiline: true,
              action_id: "impediments",
            },
            label: {
              type: "plain_text",
              text: "Impediments",
              emoji: true,
            },
          },
        ],
      },
    });

    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
}

async function timeOutModalCallback({ body, ack, client, view, logger }) {
  try {
    await ack();

    const { user } = await client.users.info({
      user: body.user.id,
    });
    const { date, time } = getTimeInHash(view["hash"]);
    const doToday = view.state.values.doToday.doToday.value;
    const willDo = view.state.values.willDo.willDo.value;
    const impediments = view.state.values.impediments.impediments.value;

    await addTimeGsheets({
      name: user.real_name,
      date,
      timeOut: time,
      doToday,
      willDo,
      impediments,
    });
  } catch (error) {
    logger.error(error);
  }
}

async function timeInMessageCallback({ client, payload, logger }) {
  try {
    const { user } = await client.users.info({
      user: payload.user,
    });

    const { date, time } = getTimeInHash(payload.ts);

    await addTimeGsheets({
      name: user.real_name,
      date,
      timeIn: time,
    });

    client.reactions.add({
      channel: payload.channel,
      name: "thumbsup",
      timestamp: payload.ts,
    });
  } catch (error) {
    logger.error(error);
  }
}

async function timeOutMessageCallback({ client, payload, logger, say }) {
  try {
    const { user } = await client.users.info({
      user: payload.user,
    });

    const { date, time } = getTimeInHash(payload.ts);

    await addTimeGsheets({
      name: user.real_name,
      date,
      timeOut: time,
    });

    client.reactions.add({
      channel: payload.channel,
      name: "thumbsup",
      timestamp: payload.ts,
    });
  } catch (error) {
    logger.error(error);
  }
}
