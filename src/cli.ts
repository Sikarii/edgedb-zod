import * as path from "node:path";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { createClient } from "edgedb";

import { generate } from "./index";
import { getProjectRoot } from "./lib/utils";

yargs
  .command(
    "*",
    "Generate Zod schemas from EdgeDB",
    {},
    async (argv) => {
      const target = argv.target as "ts" | "mts" ?? "ts";
      const relativeDir = argv.outputDir as string ?? "dbschema/edgedb-zod";

      const projectRoot = await getProjectRoot();
      if (!projectRoot) {
        throw new Error(
          "Failed to detect project root.\nRun this command inside an EdgeDB project directory",
        );
      }

      const outputDir = path.join(projectRoot, relativeDir);

      const client = createClient();

      const options = {
        target: target,
        outputDir: outputDir,
      };

      const result = await generate(client, options);

      if (result.warnings.length > 0) {
        console.warn(result.warnings
          .map((msg) => `⚠️ ${msg}`)
          .join("\n"),
        );
      }

      if (!result.success) {
        console.error("❌ Failed generating schemas");
        return console.error(result.errors.join("\n"));
      }

      return console.log("✔️ Success generating schemas");
    },
  )
  .option("target", {
    type: "string",
    choices: ["ts", "mts"],
  })
  .parse(hideBin(process.argv));
