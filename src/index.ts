import { processLogs } from "./analyzer";
import { parseLogs } from "./parser";
import { printReport } from "./reporter";


const file = process.argv[2];

if (!file) {
  console.log("Usage: ts-node index.ts <log-file>");
  process.exit(1);
}

const logs = parseLogs(file);
const results = processLogs(logs);

printReport(results);

