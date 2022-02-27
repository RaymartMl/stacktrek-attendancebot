export function getTimeInHash(hash) {
  const unixTime = parseInt(hash.split(".")[0]) * 1000;
  const datetime = new Date(unixTime).toLocaleString();

  const date = datetime.slice(0, 10);
  const time = datetime.slice(12);

  return { date, time };
}
