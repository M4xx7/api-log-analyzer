import { EndpointResult } from "../../types";

export function generateSummary(results: EndpointResult[]): string {

    const totalRequests = results.reduce((accumulator, currResult) => {
        return accumulator + currResult.requestCount;
    }, 0);

    const totalEndpoints = results.length;

    const totalSuccessRate = results.reduce((accumulator, currResult) => {
        return accumulator + currResult.successRate;
    }, 0);

    const avgSuccessRate = totalEndpoints > 0
        ? (totalSuccessRate / totalEndpoints).toFixed(1) + "%"
        : "0%";

    return `
        <section class="summary-section">
            <h1>API Usage Report</h1>
            
            <div class="summary">
                ${generateCard("Total Requests", totalRequests)}
                ${generateCard("Endpoints", totalEndpoints)}
                ${generateCard("Average Success", avgSuccessRate)}
            </div>
        </section>
    `;
}


function generateCard(title: string, value: string | number): string {
    return `
        <div class="card">
            <h3>${title}</h3>
            <p class="card-value">${value}</p>
        </div>
    `;
}