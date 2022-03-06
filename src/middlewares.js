export async function onlyDixiBot({ message, next }, name) {
  const botName = "Dixi App";
  const botId = "B034YML7NP7";

  if (
    (message.user_name === botName || message.bot_id === botId) &&
    message.attachments.some((attachment) => attachment.fallback.includes(name))
  ) {
    await next();
  }
}

export async function onlyTimeInTimeOut({ message, next }) {
  const isSubmittedStandup = message.attachments?.find((attachment) =>
    attachment.fallback.includes("submitted standup"),
  );

  const hasMention = message.attachments?.find((attachment) =>
    attachment.fallback.includes("<@"),
  );

  if (isSubmittedStandup && hasMention) {
    return next();
  }
}
