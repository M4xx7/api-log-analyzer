import { EndpointResult } from "../types";
import { generateMostUsedEndpoints, generateLeastSuccessfulEndpoints, generateLatencyChart, generateStatusCodeChart } from "./html/charts";
import { generateLayout } from "./html/layout";
import { generateSummary } from "./html/summary";


export function generateHtmlReport(results: EndpointResult[]): string {
    const body = `
        ${generateSummary(results)}
        ${generateMostUsedEndpoints(results)}
        ${generateLeastSuccessfulEndpoints(results)}
        ${generateLatencyChart(results)}
        ${generateStatusCodeChart(results)}
    `;
    return generateLayout(body);
}