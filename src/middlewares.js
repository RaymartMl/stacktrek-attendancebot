export function onlyDixiBot(name) {
  return async ({ message, next }) => {
    const hasName = message.attachments?.some((attachment) =>
      attachment.fallback.includes(name),
    );

    const isSubmittedStandup = message.attachments?.some((attachment) =>
      attachment.fallback.includes("submitted standup"),
    );

    if (message.username === "Dixi App" && hasName && isSubmittedStandup) {
      await next();
    }
  };
}
