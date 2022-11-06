import { join } from "node:path";
import { createClient } from "edgedb";

import { generate } from "../../src/index";

const outputDir = join(__dirname, "..", "..", "dbschema", "edgedb-zod");

export default async () => {
  console.time("Connect to EdgeDB");

  const client = createClient();

  await client.ensureConnected();

  console.timeEnd("Connect to EdgeDB");

  console.time("Generate Zod schemas");

  await generate(client, {
    target: "ts",
    outputDir: outputDir,
  });

  console.timeEnd("Generate Zod schemas");

  // Teardown
  return async () => {
    await client.close();
  };
};
