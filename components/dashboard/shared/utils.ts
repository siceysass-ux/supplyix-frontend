export const normalizeText = (text: string | null | undefined): string => {
    if (!text || typeof text !== 'string') return '';
    return text
        .toLowerCase()
        .replace(/[-]/g, '') // Remove hyphens
        .replace(/[ıİ]/g, 'i')
        .replace(/[şŞ]/g, 's')
        .replace(/[ğĞ]/g, 'g')
        .replace(/[üÜ]/g, 'u')
        .replace(/[öÖ]/g, 'o')
        .replace(/[çÇ]/g, 'c');
};
