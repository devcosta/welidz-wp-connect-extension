/**
 * Utilitários para a extensão WhatsApp Bridge
 */
export const WPP_Bridge_Utils = {
    /**
     * Gera um ID único baseado em timestamp e string aleatória
     * @returns {string} ID único
     */
    generateUniqueId: (): string => {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 7);
        return timestamp + randomStr;
    }
};

(window as any).WPP_Bridge_Utils = WPP_Bridge_Utils;
