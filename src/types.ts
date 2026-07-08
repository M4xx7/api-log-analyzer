export type ApiLog = {
    method: string;
    path: string;
    status: number;
    duration: number;
}

export type Latency = {
    max: number;
    median: number;
    p95: number;
}

export type EndpointResult = {
    method: string;
    route: string;
    requestCount: number;
    successRate: number;
    statusCode: Map<number, number>;
    latency: Latency;
}


