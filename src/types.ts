export type ApiLog = {
    method: string;
    path: string;
    status: number;
    duration: number;
}

export type Duration = {
    min: number;
    max: number;
    average: number
}

export type EndpointResult = {
    method: string;
    route: string;
    requestCount: number;
    errorRate: number
    duration: Duration;
}


