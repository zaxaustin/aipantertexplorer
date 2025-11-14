
import type { SavedSearch } from '../types';

const STORAGE_KEY = 'patentExplorerAISearches';

export function getSavedSearches(): SavedSearch[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const searches = JSON.parse(saved) as SavedSearch[];
            // Sort by timestamp descending to show newest first
            return searches.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }
        return [];
    } catch (error) {
        console.error("Failed to load searches from localStorage", error);
        localStorage.removeItem(STORAGE_KEY); // Clear corrupted data
        return [];
    }
}

export function saveSearches(searches: SavedSearch[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    } catch (error) {
        console.error("Failed to save searches to localStorage", error);
    }
}
