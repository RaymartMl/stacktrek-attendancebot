import { readFile, writeFile } from "fs";
import { createInterface } from "readline";
import { google } from "googleapis";
import googleCharts from "google-charts-node";
import dotenv from "dotenv";

dotenv.config();

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const TOKEN_PATH = "token.json";

// read credentials and authorize and list majors
readFile("credentials.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  authorize(JSON.parse(content), timeIn);
});

// get the contents of credentials.json
// check if there is a token and as getNewToken if there is non
// call the callback with the auth

// 

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );

  readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

// output a url and sk to login
// get the google token
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err,
        );
      oAuth2Client.setCredentials(token);
      writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

// get a specific spreadsheet and range then logs the result
function listMajors(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_DOCUMENT_ID,
      //  table name!range
      range: "Text!A1:D",
    },
    (err, res) => {
      if (err) {
        return console.log("The Class Data!A2:E API returned an error: " + err);
      }

      const rows = res.data.values;

      if (!rows.length) {
        console.log("No data found.");
      }

      for (let row of rows) {
        console.log(row);
      }
    },
  );
}

function timeIn(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  console.log(googleCharts);
  //   const query = new google.visualization.Query(
  //     "https://docs.google.com/spreadsheets/d/1rr1ldX_YjbNlVmPGu7Vslzcf03Vof9Mh36-YWIukvmk/",
  //   );

  //   query.setQuery("select Name");
  //   query.send((a) => console.log(a));
}
