import dotenv from "dotenv";
import { GoogleSpreadsheet } from "google-spreadsheet";

dotenv.config();

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_DOCUMENT_ID);
await doc.useServiceAccountAuth({
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY,
});
await doc.loadInfo();
const sheet = doc.sheetsById[process.env.GOOGLE_SPREADSHEET_SHEET_ID];

export async function addTimeGsheets({
  name,
  date,
  timeIn,
  timeOut,
  doingToday,
  doToday,
  willDo,
  impediments,
}) {
  await sheet.addRow({
    Name: name,
    Date: date,
    "Time-in": timeIn,
    "Time-out": timeOut,
    "What wil I do": doingToday,
    "What did I do": doToday,
    "What will I do": willDo,
    Impediments: impediments,
  });
}
