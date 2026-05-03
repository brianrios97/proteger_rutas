import type { CartItem } from './CartItem';

export interface Order {
    id: string;
    userEmail: string;
    fecha: string;
    timestamp: number;
    items: CartItem[];
    total: number;
}