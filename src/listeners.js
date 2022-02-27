const { add_time } = require("./sheets");

module.exports.registerListeners = (app) => {
  app.shortcut("global_time_in", timeInCallback);
  app.view("time_in_modal", timeInModalCallback);
  app.shortcut("global_time_out", timeOutCallback);
  app.view("time_out_modal", timeOutModalCallback);
};

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
    const time = datetime.slice(12);

    const doing_today = view.state.values.doingToday.doingToday.value;

    await add_time({ date, time, doing_today });
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
              text: "Time-out",
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
              text: "What did you do today?",
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

    const time = new Date(
      parseInt(view["hash"].split(".")[0]) * 1000,
    ).toLocaleString();
    const doing_today = view.state.values.doToday.doToday.value;

    console.log(time);
    console.log(doing_today);

    // await add_time(time, doing_today);
  } catch (error) {
    logger.error(error);
  }
}
