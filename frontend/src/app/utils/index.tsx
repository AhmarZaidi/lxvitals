// Function to get temperature status type
export const getTemperatureType = (temp: number | null) => {
    if (temp === null) return 'success';
    if (temp > 60) return 'danger';
    if (temp > 45) return 'warning';
    return 'success';
};

// Function to get usage status type
export const getUsageType = (percent: number | null, reverse: boolean) => {
    if (reverse) {
        if (percent === null) return 'success';
        if (percent < 10) return 'danger';
        if (percent < 20) return 'warning';
        return 'success';
    }
    if (percent === null) return 'success';
    if (percent > 95) return 'danger';
    if (percent > 90) return 'warning';
    return 'success';
};

export const getTemperatureUnit = (unit: string | null) => {
    switch (unit) {
        case 'celsius':
            return '°C';
        case 'fahrenheit':
            return 'F';
        case 'kelvin':
            return 'K';
        default:
            return 'N/A';
    }
}

export async function checkLatency(): Promise<number | null> {
    try {
        const start = performance.now();
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ping`, {
            cache: 'no-store',
        });
        if (!response.ok) throw new Error('Failed to ping server');
        const end = performance.now();
        return Math.round(end - start);
    } catch (error) {
        console.error('Latency check failed:', error);
        return null;
    }
}
