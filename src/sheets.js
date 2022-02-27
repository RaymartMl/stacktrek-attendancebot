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

export async function add_time({
  date,
  timeIn,
  timeOut,
  doing_today,
  do_today,
  will_do,
}) {
  await sheet.addRow({
    Name: "john doe",
    Date: date,
    "Time-in": timeIn,
    "Time-out": timeOut,
    "What wil I do": doing_today || "",
    "What did I do": do_today || "",
    "What will I do": will_do || "",
  });
}
