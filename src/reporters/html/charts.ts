import { EndpointResult } from "../../types";
import { chartColors } from "./chartColors";


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
                data: bottomEndpoints.map(e => e.successRate.toFixed(2)),
                backgroundColor: chartColors.error,
                borderColor: chartColors.error,
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

    const options = getDarkThemeOptions();

    options.scales.x.title = {
        display: true,
        text: 'Latency (ms)',
        color: chartColors.text
    };

    return renderChartHtml("latencyChart", "Endpoint Latency Spread", {
        type: 'line',
        data: {
            labels: sortedEndpoints.map(e => `${e.method} ${e.route}`),
            datasets: [
                {
                    label: 'Median',
                    data: sortedEndpoints.map(e => e.latency.median),
                    pointStyle: 'rectRounded',
                    backgroundColor: chartColors.latency,
                    pointRadius: 8,
                    showLine: false
                },
                {
                    label: 'P95',
                    data: sortedEndpoints.map(e => e.latency.p95),
                    pointStyle: 'rectRounded',
                    backgroundColor: chartColors.info,
                    pointRadius: 8,
                    showLine: false
                },
                {
                    label: 'Max',
                    data: sortedEndpoints.map(e => e.latency.max),
                    pointStyle: 'rectRounded',
                    backgroundColor: chartColors.error,
                    pointRadius: 8,
                    showLine: false
                }
            ]
        },
        options
    });
}


export function generateStatusCodeChart(results: EndpointResult[], option: number): string {
    const sortedEndpoints = [...results]
        .sort((a, b) => b.requestCount - a.requestCount)
        .slice(0, option);

    const getCodeCount = (map: Map<number, number>, prefix: number) => {
        let count = 0;

        for (const [code, value] of map.entries()) {
            if (Math.floor(code / 100) === prefix) {
                count += value;
            }
        }

        return count;
    };

    const options = getDarkThemeOptions();

    options.scales.x.stacked = true;
    options.scales.y.stacked = true;

    return renderChartHtml("statusChart", "Status Code Distribution", {
        type: 'bar',
        data: {
            labels: sortedEndpoints.map(e => `${e.method} ${e.route}`),
            datasets: [
                {
                    label: '2xx Success',
                    data: sortedEndpoints.map(e => getCodeCount(e.statusCode, 2)),
                    backgroundColor: chartColors.success,
                    borderRadius: 4
                },
                {
                    label: '3xx Redirect',
                    data: sortedEndpoints.map(e => getCodeCount(e.statusCode, 3)),
                    backgroundColor: chartColors.info,
                    borderRadius: 4
                },
                {
                    label: '4xx Client Error',
                    data: sortedEndpoints.map(e => getCodeCount(e.statusCode, 4)),
                    backgroundColor: chartColors.warning,
                    borderRadius: 4
                },
                {
                    label: '5xx Server Error',
                    data: sortedEndpoints.map(e => getCodeCount(e.statusCode, 5)),
                    backgroundColor: chartColors.error,
                    borderRadius: 4
                }
            ]
        },
        options
    });
}


function renderChartHtml(id: string, title: string, chartConfig: any): string {
    return `
<div class="chart">
    <h2 style="color: ${chartColors.title}; margin-bottom: 1rem; text-align: center;">${title}</h2>
    
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


function getDarkThemeOptions(): any {
    return {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,

        color: chartColors.text,

        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    color: chartColors.grid
                },
                ticks: {
                    color: chartColors.text
                }
            },
            y: {
                grid: {
                    display: false
                },
                ticks: {
                    color: chartColors.text
                }
            }
        },

        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: chartColors.legend
                }
            }
        }
    };
}