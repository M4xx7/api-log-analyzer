import { EndpointResult } from "./types";

// ANSI Color Codes for terminal styling
const colors = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    dim: "\x1b[2m",
};

export function printReport(results: EndpointResult[]) {
    console.log(`\n${colors.cyan}API Log Analysis Report${colors.reset}\n`);

    // 1. Find the longest route string so we can align the columns perfectly
    const maxRouteLength = Math.max(...results.map(r => r.route.length), 10);

    // 2. Print Header
    console.log(
        "METHOD".padEnd(8) +
        "ROUTE".padEnd(maxRouteLength + 4) +
        "REQS".padEnd(8) +
        "ERRORS".padEnd(10) +
        "AVG(ms)".padEnd(10) +
        "MIN/MAX(ms)"
    );
    console.log(colors.dim + "-".repeat(maxRouteLength + 55) + colors.reset);

    // 3. Print Rows
    for (const stat of results) {
        // Color code methods
        let methodColor = colors.green;
        if (stat.method === "POST" || stat.method === "PUT") methodColor = colors.yellow;
        if (stat.method === "DELETE") methodColor = colors.red;

        const methodStr = `${methodColor}${stat.method.padEnd(8)}${colors.reset}`;
        const routeStr = stat.route.padEnd(maxRouteLength + 4);
        const reqStr = stat.requestCount.toString().padEnd(8);
        
        // Highlight errors in red if they exist
        const errorStrRaw = `${stat.errorRate.toFixed(1)}%`;
        const errorStr = stat.errorRate > 0 
            ? `${colors.red}${errorStrRaw.padEnd(10)}${colors.reset}` 
            : errorStrRaw.padEnd(10);

        const avgStr = Math.round(stat.duration.average).toString().padEnd(10);
        const minMaxStr = `${colors.dim}${stat.duration.min} / ${stat.duration.max}${colors.reset}`;

        console.log(`${methodStr}${routeStr}${reqStr}${errorStr}${avgStr}${minMaxStr}`);
    }
    console.log("\n");
}
