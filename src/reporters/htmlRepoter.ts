import { EndpointResult, Options } from "../types";
import { generateLeastSuccessfulEndpoints, generateLatencyChart, generateStatusCodeChart } from "./html/charts";
import { generateLayout } from "./html/layout";
import { generateSummary } from "./html/summary";


export function generateHtmlReport(results: EndpointResult[], options: Options): string {
    const body = `
        ${generateSummary(results)}
        ${generateStatusCodeChart(results, options.statusDistributionTop)}
        ${generateLeastSuccessfulEndpoints(results, options.leastSuccessfulTop)}
        ${generateLatencyChart(results, options.latencyTop)}
    `;
    return generateLayout(body);
}