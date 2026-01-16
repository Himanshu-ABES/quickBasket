import { create } from "zustand";
import { supabase } from "../lib/supabase";

/**
 * useCartStore - Zustand Store for Cart Management
 *
 * Features:
 * - Optimistic updates (UI updates first, then syncs with Supabase)
 * - Automatic cart total calculation
 * - Seamless integration with Supabase cart_items table
 */
const useCartStore = create((set, get) => ({
  // Cart items array
  items: [],

  // Loading state for async operations
  isLoading: false,

  // Error state
  error: null,

  /**
   * Fetch cart items from Supabase for the authenticated user
   */
  fetchCartItems: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      set({ items: [], isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const { data: cartItems, error } = await supabase
        .from("cart_items")
        .select(
          `
                    id,
                    product_id,
                    quantity,
                    products (
                        id,
                        name,
                        price,
                        original_price,
                        weight,
                        image_url,
                        is_veg
                    )
                `
        )
        .eq("user_id", user.id);

      if (error) throw error;

      set({ items: cartItems || [], isLoading: false });
    } catch (error) {
      console.error("Error fetching cart items:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  /**
   * Add item to cart with optimistic update
   * @param {Object} product - The product to add
   */
  addItem: async (product) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn("User must be logged in to add items to cart");
      return;
    }

    const currentItems = get().items;
    const existingItemIndex = currentItems.findIndex(
      (item) => item.product_id === product.id
    );

    // OPTIMISTIC UPDATE: Update UI immediately
    if (existingItemIndex !== -1) {
      // Item exists, increment quantity
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1,
      };
      set({ items: updatedItems });
    } else {
      // New item, add to cart
      const newCartItem = {
        id: `temp-${Date.now()}`, // Temporary ID for optimistic update
        product_id: product.id,
        quantity: 1,
        products: product,
      };
      set({ items: [...currentItems, newCartItem] });
    }

    // SYNC WITH SUPABASE
    try {
      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const existingItem = currentItems[existingItemIndex];
        const newQuantity = existingItem.quantity + 1;

        const { error } = await supabase
          .from("cart_items")
          .update({
            quantity: newQuantity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingItem.id);

        if (error) throw error;
      } else {
        // Insert new cart item
        const { data, error } = await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity: 1,
          })
          .select(
            `
                        id,
                        product_id,
                        quantity,
                        products (
                            id,
                            name,
                            price,
                            original_price,
                            weight,
                            image_url,
                            is_veg
                        )
                    `
          )
          .single();

        if (error) throw error;

        // Replace temporary item with real data from Supabase
        const updatedItems = get().items.map((item) =>
          item.id.toString().startsWith("temp-") &&
          item.product_id === product.id
            ? data
            : item
        );
        set({ items: updatedItems });
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      // Rollback optimistic update on error
      set({ items: currentItems, error: error.message });
    }
  },

  /**
   * Remove item from cart with optimistic update
   * @param {string} productId - The product ID to remove
   */
  removeItem: async (productId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.warn("User must be logged in to remove items from cart");
      return;
    }

    const currentItems = get().items;
    const existingItemIndex = currentItems.findIndex(
      (item) => item.product_id === productId
    );

    if (existingItemIndex === -1) {
      console.warn("Item not found in cart");
      return;
    }

    const existingItem = currentItems[existingItemIndex];
    const currentQuantity = existingItem.quantity;

    // OPTIMISTIC UPDATE: Update UI immediately
    if (currentQuantity > 1) {
      // Decrement quantity
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: currentQuantity - 1,
      };
      set({ items: updatedItems });
    } else {
      // Remove item entirely
      const filteredItems = currentItems.filter(
        (item) => item.product_id !== productId
      );
      set({ items: filteredItems });
    }

    // SYNC WITH SUPABASE
    try {
      if (currentQuantity > 1) {
        // Update quantity in database
        const { error } = await supabase
          .from("cart_items")
          .update({
            quantity: currentQuantity - 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingItem.id);

        if (error) throw error;
      } else {
        // Delete item from database
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("id", existingItem.id);

        if (error) throw error;
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      // Rollback optimistic update on error
      set({ items: currentItems, error: error.message });
    }
  },

  /**
   * Clear all items from cart
   */
  clearCart: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const currentItems = get().items;

    // OPTIMISTIC UPDATE
    set({ items: [] });

    // SYNC WITH SUPABASE
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error clearing cart:", error);
      // Rollback on error
      set({ items: currentItems, error: error.message });
    }
  },

  /**
   * Get total number of items in cart
   */
  get itemCount() {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  /**
   * Clear any error state
   */
  clearError: () => set({ error: null }),
}));

/**
 * Computed selector for cart total
 * Use this in components: const cartTotal = useCartStore(selectCartTotal);
 */
export const selectCartTotal = (state) => {
  return state.items.reduce((total, item) => {
    const itemPrice = item.products?.price || 0;
    const itemQuantity = item.quantity || 0;
    return total + itemPrice * itemQuantity;
  }, 0);
};

/**
 * Computed selector for total item count
 */
export const selectItemCount = (state) => {
  return state.items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Computed selector for total savings
 */
export const selectTotalSavings = (state) => {
  return state.items.reduce((total, item) => {
    const originalPrice =
      item.products?.original_price || item.products?.price || 0;
    const currentPrice = item.products?.price || 0;
    const savings = (originalPrice - currentPrice) * item.quantity;
    return total + savings;
  }, 0);
};

export { useCartStore };
