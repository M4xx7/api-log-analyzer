import { EndpointResult } from "../../types";

interface BarChartConfig {
    id: string;
    title: string;
    labels: string[];
    values: number[];
    datasetLabel: string;
    backgroundColor: string;
    borderColor: string;
}



export function generateMostUsedEndpoints(results: EndpointResult[]): string {
    const topEndpoints = [...results]
        .sort((a, b) => b.requestCount - a.requestCount)
        .slice(0, 10);

    return generateHorizontalBarChart({
        id: "topEndpointsChart",
        title: "Top 10 Most Used Endpoints",
        labels: topEndpoints.map(e => `${e.method} ${e.route}`),
        values: topEndpoints.map(e => e.requestCount),
        datasetLabel: "Total Requests",
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)"
    });
}

export function generateLeastSuccessfulEndpoints(results: EndpointResult[]): string {
    const bottomEndpoints = [...results]
        .sort((a, b) => a.successRate - b.successRate)
        .slice(0, 5);

    return generateHorizontalBarChart({
        id: "leastSuccessfulChart",
        title: "Top 5 Least Successful",
        labels: bottomEndpoints.map(e => `${e.method} ${e.route}`),
        values: bottomEndpoints.map(e => e.successRate),
        datasetLabel: "Success Rate",
        backgroundColor: "rgba(22, 219, 134, 0.6)",
        borderColor: "rgb(13, 152, 66)"
    });
}


export function generateLatencyChart(results: EndpointResult[]): string {

    const sortedEndpoints = [...results]
        .sort((a, b) => b.latency.max - a.latency.max)
        .slice(0, 10);

    const labels = sortedEndpoints.map(e => `${e.method} ${e.route}`);
    const medians = sortedEndpoints.map(e => e.latency.median);
    const p95s = sortedEndpoints.map(e => e.latency.p95);
    const maxes = sortedEndpoints.map(e => e.latency.max);

    return `
<div class="chart">
    <h2>Endpoint Latency Spread (Top 10 Worst)</h2>
    
    <div style="position: relative; height: 400px; width: 100%;">
        <canvas id="latencyChart"></canvas>
    </div>

    <script>
        {
            const labels = ${JSON.stringify(labels)};
            const medians = ${JSON.stringify(medians)};
            const p95s = ${JSON.stringify(p95s)};
            const maxes = ${JSON.stringify(maxes)};
            const ctx = document.getElementById("latencyChart");

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Median',
                            data: medians,
                            backgroundColor: 'rgb(18, 30, 158)',
                            pointStyle: 'rectRounded',
                            pointRadius: 6,
                            showLine: false
                        },
                        {
                            label: 'P95',
                            data: p95s,
                            backgroundColor: 'rgb(83, 255, 146)',
                            pointStyle: 'rectRounded',
                            pointRadius: 6,
                            showLine: false
                        },
                        {
                            label: 'Max',
                            data: maxes,
                            backgroundColor: 'rgb(255, 52, 52)',
                            pointStyle: 'rectRounded', 
                            pointRadius: 6,
                            showLine: false
                        }
                    ]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Latency (ms)'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom' 
                        }
                    }
                }
            });
        }
    </script>
</div>
`;
}

function generateHorizontalBarChart(config: BarChartConfig): string {
    return `
<div class="chart">
    <h2>${config.title}</h2>
    
    <div style="position: relative; height: 400px; width: 100%;">
        <canvas id="${config.id}"></canvas>
    </div>

    <script>
        {
            const labels = ${JSON.stringify(config.labels)};
            const values = ${JSON.stringify(config.values)};
            const ctx = document.getElementById("${config.id}");

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '${config.datasetLabel}',
                        data: values,
                        backgroundColor: '${config.backgroundColor}',
                        borderColor: '${config.borderColor}',
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    </script>
</div>
`;
}


export function generateStatusCodeChart(results: EndpointResult[]): string {

    const sortedEndpoints = [...results]
        .sort((a, b) => b.requestCount - a.requestCount)
        .slice(0, 10);

    const labels = sortedEndpoints.map(e => `${e.method} ${e.route}`);

    const getCodeCount = (map: Map<number, number>, prefix: number) => {
        let count = 0;
        for (const [code, val] of map.entries()) {
            if (Math.floor(code / 100) === prefix) count += val;
        }
        return count;
    };

    const success2xx = sortedEndpoints.map(e => getCodeCount(e.statusCode, 2));
    const redirect3xx = sortedEndpoints.map(e => getCodeCount(e.statusCode, 3));
    const clientErr4xx = sortedEndpoints.map(e => getCodeCount(e.statusCode, 4));
    const serverErr5xx = sortedEndpoints.map(e => getCodeCount(e.statusCode, 5));

    return `
<div class="chart">
    <h2>Status Code Distribution (Top 10)</h2>
    
    <div style="position: relative; height: 400px; width: 100%;">
        <canvas id="statusChart"></canvas>
    </div>

    <script>
        {
            const ctx = document.getElementById("statusChart");

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ${JSON.stringify(labels)},
                    datasets: [
                        {
                            label: '2xx Success',
                            data: ${JSON.stringify(success2xx)},
                            backgroundColor: 'rgba(114, 255, 101, 0.8)',
                        },
                        {
                            label: '3xx Redirect',
                            data: ${JSON.stringify(redirect3xx)},
                            backgroundColor: 'rgba(54, 162, 235, 0.8)',
                        },
                        {
                            label: '4xx Client Error',
                            data: ${JSON.stringify(clientErr4xx)},
                            backgroundColor: 'rgba(255, 210, 64, 0.8)',
                        },
                        {
                            label: '5xx Server Error',
                            data: ${JSON.stringify(serverErr5xx)},
                            backgroundColor: 'rgba(255, 99, 132, 0.8)', 
                        }
                    ]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            stacked: true, 
                            beginAtZero: true
                        },
                        y: {
                            stacked: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false 
                        }
                    }
                }
            });
        }
    </script>
</div>
`;
}


