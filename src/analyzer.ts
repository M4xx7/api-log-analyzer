import { stat } from "fs";
import { ApiLog, Duration, EndpointResult } from "./types";
import { count } from "console";


// TODO 

// 1 - Instead of having avg or min max time add median or even p90, p95 and so on

// 2 - replace error rate with success rate

// 3 - Add distribution of status codes

// 4 - show some table of slowest, least successfull or most requested endpoints

// 5 - add nice output in a form of html




export function processLogs(logs: ApiLog[]): EndpointResult[] {

    type Accumulator = {
        method: string;
        route: string;
        count: number;
        errorCount: number;
        minDuration: number;
        maxDuration: number;
        totalDuration: number;
    }

    const statsMap = new Map<string, Accumulator>();

    for (const log of logs) {
        const normalizedPath = normalizePath(log.path);
        const key = `${log.method} ${normalizedPath}`;

        if (!statsMap.has(key)) {
            statsMap.set(key, {
                method: log.method,
                route: normalizedPath,
                count: 0,
                errorCount: 0,
                minDuration: Infinity,
                maxDuration: -Infinity,
                totalDuration: 0
            });
        }

        const stat = statsMap.get(key)!;
        stat.count++;
        stat.totalDuration += log.duration;

        if (log.duration < stat.minDuration) stat.minDuration = log.duration;
        if (log.duration > stat.maxDuration) stat.maxDuration = log.duration;

        if (isErrorStatus(log.status)) stat.errorCount++;
    }

    const results: EndpointResult[] = [];

    for (const stat of statsMap.values()) {
        results.push({
            method: stat.method,
            route: stat.route,
            requestCount: stat.count,
            errorRate: getErrorRate(stat.count, stat.errorCount),
            duration: {
                min: stat.minDuration,
                max: stat.maxDuration,
                average: getAverageDuration(stat.totalDuration, stat.count)
            }
        })

    }

    return results;
}

function normalizePath(path: string): string {
    return path.replace(/\d+/g, ":id");
}


function isErrorStatus(statusCode: number): boolean {
    return statusCode >= 400;
}

function getErrorRate(totalCount: number, errorCount: number): number {
    return totalCount === 0 ? 0 : (errorCount * 100) / totalCount;
}

function getAverageDuration(totalDuration: number, requestCount: number): number {
    return requestCount === 0 ? 0 : totalDuration / requestCount;
}
