import { add_time } from "./sheets.js";

export function registerListeners(app) {
  app.shortcut("global_time_in", timeInCallback);
  app.view("time_in_modal", timeInModalCallback);
  app.shortcut("global_time_out", timeOutCallback);
  app.view("time_out_modal", timeOutModalCallback);
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

async function timeInModalCallback({ ack, view, logger }) {
  try {
    await ack();

    const datetime = new Date(
      parseInt(view["hash"].split(".")[0]) * 1000,
    ).toLocaleString();
    const date = datetime.slice(0, 10);
    const timeIn = datetime.slice(12);

    const doing_today = view.state.values.doingToday.doingToday.value;

    await add_time({ date, time: timeIn, doing_today });
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
        ],
      },
    });

    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
}

async function timeOutModalCallback({ ack, view, logger }) {
  try {
    await ack();

    const datetime = new Date(
      parseInt(view["hash"].split(".")[0]) * 1000,
    ).toLocaleString();
    const date = datetime.slice(0, 10);
    const timeOut = datetime.slice(12);

    const do_today = view.state.values.doToday.doToday.value;
    const will_do = view.state.values.willDo.willDo.value;

    await add_time({ date, time: timeOut, do_today, will_do });
  } catch (error) {
    logger.error(error);
  }
}
