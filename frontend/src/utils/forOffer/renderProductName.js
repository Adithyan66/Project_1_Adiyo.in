export const renderProductNames = (items, lookup) => {
    if (!items || items.length === 0) return "None";
    items = Array.isArray(items) ? items : [items];
    if (items.length === 1) {
        const item = items[0];
        return typeof item === 'object' ? item.name : lookup.find(p => p._id === item)?.name || "Unknown";
    }
    const firstItem = items[0];
    const name = typeof firstItem === 'object' ? firstItem.name : lookup.find(p => p._id === firstItem)?.name || "Unknown";
    return `${name} + ${items.length - 1} more`;
};