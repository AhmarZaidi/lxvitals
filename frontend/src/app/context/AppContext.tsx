'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
	CPU as CPUType,
	GPU,
	Memory,
	Drives,
	Wifi,
	Speed,
	Battery
} from '@/app/types';
import { formatTimeLeft, normalizeUrl, isValidUrl } from '@/app/utils';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';

type DataCategory = 'cpu' | 'gpu' | 'memory' | 'drives' | 'wifi' | 'speed' | 'battery';

interface DataState {
	cpu: DataEntry<CPUType>;
	gpu: DataEntry<GPU>;
	memory: DataEntry<Memory>;
	drives: DataEntry<Drives>;
	wifi: DataEntry<Wifi>;
	speed: DataEntry<Speed>;
	battery: DataEntry<Battery>;
}

interface DataEntry<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
	lastUpdated: number | null;
}

interface AppContextType {
	dataState: DataState;
	fetchData: (category: DataCategory) => Promise<void>;
	clearCache: (category?: DataCategory) => void;
	cardOrder: string[];
	setCardOrder: (newOrder: string[]) => void;
	collapsedSections: Record<string, boolean>;
	toggleCollapse: (section: string) => void;
	refreshAllData: () => Promise<void>;
    backendUrl: string;
    setBackendUrl: (url: string) => void;
    refreshInterval: number;
    setRefreshInterval: (interval: number) => void;
    advancedOptions: Record<string, boolean>;
    toggleAdvanced: (section: string) => void;
}

const defaultCardOrder = ['cpu', 'gpu', 'memory', 'wifi', 'drives', 'battery', 'speed'];

const AppContext = createContext<AppContextType>({
	dataState: {
		cpu: emptyEntry(),
		gpu: emptyEntry(),
		memory: emptyEntry(),
		drives: emptyEntry(),
		wifi: emptyEntry(),
		speed: emptyEntry(),
		battery: emptyEntry()
	},
	fetchData: async () => { },
	clearCache: () => { },
	cardOrder: defaultCardOrder,
	setCardOrder: () => { },
	collapsedSections: {},
	toggleCollapse: () => { },
	refreshAllData: async () => { },
    backendUrl: '',
    setBackendUrl: () => { },
    refreshInterval: 5,
    setRefreshInterval: () => { },
    advancedOptions: {},
    toggleAdvanced: () => { }
});

function emptyEntry<T>(): DataEntry<T> {
	return {data: null, loading: false, error: null, lastUpdated: null};
}

interface AppProviderProps {
	children: ReactNode;
}

const apiEndpoints: Record<DataCategory, string> = {
	cpu: '/api/system/cpu',
	gpu: '/api/system/gpu',
	memory: '/api/system/memory',
	drives: '/api/system/drives',
	wifi: '/api/network/wifi',
	speed: '/api/network/speed',
	battery: '/api/battery'
};

export function AppProvider({ children }: AppProviderProps) {
	const [cardOrder, setCardOrder] = useState<string[]>(defaultCardOrder);
	const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
		cpu: false, gpu: false, memory: false, drives: false, wifi: false, speed: false, battery: false
	});

    // Refresh interval with default of 5 seconds
    const [refreshInterval, setRefreshInterval] = useState<number>(5);

    const [advancedOptions, setAdvancedOptions] = useLocalStorage<Record<string, boolean>>(
        'advancedOptions',
        { cpu: false, gpu: false, memory: false, drives: false, wifi: false, speed: false, battery: false }
    );

    const [backendUrl, setBackendUrlState] = useLocalStorage<string>('backendUrl', '');

    // Use this function to update backendUrl
    const setBackendUrl = (url: string) => {
        // Update in localStorage
        setBackendUrlState(normalizeUrl(url));
        // Clear all cached data when changing backend
        clearCache();
    };

	const [dataState, setDataState] = useState<DataState>({
		cpu: emptyEntry(),
		gpu: emptyEntry(),
		memory: emptyEntry(),
		drives: emptyEntry(),
		wifi: emptyEntry(),
		speed: emptyEntry(),
		battery: emptyEntry()
	});

	const fetchData = async (category: DataCategory) => {
        // Skip fetch if no backend URL is set
        if (!backendUrl || !isValidUrl(backendUrl)) {
            console.warn('Backend URL is not set or invalid. Skipping fetch for', category);
            return;
        }

		setDataState(prev => ({
			...prev,
			[category]: {
				...prev[category],
				loading: true,
				error: null
			}
		}));

		try {
			const url = normalizeUrl(`${backendUrl}${apiEndpoints[category]}`);
			const response = await fetch(url, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });

			if (!response.ok) {
				throw new Error(`Error fetching ${category} data: ${response.status}`);
			}

			const responseData = await response.json();

			if (category === 'battery' && responseData.time_left !== null && responseData.time_left_unit !== null) {
				const formatted = formatTimeLeft(responseData.time_left, responseData.time_left_unit);
				responseData.time_left = formatted.value;
				responseData.time_left_unit = formatted.unit;
			}

			const timestamp = Date.now();

			setDataState(prev => ({
				...prev,
				[category]: {
					data: responseData,
					loading: false,
					error: null,
					lastUpdated: timestamp
				}
			}));
		} catch (error) {
			setDataState(prev => ({
				...prev,
				[category]: {
					...prev[category],
					loading: false,
					error: error instanceof Error ? error.message : 'Unknown error'
				}
			}));
		}
	};

	const refreshAllData = async () => {
        const categories: DataCategory[] = ['cpu', 'gpu', 'memory', 'drives', 'wifi', 'battery'];
        // Create an array of promises for each fetch operation
        const fetchPromises = categories.map(category => fetchData(category));
        
        // Wait for all fetches to complete
        await Promise.all(fetchPromises);
    };

	const clearCache = (category?: DataCategory) => {
		if (category) {
			setDataState(prev => ({
				...prev,
				[category]: emptyEntry()
			}));
		} else {
			setDataState({
				cpu: emptyEntry(),
				gpu: emptyEntry(),
				memory: emptyEntry(),
				drives: emptyEntry(),
				wifi: emptyEntry(),
				speed: emptyEntry(),
				battery: emptyEntry()
			});
		}
	};

	const toggleCollapse = (section: string) => {
		setCollapsedSections(prev => ({
			...prev,
			[section]: !prev[section]
		}));
	};

    const toggleAdvanced = (section: string) => {
        setAdvancedOptions(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

	return (
		<AppContext.Provider
			value={{
				dataState,
				fetchData,
				clearCache,
				cardOrder,
				setCardOrder,
				collapsedSections,
				toggleCollapse,
				refreshAllData,
                backendUrl,
                setBackendUrl,
                refreshInterval,
                setRefreshInterval,
                advancedOptions,
                toggleAdvanced,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export const useAppContext = () => useContext(AppContext);