import dotenv from "dotenv";
import { Database } from "sheetsql";
import path from "path";
// require("dotenv").config();
// const { Database } = require("sheetsql");

dotenv.config();
// console.log("Google =====================================", import.meta.url);
// console.log(process.env.LAMBDA_TASK_ROOT);

export class GoogleSpreadsheet {
  #db;
  constructor() {
    this.#db = new Database({
      db: process.env.GOOGLE_SPREADSHEET_DOCUMENT_ID,
      table: process.env.GOOGLE_SPREADSHEET_SHEET_NAME,
      keyFile: path.resolve("google/google-serviceaccount.json"),
      cacheTimeoutMs: 5000,
    });
    this.#db.load();
  }

  async addRecord(recordObject) {
    await this.#db.insert([recordObject]);
  }

  async findRecord(findObject) {
    const row = await this.#db.find(findObject);
    return row;
  }
  async updateRecord(findObject, updateObject) {
    await this.#db.update(findObject, updateObject);
  }
}

const gsheets = new GoogleSpreadsheet();

export async function timeIn(name, date, time) {
  const record = await gsheets.findRecord({
    Name: name,
    Date: date,
  });

  if (record.length) {
    throw new TimedInError();
  }

  await gsheets.addRecord({
    Name: name,
    Date: date,
    "Time-in": time,
  });
}

export async function timeOut(name, date, time) {
  const record = await gsheets.findRecord({
    Name: name,
    Date: date,
  });

  if (!record.length) {
    throw new TimedInError();
  }

  if (record[0]["Time-out"]) {
    throw new TimedOutError();
  }

  await gsheets.updateRecord(
    {
      Name: name,
      Date: date,
    },
    {
      "Time-out": time,
    },
  );
}

export class TimedInError extends Error {
  constructor(message = "User Already has a Time In record") {
    super(message);
    this.name = "ValidationError";
  }
}

export class TimedOutError extends Error {
  constructor(message = "User Already has a Time Out record") {
    super(message);
    this.name = "ValidationError";
  }
}
