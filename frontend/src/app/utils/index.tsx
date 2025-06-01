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

export async function checkLatency(url: string): Promise<number | null> {
    try {
        const start = performance.now();
        const response = await fetch(`${url}/ping`, {
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

export function formatTimeLeft(value: number, unit: string): { value: number; unit: string } {
    let totalSeconds: number;

    switch (unit.toLowerCase()) {
        case 'seconds':
            totalSeconds = value;
            break;
        case 'minutes':
            totalSeconds = value * 60;
            break;
        case 'hours':
            totalSeconds = value * 3600;
            break;
        default:
            return { value, unit };
    }

    if (totalSeconds >= 3600) {
        return {
            value: parseFloat((totalSeconds / 3600).toFixed(2)),
            unit: 'hours',
        };
    } else {
        return {
            value: Math.round(totalSeconds / 60),
            unit: 'minutes',
        };
    }
}

export async function pingBackend(url: string): Promise<boolean | null> {
    try {
        const response = await fetch(`${url}/ping`, {
            cache: 'no-store',
        });
        if (!response.ok) throw new Error('Failed to ping server at url ' + url);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export function normalizeUrl(url: string): string {
    if (!url) return '';
    let normalized = url.trim();
    if (!/^https?:\/\//i.test(normalized)) {
        normalized = `http://${normalized}`;
    }
    return normalized;
}

export function checkInterval(seconds: number): number {
    if (seconds < 1 || seconds > 60) {
        throw new Error('Seconds must be between 1 and 60');
    }
    return seconds;
}

export function secondsToMs(seconds: number): number {
    return checkInterval(seconds) * 1000;
}