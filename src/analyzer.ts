import { stat } from "fs";
import { ApiLog, EndpointResult, Latency } from "./types";
import { userInfo } from "os";


// TODO 





// DONE

// 1 - Instead of having avg or min max time add median or even p90, p95 and so on

// 2 - replace error rate with success rate

// 3 - Add status codes

// 4 - html report:

// - start with summary table?
// - top requested endpoints (bar chart)
// - less successful endpoints (bar chart as well?)
// - latency chart - maybe horizonatll bar with 3 metrics along it
// status code distribution for each endpoint

export function processLogs(logs: ApiLog[]): EndpointResult[] {

    type Accumulator = {
        method: string;
        route: string;
        count: number;
        errorCount: number;
        statusCode: Record<number, number>;
        durations: number[];
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
                statusCode: {},
                durations: []
            });
        }

        const stat = statsMap.get(key)!;
        stat.count++;

        if (!stat.statusCode[log.status]) {
            stat.statusCode[log.status] = 0;
        }
        stat.statusCode[log.status]++;
        stat.durations.push(log.duration);

        if (isErrorStatus(log.status)) stat.errorCount++;
    }

    const results: EndpointResult[] = [];

    for (const stat of statsMap.values()) {
        results.push({
            method: stat.method,
            route: stat.route,
            requestCount: stat.count,
            successRate: getSuccessRate(stat.count, stat.errorCount),
            statusCode: getSortedStatusCodes(stat.statusCode),
            latency: getLatencyMetric(stat.durations)
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


function getSuccessRate(totalCount: number, errorCount: number): number {
    return totalCount === 0 ? 0 : 100 - ((errorCount * 100) / totalCount);
}

function getSortedStatusCodes(statusCode: Record<number, number>): Map<number, number> {
    const sortedArray = Object.entries(statusCode).sort(([, countA], [, countB]) => {
        return countA - countB
    });
    return new Map(
        sortedArray.map(([statusCodeString, count]) => [Number(statusCodeString), count])
    );
}

function getLatencyMetric(durations: number[]): Latency {

    const sortedDurations = [...durations].sort((a, b) => a - b);
    const len = sortedDurations.length;

    if (len === 0) return { max: 0, median: 0, p95: 0 };

    const mid = Math.floor(len / 2);
    const median = len % 2 !== 0
        ? sortedDurations[mid]
        : (sortedDurations[mid - 1] + sortedDurations[mid]) / 2;

    const maxDur = sortedDurations[len - 1];
    const p95Index = Math.max(0, Math.floor(0.95 * len) - 1);

    return {
        max: maxDur,
        median: median,
        p95: sortedDurations[p95Index]
    }
}
