import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CookieContextType {
    cookie: string;
    setCookie: (cookie: string) => void;
    isConfigured: boolean;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const CookieProvider = ({ children }: { children: ReactNode }) => {
    const [cookie, setCookieState] = useState<string>(() => {
        if (typeof window === 'undefined') {
            return '';
        }
        return localStorage.getItem('GOOGLE_COOKIE') ?? '';
    });
    const [isConfigured, setIsConfigured] = useState<boolean>(() => {
        if (typeof window === 'undefined') {
            return false;
        }
        return !!localStorage.getItem('GOOGLE_COOKIE');
    });

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
