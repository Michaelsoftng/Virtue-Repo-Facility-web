
export const decodeJwtEncodedId = (encodedId: string | undefined): string => {
    if (!encodedId) {
        console.error('Invalid input: encodedId is undefined or null');
        return ''; // Return fallback or handle it appropriately
    }

    try {
        const base64 = encodedId.replace(/-/g, '+').replace(/_/g, '/');
        const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
        const decoded = atob(paddedBase64);
        return decoded.replace(/^UserNode:/, '');
    } catch (error) {
        console.error('Error decoding JWT-encoded ID:', error);
        return '';
    }
};