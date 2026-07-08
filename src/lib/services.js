export const CacheService = {
  set: (key, data, ttlMinutes = 10) => {
    const item = {
      data,
      expiry: Date.now() + ttlMinutes * 60 * 1000,
    };
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.message.includes('quota')) {
        // Try to make room by evicting the oldest 50% of cached API responses
        try {
          const cachedItems = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith('https://api.github.com')) {
              try {
                const parsed = JSON.parse(localStorage.getItem(k));
                cachedItems.push({ key: k, expiry: parsed.expiry });
              } catch (err) {
                cachedItems.push({ key: k, expiry: 0 }); // Corrupted items get deleted first
              }
            }
          }
          // Sort by expiry ascending (oldest expire first)
          cachedItems.sort((a, b) => a.expiry - b.expiry);
          
          // Delete the oldest 50%
          const half = Math.ceil(cachedItems.length / 2);
          for (let i = 0; i < half; i++) {
            localStorage.removeItem(cachedItems[i].key);
          }
          
          localStorage.setItem(key, JSON.stringify(item));
        } catch (retryError) {
          // Fail silently, don't spam the console
        }
      }
    }
  },
  get: (key) => {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.data;
    } catch (e) {
      return null;
    }
  }
};

export const HistoryService = {
  getHistory: () => {
    try {
      return JSON.parse(localStorage.getItem('waypoint_history')) || [];
    } catch (e) { return []; }
  },
  addHistory: (query, type) => {
    try {
      let history = JSON.parse(localStorage.getItem('waypoint_history')) || [];
      history = history.filter(h => h.query !== query); 
      history.unshift({ query, type, timestamp: Date.now() });
      if (history.length > 20) history = history.slice(0, 20); 
      localStorage.setItem('waypoint_history', JSON.stringify(history));
    } catch(e) {}
  },
  clearHistory: () => {
    localStorage.removeItem('waypoint_history');
  }
};

export const ExportService = {
  exportToJSON: (data, filename) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
  exportToCSV: (headers, rows, filename) => {
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
};
