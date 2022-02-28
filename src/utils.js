export function getTimeInHash(hash, timezone) {
  const unixTime = parseInt(hash.split(".")[0]) * 1000;
  const datetime = new Date(unixTime).toLocaleString("en-US", {
    timeZone: timezone,
  });

  const [date, time] = datetime.split(", ");

  return { date, time };
}
