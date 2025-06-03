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
    try {
        // First, remove any quotes that might be in the string
        let normalized = url.trim().replace(/^["']|["']$/g, '');

        const urlObj = new URL(normalized);
        normalized = urlObj.href;

        // Fix the pathname to avoid double slashes (after the protocol)
        const urlParts = normalized.split('://');
        if (urlParts.length > 1) {
            // Handle the path portion (after protocol)
            const path = urlParts[1].replace(/\/\//g, '/');
            normalized = `${urlParts[0]}://${path}`;
        }

        // Remove trailing slashes
        normalized = normalized.replace(/\/+$/, '');
        return normalized;
    } catch (error) {
        console.error('Error normalizing URL:', error);
        // If URL is invalid, return it as is
        return url.trim();
    }
}

export function isValidUrl(url: string | null): boolean {
    try {
        if (!url) return false;

        if (url.includes('"') || url.includes("'")) {
            return false; // Contains quotes
        }

        const urlParts = url.split('://');
        if (urlParts.length > 1 && urlParts[1].includes('//')) {
            return false; // Contains double slashes in path
        }
        
        // Check for malformed URL structure
        new URL(url);
        return true;
    } catch (error) {
        console.error('Invalid URL:', url, error);
        return false;
    }
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

export function formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    const parts = [];
    if (days > 0) {
        parts.push(`${days}d`);
    }
    if (hours > 0 || days > 0) {
        parts.push(`${hours}h`);
    }
    if (minutes > 0 || hours > 0 || days > 0) {
        parts.push(`${minutes}m`);
    }
    parts.push(`${secs}s`);
    
    return parts.join(' ');
}