import { styles } from "./styles";

export function generateLayout(content: string): string {
    return `
<!DOCTYPE html>

<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>API Report</title>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        
    <style>
        ${styles}
    </style>

</head>

<body>

    ${content}

</body>

</html>
`;
}