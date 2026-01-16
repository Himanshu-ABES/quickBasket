import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  ShoppingCart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "./lib/supabase";
import ProductCard from "./components/ProductCard";
import {
  useCartStore,
  selectCartTotal,
  selectItemCount,
} from "./store/useCartStore";

/**
 * App Component
 * Blinkit-style homepage for quickBasket
 */
function App() {
  // State for categories and products
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Search placeholder animation state
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const searchPlaceholders = [
    '"milk"',
    '"eggs"',
    '"bread"',
    '"rice"',
    '"chips"',
    '"cold drinks"',
    '"fruits"',
  ];

  // Animate search placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex((prevIndex) =>
        prevIndex === searchPlaceholders.length - 1 ? 0 : prevIndex + 1
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Cart state
  const cartTotal = useCartStore(selectCartTotal);
  const itemCount = useCartStore(selectItemCount);
  const fetchCartItems = useCartStore((state) => state.fetchCartItems);

  // Promo cards data
  const promoCards = [
    {
      id: 1,
      image: "/images/products/pharmacy-WEB.avif",
    },
    {
      id: 2,
      image: "/images/products/pet_crystal_WEB-1.avif",
    },
    {
      id: 3,
      image: "/images/products/baby_crystal_WEB-1.avif",
    },
  ];

  // Category data with images and names (Blinkit style - 20 categories)
  const categoryData = [
    { name: "Paan Corner", image: "/images/products/paan-corner_web.avif" },
    { name: "Dairy, Bread & Eggs", image: "/images/products/Slice-2_10.avif" },
    { name: "Fruits & Vegetables", image: "/images/products/Slice-3_9.avif" },
    { name: "Cold Drinks & Juices", image: "/images/products/Slice-4_9.avif" },
    { name: "Snacks & Munchies", image: "/images/products/Slice-5_4.avif" },
    {
      name: "Breakfast & Instant Food",
      image: "/images/products/Slice-6_5.avif",
    },
    { name: "Sweet Tooth", image: "/images/products/Slice-7_3.avif" },
    { name: "Bakery & Biscuits", image: "/images/products/Slice-8_4.avif" },
    {
      name: "Tea, Coffee & Health Drinks",
      image: "/images/products/Slice-10.avif",
    },
    { name: "Atta, Rice & Dal", image: "/images/products/Slice-11.avif" },
    { name: "Masala, Oil & More", image: "/images/products/Slice-12.avif" },
    { name: "Sauces & Spreads", image: "/images/products/Slice-13.avif" },
    { name: "Chicken, Meat & Fish", image: "/images/products/Slice-14.avif" },
    {
      name: "Organic & Healthy Living",
      image: "/images/products/Slice-15.avif",
    },
    { name: "Baby Care", image: "/images/products/Slice-16.avif" },
    { name: "Pharma & Wellness", image: "/images/products/Slice-17.avif" },
    { name: "Cleaning Essentials", image: "/images/products/Slice-18.avif" },
    { name: "Home & Office", image: "/images/products/Slice-19.avif" },
    { name: "Personal Care", image: "/images/products/Slice-20.avif" },
    { name: "Pet Care", image: "/images/products/Slice-7-1_0.avif" },
  ];

  // Fetch data on mount
  useEffect(() => {
    fetchCategories();
    fetchCartItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);

      // Fetch products for each category
      if (data && data.length > 0) {
        fetchAllProducts(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAllProducts = async (categoriesList) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (error) throw error;

      // Group products by category
      const grouped = {};
      categoriesList.forEach((cat) => {
        grouped[cat.id] = (data || []).filter(
          (product) => product.category_id === cat.id
        );
      });
      setProductsByCategory(grouped);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll handler for product rows
  const scrollRow = (categoryId, direction) => {
    const container = document.getElementById(`product-row-${categoryId}`);
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header / Navbar */}
      <header className="bg-transparent sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-black tracking-tight">
                <span className="text-[#F8CB46]">quick</span>
                <span className="text-[#0C831F]">Basket</span>
              </h1>
            </div>

            {/* Delivery Info & Location */}
            <div className="hidden md:flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-left">
                <p className="text-base font-bold text-[#0C0C0C]">
                  Delivery in 8 minutes
                </p>
                <p className="text-sm text-[#0C0C0C]/70 flex items-center gap-1">
                  <MapPin size={14} />
                  Select your location
                  <ChevronDown size={16} />
                </p>
              </div>
            </div>

            {/* Search Bar with Animated Placeholder */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 rounded-lg bg-gray-100 text-[#0C0C0C] focus:outline-none focus:ring-2 focus:ring-[#0C831F]/30 transition-shadow text-sm"
                />
                {/* Animated Placeholder */}
                {!searchQuery && (
                  <div className="absolute left-12 top-1/2 transform -translate-y-1/2 pointer-events-none overflow-hidden h-5">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentPlaceholderIndex}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="text-gray-400 text-sm block"
                      >
                        Search {searchPlaceholders[currentPlaceholderIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* Login Button */}
            <button className="hidden sm:block text-[#0C0C0C] text-[15px] font-medium hover:opacity-80 transition-opacity">
              Login
            </button>

            {/* Cart Button */}
            <button className="flex items-center gap-2 bg-[#0C831F] text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-[#0a6e1a] transition-colors">
              <ShoppingCart size={18} />
              <span className="hidden sm:inline">My Cart</span>
              {itemCount > 0 && (
                <span className="bg-white text-[#0C831F] text-xs font-bold px-1.5 py-0.5 rounded">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 lg:px-8 py-4">
        {/* Hero Banner */}
        <section className="mb-6">
          <div className="relative overflow-hidden rounded-[16px]">
            <img
              src="/images/products/home-banner.jpg"
              alt="Stock up on daily essentials"
              className="w-full h-auto object-contain rounded-[16px]"
            />
          </div>
        </section>

        {/* Promo Cards - 3 Cards */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promoCards.map((card) => (
              <div
                key={card.id}
                className="rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-gray-100"
              >
                <img
                  src={card.image}
                  alt="Promo"
                  className="w-full h-auto aspect-[16/9] object-contain rounded-2xl"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Category Grid - 2 rows of 10 (Blinkit style) */}
        <section className="mb-10">
          <div className="grid grid-cols-5 md:grid-cols-10 gap-4 md:gap-6">
            {categoryData.map((category, index) => (
              <div
                key={index}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-2xl overflow-hidden bg-[#F0F4F8] mb-2 group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-[160%] object-cover object-top scale-110"
                  />
                </div>
                <span className="text-[11px] md:text-xs text-center text-gray-500 font-semibold leading-tight max-w-[80px] md:max-w-[100px]">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Product Sections by Category */}
        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div
                      key={j}
                      className="flex-shrink-0 w-[160px] bg-white border border-gray-100 rounded-xl p-3 animate-pulse"
                    >
                      <div className="bg-gray-200 h-28 rounded-lg mb-3" />
                      <div className="bg-gray-200 h-3 rounded mb-2" />
                      <div className="bg-gray-200 h-3 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => {
              const products = productsByCategory[category.id] || [];
              if (products.length === 0) return null;

              return (
                <section key={category.id}>
                  {/* Section Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg md:text-xl font-bold text-[#0C0C0C]">
                      {category.name}
                    </h2>
                    <button className="text-[#0C831F] font-semibold text-sm hover:underline">
                      see all
                    </button>
                  </div>

                  {/* Product Row with Scroll Arrows */}
                  <div className="relative group">
                    {/* Left Arrow */}
                    <button
                      onClick={() => scrollRow(category.id, "left")}
                      className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                    >
                      <ChevronLeft size={20} className="text-gray-600" />
                    </button>

                    {/* Products Container */}
                    <div
                      id={`product-row-${category.id}`}
                      className="flex gap-4 overflow-x-auto hide-scrollbar pb-2"
                    >
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className="flex-shrink-0 w-[160px] md:w-[180px]"
                        >
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                      onClick={() => scrollRow(category.id, "right")}
                      className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                    >
                      <ChevronRight size={20} className="text-gray-600" />
                    </button>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#F5F5F5] mt-16 py-12">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Useful Links */}
            <div>
              <h3 className="font-bold text-[#0C0C0C] mb-4">Useful Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="hover:text-[#0C831F] cursor-pointer">Blog</li>
                <li className="hover:text-[#0C831F] cursor-pointer">Privacy</li>
                <li className="hover:text-[#0C831F] cursor-pointer">Terms</li>
                <li className="hover:text-[#0C831F] cursor-pointer">FAQs</li>
                <li className="hover:text-[#0C831F] cursor-pointer">
                  Security
                </li>
                <li className="hover:text-[#0C831F] cursor-pointer">Contact</li>
              </ul>
            </div>

            {/* More Links */}
            <div>
              <h3 className="font-bold text-[#0C0C0C] mb-4">Partner</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="hover:text-[#0C831F] cursor-pointer">Partner</li>
                <li className="hover:text-[#0C831F] cursor-pointer">
                  Franchise
                </li>
                <li className="hover:text-[#0C831F] cursor-pointer">Seller</li>
                <li className="hover:text-[#0C831F] cursor-pointer">
                  Warehouse
                </li>
                <li className="hover:text-[#0C831F] cursor-pointer">Deliver</li>
                <li className="hover:text-[#0C831F] cursor-pointer">
                  Resources
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-bold text-[#0C0C0C]">Categories</h3>
                <span className="text-[#0C831F] text-sm font-semibold cursor-pointer hover:underline">
                  see all
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                {categories.slice(0, 12).map((cat) => (
                  <span
                    key={cat.id}
                    className="hover:text-[#0C831F] cursor-pointer"
                  >
                    {cat.name}
                  </span>
                ))}
                {/* Additional static categories */}
                <span className="hover:text-[#0C831F] cursor-pointer">
                  Dairy & Breakfast
                </span>
                <span className="hover:text-[#0C831F] cursor-pointer">
                  Fruits & Vegetables
                </span>
                <span className="hover:text-[#0C831F] cursor-pointer">
                  Snacks & Drinks
                </span>
                <span className="hover:text-[#0C831F] cursor-pointer">
                  Beauty & Cosmetics
                </span>
                <span className="hover:text-[#0C831F] cursor-pointer">
                  Home & Kitchen
                </span>
                <span className="hover:text-[#0C831F] cursor-pointer">
                  Electronics
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © quickBasket Commerce Private Limited, 2024-2026
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Download App</span>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="App Store"
                className="h-10 cursor-pointer hover:opacity-80"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Play Store"
                className="h-10 cursor-pointer hover:opacity-80"
              />
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Cart Button (Mobile) */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
          <button className="flex items-center gap-4 bg-[#0C831F] text-white px-6 py-4 rounded-xl shadow-2xl hover:bg-[#0a6e1a] transition-colors">
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} />
              <span className="font-bold">{itemCount} items</span>
            </div>
            <div className="w-px h-6 bg-white/30" />
            <span className="font-bold">₹{cartTotal.toFixed(0)}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
