import { EndpointResult } from "./types";

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

    const maxRouteLength = Math.max(...results.map(r => r.route.length), 10);

    console.log(
        "METHOD".padEnd(8) +
        "ROUTE".padEnd(maxRouteLength + 4) +
        "REQS".padEnd(8) +
        "SUCCESS %".padEnd(14) +
        "MEDIAN".padEnd(10) +
        "p95".padEnd(10) +
        "MAX".padEnd(10) +
        "STATUS CODES"
    );
    console.log(colors.dim + "-".repeat(maxRouteLength + 80) + colors.reset);

    for (const stat of results) {
        let methodColor = colors.green;
        if (stat.method === "POST" || stat.method === "PUT") methodColor = colors.yellow;
        if (stat.method === "DELETE") methodColor = colors.red;

        const methodStr = `${methodColor}${stat.method.padEnd(8)}${colors.reset}`;
        const routeStr = stat.route.padEnd(maxRouteLength + 4);
        const reqStr = stat.requestCount.toString().padEnd(8);
        
        let successColor = colors.green;
        if (stat.successRate < 90) successColor = colors.red;
        else if (stat.successRate < 100) successColor = colors.yellow;

        const successStrRaw = `${stat.successRate.toFixed(1)}%`;
        const successStr = `${successColor}${successStrRaw.padEnd(14)}${colors.reset}`;

        const medianStr = `${Math.round(stat.latency.median)}ms`.padEnd(10);
        const p95Str = `${Math.round(stat.latency.p95)}ms`.padEnd(10);
        
        const maxRaw = `${Math.round(stat.latency.max)}ms`;
        const maxStr = `${colors.dim}${maxRaw.padEnd(10)}${colors.reset}`;

        const statusCodesFormatted = Array.from(stat.statusCode.entries())
            .map(([code, count]) => {
                let codeColor = colors.reset;
                if (code >= 200 && code < 300) codeColor = colors.green;
                else if (code >= 400 && code < 500) codeColor = colors.yellow;
                else if (code >= 500) codeColor = colors.red;
                
                return `${codeColor}${code}${colors.dim}:${count}${colors.reset}`;
            })
            .join(", ");

        const statusCodeStr = `[ ${statusCodesFormatted} ]`;

        console.log(`${methodStr}${routeStr}${reqStr}${successStr}${medianStr}${p95Str}${maxStr}${statusCodeStr}`);
    }
    console.log("\n");
}