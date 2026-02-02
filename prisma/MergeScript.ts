import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.join(__dirname, "schema");
const schemaFile = path.join(__dirname, "schema.prisma");

const headers = `

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
datasource db {
  provider = "postgresql"

}
`;

const modelFiles = fs.readdirSync(modelsDir).filter((file) => file.endsWith(".prisma"));
let models = "";
for (const file of modelFiles) {
    const content = fs.readFileSync(path.join(modelsDir, file), "utf-8");
    models += content + "\n";

}

fs.writeFileSync(schemaFile, headers + "\n" + models);