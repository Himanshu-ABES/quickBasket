import { motion } from "framer-motion";
import { Minus, Plus, Clock } from "lucide-react";
import { useCartStore } from "../store/useCartStore";

/**
 * ProductCard Component
 *
 * Blinkit-style product card for the quickBasket app.
 * Features:
 * - Smart ADD button that transforms into a quantity counter
 * - Delivery time badge
 * - Discount badge when applicable
 * - Subtle scale animation on interactions
 */
const ProductCard = ({ product }) => {
  // Destructure product properties for readability
  const {
    id: productId,
    name: productName,
    price: currentPrice,
    original_price: originalPrice,
    weight: productWeight,
    image_url: imageUrl,
    is_veg: isVegetarian = true,
  } = product;

  // Get cart actions and current quantity from store
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const cartItems = useCartStore((state) => state.items);

  // Find the current item quantity in cart
  const cartItem = cartItems.find((item) => item.product_id === productId);
  const itemQuantity = cartItem?.quantity || 0;

  // Calculate discount percentage if original price exists
  const hasDiscount = originalPrice && originalPrice > currentPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  // Handle add to cart
  const handleAddToCart = () => {
    addItem(product);
  };

  // Handle remove from cart
  const handleRemoveFromCart = () => {
    removeItem(productId);
  };

  return (
    <motion.div
      className="bg-white border border-gray-100 rounded-lg sm:rounded-xl p-2 sm:p-3 flex flex-col h-full hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Product Image Container */}
      <div className="relative mb-1.5 sm:mb-2">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-0 left-0 bg-[#538CEE] text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded-br-md sm:rounded-br-lg rounded-tl-md sm:rounded-tl-lg z-10">
            {discountPercentage}%
            <br />
            OFF
          </div>
        )}

        {/* Product Image */}
        <motion.img
          src={imageUrl}
          alt={productName}
          className="w-full h-20 sm:h-24 md:h-28 object-contain rounded-md sm:rounded-lg bg-white"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          loading="lazy"
        />
      </div>

      {/* Delivery Time Badge */}
      <div className="flex items-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
        <Clock size={10} className="text-gray-400 sm:w-3 sm:h-3" />
        <span className="text-[9px] sm:text-[11px] text-gray-500 font-medium">
          8 MINS
        </span>
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col">
        {/* Product Name */}
        <h3 className="text-[#0C0C0C] font-medium text-[10px] sm:text-xs leading-tight mb-0.5 sm:mb-1 line-clamp-2 min-h-[24px] sm:min-h-[32px]">
          {productName}
        </h3>

        {/* Product Weight */}
        <p className="text-gray-400 text-[9px] sm:text-[11px] mb-1.5 sm:mb-2">
          {productWeight}
        </p>

        {/* Price and Add Button Row */}
        <div className="mt-auto flex items-center justify-between gap-1 sm:gap-2">
          {/* Price Container */}
          <div className="flex flex-col">
            <span className="text-[#0C0C0C] font-bold text-xs sm:text-sm">
              ₹{currentPrice}
            </span>
            {hasDiscount && (
              <span className="text-gray-400 text-[8px] sm:text-[10px] line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>

          {/* Smart Add/Counter Button */}
          {itemQuantity === 0 ? (
            /* ADD Button - Shown when quantity is 0 */
            <motion.button
              onClick={handleAddToCart}
              className="bg-white border border-[#0C831F] text-[#0C831F] font-bold text-[10px] sm:text-xs px-2 sm:px-4 py-1 sm:py-1.5 rounded-md sm:rounded-lg hover:bg-[#0C831F] hover:text-white transition-colors duration-200"
              whileTap={{ scale: 0.95 }}
            >
              ADD
            </motion.button>
          ) : (
            /* Quantity Counter - Shown when quantity > 0 */
            <div className="flex items-center bg-[#0C831F] rounded-md sm:rounded-lg overflow-hidden">
              {/* Minus Button */}
              <motion.button
                onClick={handleRemoveFromCart}
                className="text-white px-1.5 sm:px-2 py-1 sm:py-1.5 hover:bg-[#0a6e1a] transition-colors duration-200"
                whileTap={{ scale: 0.9 }}
                aria-label="Decrease quantity"
              >
                <Minus
                  size={12}
                  strokeWidth={3}
                  className="sm:w-3.5 sm:h-3.5"
                />
              </motion.button>

              {/* Quantity Display */}
              <motion.span
                key={itemQuantity}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="text-white font-bold text-[10px] sm:text-xs px-1 sm:px-2 min-w-[16px] sm:min-w-[20px] text-center"
              >
                {itemQuantity}
              </motion.span>

              {/* Plus Button */}
              <motion.button
                onClick={handleAddToCart}
                className="text-white px-1.5 sm:px-2 py-1 sm:py-1.5 hover:bg-[#0a6e1a] transition-colors duration-200"
                whileTap={{ scale: 0.9 }}
                aria-label="Increase quantity"
              >
                <Plus size={12} strokeWidth={3} className="sm:w-3.5 sm:h-3.5" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
