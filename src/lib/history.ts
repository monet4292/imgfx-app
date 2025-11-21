export interface HistoryItem {
    id: string;
    prompt: string;
    images: string[]; // Base64 data URLs
    timestamp: number;
    model: string;
}

const HISTORY_KEY = 'imgfx_history';

export const getHistory = (): HistoryItem[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const history = getHistory();
    const newItem: HistoryItem = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
    };

    // Keep only last 50 items to avoid localStorage limits
    const updatedHistory = [newItem, ...history].slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return newItem;
};

export const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
};

export const deleteHistoryItem = (id: string) => {
    const history = getHistory();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
};
