'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
	CPU,
	GPU,
	Memory,
	Drives,
	Wifi,
	Speed,
	Battery
} from '@/app/types';
import { formatTimeLeft } from '@/app/utils';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';

type DataCategory = 'cpu' | 'gpu' | 'memory' | 'drives' | 'wifi' | 'speed' | 'battery';

interface DataState {
	cpu: {
		data: CPU | null;
		loading: boolean;
		error: string | null;
		lastUpdated: number | null;
	};
	gpu: {
		data: GPU | null;
		loading: boolean;
		error: string | null;
		lastUpdated: number | null;
	};
	memory: {
		data: Memory | null;
		loading: boolean;
		error: string | null;
		lastUpdated: number | null;
	};
	drives: {
		data: Drives | null;
		loading: boolean;
		error: string | null;
		lastUpdated: number | null;
	};
	wifi: {
		data: Wifi | null;
		loading: boolean;
		error: string | null;
		lastUpdated: number | null;
	};
	speed: {
		data: Speed | null;
		loading: boolean;
		error: string | null;
		lastUpdated: number | null;
	};
	battery: {
		data: Battery | null;
		loading: boolean;
		error: string | null;
		lastUpdated: number | null;
	};
}

interface AppContextType {
	dataState: DataState;
	fetchData: (category: DataCategory) => Promise<void>;
	clearCache: (category?: DataCategory) => void;
	cardOrder: string[];
	setCardOrder: (newOrder: string[]) => void;
	collapsedSections: Record<string, boolean>;
	toggleCollapse: (section: string) => void;
	isInitialized: boolean;
}

const defaultCardOrder = ['cpu', 'gpu', 'memory', 'speed', 'battery', 'wifi', 'drives'];

// Create context with default values
const AppContext = createContext<AppContextType>({
	dataState: {
		cpu: { data: null, loading: false, error: null, lastUpdated: null },
		gpu: { data: null, loading: false, error: null, lastUpdated: null },
		memory: { data: null, loading: false, error: null, lastUpdated: null },
		drives: { data: null, loading: false, error: null, lastUpdated: null },
		wifi: { data: null, loading: false, error: null, lastUpdated: null },
		speed: { data: null, loading: false, error: null, lastUpdated: null },
		battery: { data: null, loading: false, error: null, lastUpdated: null }
	},
	fetchData: async () => { },
	clearCache: () => { },
	cardOrder: defaultCardOrder,
	setCardOrder: () => { },
	collapsedSections: {},
	toggleCollapse: () => { },
	isInitialized: false
});

interface AppProviderProps {
	children: ReactNode;
}

// URL mapping for each data category
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
	// Persistent UI state
	const [cardOrder, setCardOrder] = useLocalStorage<string[]>('cardOrder', defaultCardOrder);
	const [collapsedSections, setCollapsedSections] = useLocalStorage<Record<string, boolean>>(
		'collapsedSections',
		{ cpu: false, gpu: false, memory: false, drives: false, wifi: false, speed: false, battery: false }
	);

	// Cache-related state
	const [cachedData, setCachedData] = useLocalStorage<Partial<{ [key in DataCategory]: any }>>('apiCache', {});
	const [lastUpdated, setLastUpdated] = useLocalStorage<{ [key in DataCategory]?: number }>('lastUpdated', {});

	// Runtime state
	const [dataState, setDataState] = useState<DataState>({
		cpu: { data: null, loading: false, error: null, lastUpdated: null },
		gpu: { data: null, loading: false, error: null, lastUpdated: null },
		memory: { data: null, loading: false, error: null, lastUpdated: null },
		drives: { data: null, loading: false, error: null, lastUpdated: null },
		wifi: { data: null, loading: false, error: null, lastUpdated: null },
		speed: { data: null, loading: false, error: null, lastUpdated: null },
		battery: { data: null, loading: false, error: null, lastUpdated: null }
	});
	const [isInitialized, setIsInitialized] = useState(false);

	// Initialize from cache on first load
	useEffect(() => {
		// Don't re-initialize if already done
        if (isInitialized) return;

		const initialDataState = { ...dataState };
		let hasData = false;

		Object.keys(cachedData).forEach((key) => {
			const category = key as DataCategory;
			if (cachedData[category]) {
				hasData = true;
				initialDataState[category] = {
					data: cachedData[category],
					loading: false,
					error: null,
					lastUpdated: lastUpdated[category] || null
				};
			}
		});

		if (hasData) {
            console.log('Restoring data from cache:', Object.keys(cachedData));
            setDataState(initialDataState);
        }

		setDataState(initialDataState);
		setIsInitialized(true);
	}, [cachedData, lastUpdated]);

	const fetchData = async (category: DataCategory) => {
		// Update loading state
		setDataState(prev => ({
			...prev,
			[category]: {
				...prev[category],
				loading: true,
				error: null
			}
		}));

		try {
			const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${apiEndpoints[category]}`;
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`Error fetching ${category} data: ${response.status}`);
			}

			const responseData = await response.json();

			// Special handling for battery data formatting
			if (category === 'battery' && responseData.time_left !== null && responseData.time_left_unit !== null) {
				const formatted = formatTimeLeft(responseData.time_left, responseData.time_left_unit);
				responseData.time_left = formatted.value;
				responseData.time_left_unit = formatted.unit;
			}

			const timestamp = Date.now();

			// Update cache
			setCachedData(prev => ({ ...prev, [category]: responseData }));
			setLastUpdated(prev => ({ ...prev, [category]: timestamp }));

			// Update state with new data
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
			console.error(`Error fetching ${category} data:`, error);
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
        const categories: DataCategory[] = ['cpu', 'gpu', 'memory', 'drives', 'wifi', 'battery', 'speed'];
        // Create an array of promises for each fetch operation
        const fetchPromises = categories.map(category => fetchData(category));
        
        // Wait for all fetches to complete
        await Promise.all(fetchPromises);
    };

	const clearCache = (category?: DataCategory) => {
		if (category) {
			// Clear specific category
			setCachedData(prev => {
				const newCache = { ...prev };
				delete newCache[category];
				return newCache;
			});
			setLastUpdated(prev => {
				const newUpdated = { ...prev };
				delete newUpdated[category];
				return newUpdated;
			});
			setDataState(prev => ({
				...prev,
				[category]: { data: null, loading: false, error: null, lastUpdated: null }
			}));
		} else {
			// Clear all cache
			setCachedData({});
			setLastUpdated({});
			setDataState({
				cpu: { data: null, loading: false, error: null, lastUpdated: null },
				gpu: { data: null, loading: false, error: null, lastUpdated: null },
				memory: { data: null, loading: false, error: null, lastUpdated: null },
				drives: { data: null, loading: false, error: null, lastUpdated: null },
				wifi: { data: null, loading: false, error: null, lastUpdated: null },
				speed: { data: null, loading: false, error: null, lastUpdated: null },
				battery: { data: null, loading: false, error: null, lastUpdated: null }
			});
		}
	};

	const toggleCollapse = (section: string) => {
		setCollapsedSections(prev => ({
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
				refreshAllData,
				cardOrder,
				setCardOrder,
				collapsedSections,
				toggleCollapse,
				isInitialized
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export const useAppContext = () => useContext(AppContext);