export default {
    parse(value, fallback = null) {
        if (value === null || value === '') {
            return fallback;
        }

        try {
            return JSON.parse(value);
        } catch {
            return fallback;
        }
    }
};