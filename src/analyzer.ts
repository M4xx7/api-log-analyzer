import { ApiLog } from "./types";


export function analyzeLogs(logs: ApiLog[]) {

    const map = new Map<string, number>();

    for (const log of logs) {
        const key = `${log.method} ${normalizePath(log.path)}`;
        map.set(key, (map.get(key) || 0) + 1);
    }

    return map;

}

function normalizePath(path: string): string {
    return path.replace(/\d+/g, ":id");
}