import { EndpointResult, Options } from "../types";
import { generateMostUsedEndpoints, generateLeastSuccessfulEndpoints, generateLatencyChart, generateStatusCodeChart } from "./html/charts";
import { generateLayout } from "./html/layout";
import { generateSummary } from "./html/summary";


export function generateHtmlReport(results: EndpointResult[], options: Options): string {
    const body = `
        ${generateSummary(results)}
        ${generateMostUsedEndpoints(results, options.usageTop)}
        ${generateLeastSuccessfulEndpoints(results, options.leastSuccessfulTop)}
        ${generateLatencyChart(results, options.latencyTop)}
        ${generateStatusCodeChart(results, options.statusDistributionTop)}
    `;
    return generateLayout(body);
}