export const getSizeKey = (size) => {
    switch (size.toLowerCase()) {
        case 'small': return 'small';
        case 's': return 'small';
        case 'medium': return 'medium';
        case 'm': return 'medium';
        case 'large': return 'large';
        case 'l': return 'large';
        case 'extra large': return 'extralarge';
        case 'xl': return 'extralarge';
        default: return size.toLowerCase();
    }
};
