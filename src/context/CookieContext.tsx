import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CookieContextType {
    cookie: string;
    setCookie: (cookie: string) => void;
    isConfigured: boolean;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const CookieProvider = ({ children }: { children: ReactNode }) => {
    const [cookie, setCookieState] = useState<string>('');
    const [isConfigured, setIsConfigured] = useState(false);

    useEffect(() => {
        const storedCookie = localStorage.getItem('GOOGLE_COOKIE');
        if (storedCookie) {
            setCookieState(storedCookie);
            setIsConfigured(true);
        }
    }, []);

    const setCookie = (newCookie: string) => {
        setCookieState(newCookie);
        if (newCookie) {
            localStorage.setItem('GOOGLE_COOKIE', newCookie);
            setIsConfigured(true);
        } else {
            localStorage.removeItem('GOOGLE_COOKIE');
            setIsConfigured(false);
        }
    };

    return (
        <CookieContext.Provider value={{ cookie, setCookie, isConfigured }}>
            {children}
        </CookieContext.Provider>
    );
};

export const useCookie = () => {
    const context = useContext(CookieContext);
    if (context === undefined) {
        throw new Error('useCookie must be used within a CookieProvider');
    }
    return context;
};
