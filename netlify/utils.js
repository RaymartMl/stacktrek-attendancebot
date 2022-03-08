export async function getInfo(userId, message, client) {
  const user = await getUser(userId, client);
  const { date, time } = getDateTime(message.ts, user.tz);

  return { name: user.real_name, date, time };
}

export async function getUser(userId, client) {
  const { user } = await client.users.info({
    user: userId,
  });

  return user;
}

export async function emojiReaction(name, client, message) {
  await client.reactions.add({
    name,
    channel: message.channel,
    timestamp: message.ts,
  });
}

export function getDateTime(hash, timezone) {
  const unixTime = parseInt(hash.split(".")[0]) * 1000;
  const datetime = new Date(unixTime).toLocaleString("en-US", {
    timeZone: timezone,
  });

  const [date, time] = datetime.split(", ");

  return { date, time };
}

export function getMentionUserIds(attachments) {
  return attachments.map((attachment) => {
    const { fallback: message } = attachment;

    // get attachments that has the mention pattern <@ID>
    if (message.includes("<@")) {
      // assume that message has only one mention and it is the first word
      const mention = message.split(" ")[0];
      const userId = mention.substring(2, mention.length - 1);

      return userId;
    }
  });
}

export function parseRequestBody(stringBody, contentType) {
  try {
    if (!stringBody) {
      return "";
    }

    let result = {};

    if (contentType && contentType === "application/json") {
      return JSON.parse(stringBody);
    }

    let keyValuePairs = stringBody.split("&");
    keyValuePairs.forEach(function (pair) {
      let individualKeyValuePair = pair.split("=");
      result[individualKeyValuePair[0]] = decodeURIComponent(
        individualKeyValuePair[1] || "",
      );
    });
    return JSON.parse(JSON.stringify(result));
  } catch {
    return "";
  }
}

export function generateReceiverEvent(payload) {
  return {
    body: payload,
    ack: async (response) => {
      return {
        statusCode: 200,
        body: response ?? "",
      };
    },
  };
}

export function isUrlVerificationRequest(payload) {
  if (payload && payload.type && payload.type === "url_verification") {
    return true;
  }
  return false;
}
