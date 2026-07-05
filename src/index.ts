import { analyzeLogs } from "./analyzer";
import { parseLogs } from "./parser";


const file = process.argv[2];

if (!file) {
    console.log("Usage: ts-node index.ts <log-file>");
    process.exit(1);
}

const logs = parseLogs(file);
const result = analyzeLogs(logs); 

console.log("\nAPI Usage Report\n");

for (const [endpoint, count] of result.entries()) {
  console.log(`${endpoint} → ${count} calls`);
}