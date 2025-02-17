/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';


interface Staff {
    id: string;
    role: string;
}

interface FacilityAdmin {
    id: string;
    facilityName?: string
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    userType: string;
    approvalToken: string;
    state: string | null;
    facilityAdmin: FacilityAdmin | null;
    staff: Staff | null;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    // refreshSignin: () => void,
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    const [refToken, setRefToken] = useState<string | null>(null)


    useEffect(() => {
        const storedUser = Cookies.get('user');
        
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser as User);
                // console.log('this is cookies user', parsedUser)
            } catch (error) {
                console.error('Error parsing authUser cookie:', error);
                Cookies.remove('authUser'); // Remove the invalid cookie on the client side
            }

        } else {
            setUser(null); // Set to null if cookie is not found
        }

        setLoading(false)
    }, []);

    useEffect(() => {
        // If the user is not set, check the current URL and redirect accordingly
        if (!user && !loading) {
            const currentPath = window.location.pathname;
            if (currentPath.includes('/admin/dashboard')) {
                // Redirect to admin login page if not logged in
                router.push('/admin/auth/signin');
            } else if (currentPath.includes('/facility/dashboard')) {
                // Redirect to facility login page if not logged in
                router.push('/facility/auth/signin');
            }
        }
    }, [user, loading, router]);

    const login = (userData: User) => {
        console.log("passed to login", userData)
        Cookies.set('user', JSON.stringify(userData), { expires: 1, path: '/' });
        setUser(userData);
        // sessionStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        const user_type = user?.userType;
        console.log(user_type)
        setUser(null);
        Cookies.remove('user');
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');

        if (user_type == "STAFF") {
            router.push('/admin/auth/signin');
        } else {
            router.push('/facility/auth/signin');
        }
        
        // sessionStorage.removeItem('user');
        // Cookies.remove('user'); // Consistent cookie removal

    };


    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};