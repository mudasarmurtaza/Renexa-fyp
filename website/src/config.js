const getBaseUrl = () => {
    // If VITE_API_BASE_URL is set in .env, use it
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }
    
    // Otherwise, dynamically detect current hostname and use port 5000
    const { hostname, protocol } = window.location;
    return `${protocol}//${hostname}:5000`;
};

export const API_BASE_URL = getBaseUrl();
