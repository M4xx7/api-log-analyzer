import { ApiLog } from "./types";
import fs from "fs";

export function parseLogs(filePath: string): ApiLog[] {
    const file = fs.readFileSync(filePath, "utf-8");

    return file
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}