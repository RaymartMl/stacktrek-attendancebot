export async function getInfo(client, payload) {
  const user = await getUser(client, payload);
  const { date, time } = getDateTime(payload.ts, user.tz);

  return { name: user.real_name, date, time };
}

export async function getUser(client, payload) {
  const { user } = await client.users.info({
    user: payload.user,
  });
  return user;
}

export function getDateTime(hash, timezone) {
  const unixTime = parseInt(hash.split(".")[0]) * 1000;
  const datetime = new Date(unixTime).toLocaleString("en-US", {
    timeZone: timezone,
  });

  const [date, time] = datetime.split(", ");

  return { date, time };
}

export async function emojiReaction(name, client, payload) {
  await client.reactions.add({
    name,
    channel: payload.channel,
    timestamp: payload.ts,
  });
}
