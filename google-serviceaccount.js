import dotenv from "dotenv";
import { writeFileSync } from "fs";
import * as path from "path";

dotenv.config();

const jsonFile = JSON.stringify(
  {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID.replace(/\\n/g, "\n"),
    private_key: process.env.GOOGLE_PRIVATE_KEY,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: "https://accounts.google_com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
  },
  null,
  2,
);

const unEscapedJsonFile = jsonFile.replace(/\\n/g, "n");

const fileName = "google-serviceaccount.json";
writeFileSync(fileName, unEscapedJsonFile);
