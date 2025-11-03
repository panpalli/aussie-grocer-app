export enum Store {
    Coles = 'Coles',
    Woolworths = 'Woolworths',
    ALDI = 'ALDI',
    IGA = 'IGA',
}

export interface Product {
    id: string;
    name: string;
    store: Store;
    price: number;
    quantity: string;
    discountAmount: number; // Changed from discount
}

export interface BuyListItem {
    id: string;
    productId: string;
    name:string;
    store: Store;
    price: number;
    quantity: string;
    discountAmount: number; // Changed from discount
    isTaken: boolean;
}
