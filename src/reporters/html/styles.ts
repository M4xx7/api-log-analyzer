export const styles = `
:root {
    --bg: #0d1117;
    --surface: #161b22;
    --border: #30363d;
    --text: #e5e5e5;
    --accent: #b7b7b7;
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 1.5rem;
    max-width: 1400px;
    margin-inline: auto;
    background: var(--bg);
    color: var(--text);

    font-family:
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
        line-height: 1.5;
}

.report-title {
    text-align: center;
    font-size: 2.2rem;
    font-weight: 700;
    margin: 0 0 3rem;
    color: var(--text);
}

.summary {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 3rem;
    margin-bottom: 3rem;
}

.stat {
    text-align: center;
    color: var(--text);
    font-size: 1.5rem;
    font-weight: 500;
}

.stat-value {
    text-align: center;
    margin-top: 0.4rem;
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--accent);
}

.chart {
    margin-top: 2.5rem;
    padding: 1.5rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
}

.chart h2 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text);
}
`;