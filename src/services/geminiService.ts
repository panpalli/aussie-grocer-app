import { GoogleGenAI, Type } from "@google/genai";
import { Product, Store } from '../types';

// FIX: Per coding guidelines, API key must be from process.env.API_KEY and assumed to exist.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: {
              type: Type.STRING,
              description: 'A unique identifier for the product offering.'
            },
            name: {
                type: Type.STRING,
                description: 'The full name of the product, including brand and size.'
            },
            store: {
                type: Type.STRING,
                description: 'The name of the supermarket, e.g., Coles, Woolworths, ALDI.'
            },
            price: {
                type: Type.NUMBER,
                description: 'The current price of the product in AUD.'
            },
            quantity: {
                type: Type.STRING,
                description: "The unit of measurement, e.g., '1L', '500g', 'Each'."
            },
            discountAmount: {
                type: Type.NUMBER,
                description: 'The discount amount in AUD. 0 if not on sale.'
            }
        },
        required: ["id", "name", "store", "price", "quantity", "discountAmount"],
    },
};

export const fetchProductPrices = async (productName: string): Promise<Product[]> => {
    try {
        const prompt = `Act as an Australian grocery price comparison API. A user is searching for '${productName}'. Generate a realistic list of products from Australian supermarkets like Coles, Woolworths, and ALDI. Return a JSON array that strictly adheres to the provided schema. For each product, create a unique ID, a descriptive name, the store name, a realistic price, the quantity, and a discount amount.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const rawProducts: any[] = JSON.parse(jsonText);

        if (!Array.isArray(rawProducts)) {
            console.warn("Gemini API did not return an array for products.");
            return [];
        }

        // Data validation and sanitization
        const products: Product[] = rawProducts
            .filter(p => p && typeof p === 'object' && p.name && p.id)
            .map((p: any) => {
                return {
                    id: String(p.id),
                    name: String(p.name),
                    store: Object.values(Store).includes(p.store) ? p.store : Store.Coles,
                    price: parseFloat(String(p.price)) || 0,
                    quantity: String(p.quantity || ''),
                    discountAmount: parseFloat(String(p.discountAmount)) || 0,
                };
            });

        return products;

    } catch (error) {
        console.error("Error fetching product prices from Gemini API:", error);
        throw new Error("Failed to fetch product prices. Please check your API key and try again.");
    }
};