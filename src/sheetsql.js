import { Database } from "sheetsql";

const db = new Database({
  db: "1rr1ldX_YjbNlVmPGu7Vslzcf03Vof9Mh36-YWIukvmk",
  table: "Sheet4", // optional, default = Sheet1
  keyFile: "./google-serviceaccount.json",
  cacheTimeoutMs: 5000, // optional, default = 5000
});

// load schema and data from google spreadsheet
await db.load();

// insert multiple documents
// let docs = await db.insert([
//   {
//     Name: "joway",
//   },
// ]);

// // find documents and update them
// docs = await db.update(
//   {
//     name: "joway",
//   },
//   {
//     age: 100,
//   },
// );

// // find documents
const docs = await db.find({
  Name: "Raymart Balaguer",
  Date: "3/3/2022",
});
console.log(docs);

// // find all documents
// docs = await db.find({});

// // find documents and remove them
// docs = await db.remove({
//   name: "joway",
// });
