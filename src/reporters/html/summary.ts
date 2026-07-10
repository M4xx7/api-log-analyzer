import { EndpointResult } from "../../types";

export function generateSummary(results: EndpointResult[]): string {

    const totalEndpoints = results.length;
    
    const totalSuccessRate = results.reduce((accumulator, currResult) => {
        return accumulator + currResult.successRate;
    }, 0);

    const avgSuccessRate = totalEndpoints > 0
        ? (totalSuccessRate / totalEndpoints).toFixed(1) + "%"
        : "0%";

    const totalRequests = results.reduce((accumulator, currResult) => {
        return accumulator + currResult.requestCount;
    }, 0);


    return `
        <section class="summary-section">
            <h1 class="report-title">API Usage Report</h1>
            
            <div class="summary">
                ${generateStat("Endpoints", totalEndpoints)}
                ${generateStat("Average Success", avgSuccessRate)}
                ${generateStat("Total Requests", totalRequests)}
            </div>
        </section>
    `;
}


function generateStat(title: string, value: string | number): string {
    return `
        <div class="stat">
            <h3>${title}</h3>
            <p class="stat-value">${value}</p>
        </div>
    `;
}