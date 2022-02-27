require("dotenv").config();
const { GoogleSpreadsheet } = require("google-spreadsheet");

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_DOCUMENT_ID);
await doc.useServiceAccountAuth({
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY,
});
await doc.loadInfo();
const sheet = doc.sheetsById.GOOGLE_SPREADSHEET_SHEET_ID;

export async function add_time({ date, time, doing_today }) {
  await sheet.addRow({
    Name: "john doe",
    Date: date,
    Time: time,
    "What wil I do": doing_today,
  });
}
