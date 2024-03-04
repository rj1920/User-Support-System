import React, { useState, createContext, useContext } from 'react';

// Create a context for managing authentication state and user data
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap around the application
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const value = {
        user,
        setUser,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

   
}
