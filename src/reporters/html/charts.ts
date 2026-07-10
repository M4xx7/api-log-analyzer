import { EndpointResult } from "../../types";


export function generateMostUsedEndpoints(results: EndpointResult[], option: number): string {
    const topEndpoints = [...results]
        .sort((a, b) => b.requestCount - a.requestCount)
        .slice(0, option);

    return renderChartHtml("topEndpointsChart", "Most Used Endpoints", {
        type: 'bar',
        data: {
            labels: topEndpoints.map(e => `${e.method} ${e.route}`),
            datasets: [{
                label: "Total Requests",
                data: topEndpoints.map(e => e.requestCount),
                backgroundColor: "rgba(124, 58, 237, 0.8)", 
                borderColor: "rgba(124, 58, 237, 1)",
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: getDarkThemeOptions()
    });
}

export function generateLeastSuccessfulEndpoints(results: EndpointResult[], option: number): string {
    const bottomEndpoints = [...results]
        .sort((a, b) => a.successRate - b.successRate)
        .slice(0, option);

    return renderChartHtml("leastSuccessfulChart", "Least Successful Endpoints", {
        type: 'bar',
        data: {
            labels: bottomEndpoints.map(e => `${e.method} ${e.route}`),
            datasets: [{
                label: "Success Rate (%)",
                data: bottomEndpoints.map(e => e.successRate),
                backgroundColor: "rgba(244, 63, 94, 0.8)", 
                borderColor: "rgba(244, 63, 94, 1)",
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: getDarkThemeOptions()
    });
}

export function generateLatencyChart(results: EndpointResult[], option: number): string {
    const sortedEndpoints = [...results]
        .sort((a, b) => b.latency.max - a.latency.max)
        .slice(0, option);

    const labels = sortedEndpoints.map(e => `${e.method} ${e.route}`);

    return renderChartHtml("latencyChart", "Endpoint Latency Spread", {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Median',
                    data: sortedEndpoints.map(e => e.latency.median),
                    backgroundColor: 'rgba(56, 189, 248, 0.8)',
                    borderColor: 'rgba(56, 189, 248, 1)',
                    pointStyle: 'rectRounded',
                    pointRadius: 6,
                    showLine: false 
                },
                {
                    label: 'P95',
                    data: sortedEndpoints.map(e => e.latency.p95),
                    backgroundColor: 'rgba(251, 191, 36, 0.8)',
                    borderColor: 'rgba(251, 191, 36, 1)',
                    pointStyle: 'rectRounded',
                    pointRadius: 6,
                    showLine: false
                },
                {
                    label: 'Max',
                    data: sortedEndpoints.map(e => e.latency.max),
                    backgroundColor: 'rgba(244, 63, 94, 0.8)', 
                    borderColor: 'rgba(244, 63, 94, 1)',
                    pointStyle: 'rectRounded', 
                    pointRadius: 6,
                    showLine: false
                }
            ]
        },
        options: {
            ...getDarkThemeOptions(),
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#9ca3af' },
                    title: {
                        display: true,
                        text: 'Latency (ms)',
                        color: '#9ca3af'
                    }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#9ca3af' }
                }
            }
        }
    });
}

export function generateStatusCodeChart(results: EndpointResult[], option: number): string {
    const sortedEndpoints = [...results]
        .sort((a, b) => b.requestCount - a.requestCount)
        .slice(0, option);

    const labels = sortedEndpoints.map(e => `${e.method} ${e.route}`);

    const getCodeCount = (map: Map<number, number>, prefix: number) => {
        let count = 0;
        for (const [code, val] of map.entries()) {
            if (Math.floor(code / 100) === prefix) count += val;
        }
        return count;
    };

    return renderChartHtml("statusChart", "Status Code Distribution", {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '2xx Success',
                    data: sortedEndpoints.map(e => getCodeCount(e.statusCode, 2)),
                    backgroundColor: 'rgba(52, 211, 153, 0.8)',
                },
                {
                    label: '3xx Redirect',
                    data: sortedEndpoints.map(e => getCodeCount(e.statusCode, 3)),
                    backgroundColor: 'rgba(56, 189, 248, 0.8)', 
                },
                {
                    label: '4xx Client Error',
                    data: sortedEndpoints.map(e => getCodeCount(e.statusCode, 4)),
                    backgroundColor: 'rgba(251, 191, 36, 0.8)', 
                },
                {
                    label: '5xx Server Error',
                    data: sortedEndpoints.map(e => getCodeCount(e.statusCode, 5)),
                    backgroundColor: 'rgba(248, 113, 113, 0.8)', 
                }
            ]
        },
        options: {
            ...getDarkThemeOptions(),
            scales: {
                x: { stacked: true, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#9ca3af' } },
                y: { stacked: true, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#9ca3af' } }
            }
        }
    });
}

function renderChartHtml(id: string, title: string, chartConfig: any): string {
    return `
<div class="chart">
    <h2 style="color: #f3f4f6; margin-bottom: 1rem; text-align: center;">${title}</h2>
    
    <div style="position: relative; height: 25rem; width: 100%;">
        <canvas id="${id}"></canvas>
    </div>

    <script>
        {
            const ctx = document.getElementById("${id}");
            new Chart(ctx, ${JSON.stringify(chartConfig)});
        }
    </script>
</div>
    `;
}

function getDarkThemeOptions() {
    return {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        color: '#9ca3af',
        scales: {
            x: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.1)' }, 
                ticks: { color: '#9ca3af' } 
            },
            y: {
                grid: { display: false },
                ticks: { color: '#9ca3af' }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: { color: '#e0e0e0' }
            }
        }
    };
}