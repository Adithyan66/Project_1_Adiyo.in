export const generateTransactionId = () => {
    const prefix = 'TXN';
    const timestamp = Date.now();
    const randomSegment = Math.floor(Math.random() * 10000);
    return `${prefix}-${timestamp}-${randomSegment}`;
}