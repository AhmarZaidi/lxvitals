'use client';

import { useState, useEffect, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    // State to store our value
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    // Flag to track if we're in the browser environment
    const isBrowser = typeof window !== 'undefined';

    // Use a ref to track if this is the initial mount
    const isInitialMount = useRef(true);

    // Initialize on component mount
    useEffect(() => {
        if (!isBrowser) return;
        if (isInitialMount.current) {
            try {
                // Get from local storage by key
                const item = window.localStorage.getItem(key);
                /// Parse stored json or if none, return initialValue
                if (item) {
                    setStoredValue(JSON.parse(item));
                }
                // Mark that initial mount is complete
                isInitialMount.current = false;
            } catch (error) {
                console.log(error);
                setStoredValue(initialValue);
            }
        }
    }, [key, isBrowser, initialValue]);

    // Return a wrapped version of useState's setter function that
    // persists the new value to localStorage
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;

            // Save state
            setStoredValue(valueToStore);

            // Save to local storage (only if in browser)
            if (isBrowser) {
                // Save to local storage
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.log('Error writing to localStorage:', error);
        }
    };

    return [storedValue, setValue];
}