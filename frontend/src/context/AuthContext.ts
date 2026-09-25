import { createContext } from 'react';

export interface UserPayload {
   id: string;
   phone: string;
   fullName: string;
}

export interface AuthContextType {
   user: UserPayload | null;
   isLoading: boolean;
   login: (token: string) => void;
   logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);