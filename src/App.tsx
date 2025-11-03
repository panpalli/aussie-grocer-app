
import React, { useState, useEffect, useRef } from 'react';
import { Product, BuyListItem } from './types';
import { fetchProductPrices } from './services/geminiService';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import BuyList from './components/BuyList';
import Toast from './components/Toast';
import { ShoppingCartIcon, ArrowUpIcon, ChevronDownIcon } from './components/icons';

const App: React.FC = () => {
    // FIX: Per coding guidelines, API key is assumed to be present. UI for missing key is removed.

    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [buyList, setBuyList] = useState<BuyListItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    
    const isInitialMount = useRef(true);
    const buyListRef = useRef<HTMLDivElement>(null);

    // Effect for reading list from URL hash on initial load
    useEffect(() => {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#list=')) {
            const listData = hash.substring('#list='.length);
            if (listData) {
                try {
                    const decoded = JSON.parse(decodeURIComponent(listData));
                    if (Array.isArray(decoded)) {
                        // BUG FIX: Added robust validation to prevent app crash from malformed URL data.
                        // This ensures every item has all required properties before being added to the list.
                        const validatedList: BuyListItem[] = decoded.filter(item =>
                            item &&
                            typeof item.id === 'string' &&
                            typeof item.productId === 'string' &&
                            typeof item.name === 'string' &&
                            typeof item.store === 'string' &&
                            typeof item.price === 'number' &&
                            typeof item.quantity === 'string' &&
                            typeof item.discountAmount === 'number'
                        ).map(item => ({...item, isTaken: item.isTaken || false })); // Ensure isTaken exists
                        setBuyList(validatedList);
                    }
                } catch (e) {
                    console.error("Failed to parse buy list from URL hash.", e);
                    window.location.hash = ''; // Clear invalid hash
                }
            }
        }
    }, []);

    // Effect for updating URL hash when buy list changes
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        try {
            if (buyList.length > 0) {
                const encodedList = encodeURIComponent(JSON.stringify(buyList));
                window.location.hash = `list=${encodedList}`;
            } else {
                window.location.hash = '';
            }
        } catch (e) {
            console.error("Failed to update URL hash with buy list.", e);
        }
    }, [buyList]);
    
    // Effect to auto-hide the toast notification
    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => {
                setToastMessage('');
            }, 3000); // Hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    // Effect for tracking scroll position to show the correct scroll button icon
    useEffect(() => {
        const handleScroll = () => {
            // Show scroll-to-top button if user has scrolled down more than 300px
            setShowScrollToTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        // Clean up the event listener when the component unmounts
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = async (query: string) => {
        setIsLoading(true);
        setError(null);
        setSearchResults([]);
        try {
            const products = await fetchProductPrices(query);
            setSearchResults(products);
        } catch (e: any) {
            setError(e.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToList = (product: Product) => {
        const newItem: BuyListItem = {
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            name: product.name,
            store: product.store,
            price: product.price,
            quantity: product.quantity,
            discountAmount: product.discountAmount,
            isTaken: false,
        };
        setBuyList(prevList => [...prevList, newItem]);
        setToastMessage(`'${product.name}' added to list`);
    };

    const handleRemoveFromList = (id: string) => {
        setBuyList(prevList => prevList.filter(item => item.id !== id));
    };

    const handleToggleTakenStatus = (id: string) => {
        setBuyList(prevList => 
            prevList.map(item => 
                item.id === id ? { ...item, isTaken: !item.isTaken } : item
            )
        );
    };
    
    const handleScrollToBuyList = () => {
        buyListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleScrollButtonClick = () => {
        if (showScrollToTop) {
            // If the up arrow is showing, scroll to the top of the page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // If the cart icon is showing, scroll to the "My Buy List" section
            handleScrollToBuyList();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />
            <main className="container mx-auto p-4 lg:p-6">
                <div className="text-center mb-6 mt-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Find the best prices for your household budget.</h2>
                    <p className="text-gray-500 mt-1">Compare across Coles, Woolworths, ALDI and more.</p>
                </div>

                <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                
                {/* Scroll to Buy List Button - Mobile Only */}
                <div className="lg:hidden w-full max-w-2xl mx-auto mb-8 px-4">
                    <button
                        onClick={handleScrollToBuyList}
                        className="w-full flex items-center justify-center gap-3 py-3 px-5 bg-white border border-gray-300 text-gray-800 font-semibold rounded-full shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <ShoppingCartIcon className="w-5 h-5 text-green-600" />
                        <span>View My Buy List ({buyList.length})</span>
                        <ChevronDownIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2">
                         <SearchResults
                            products={searchResults}
                            onAddToList={handleAddToList}
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>
                    <div className="lg:col-span-1 lg:sticky lg:top-6" ref={buyListRef}>
                        <BuyList 
                            items={buyList} 
                            onRemoveItem={handleRemoveFromList} 
                            onToggleTaken={handleToggleTakenStatus}
                        />
                    </div>
                </div>
            </main>
            
            <Toast message={toastMessage} isVisible={!!toastMessage} />

            <button
                onClick={handleScrollButtonClick}
                className="fixed bottom-6 right-6 bg-green-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300 z-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label={showScrollToTop ? 'Scroll to top' : 'Scroll to buy list'}
            >
                {showScrollToTop ? <ArrowUpIcon className="w-7 h-7" /> : <ShoppingCartIcon className="w-7 h-7" />}
            </button>
        </div>
    );
};

export default App;
