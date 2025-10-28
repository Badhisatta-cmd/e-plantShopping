import { createSlice } from '@reduxjs/toolkit';

/**
 * Redux Slice for managing the shopping cart state
 * Handles adding, removing, and updating quantities of plants in the cart
 */
export const CartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // Array of cart items, each with plant details and quantity
  },
  reducers: {
    /**
     * Add a plant to cart or increment its quantity if already present
     * @param {Object} action.payload Plant object with name, image, description, cost
     */
    addItem: (state, action) => {
      const plant = action.payload;
      // Validate required plant properties
      if (!plant?.name || !plant?.cost) {
        console.error('Invalid plant data provided to addItem');
        return;
      }

      const existingIndex = state.items.findIndex(item => item.name === plant.name);
      if (existingIndex >= 0) {
        // If item exists, increment quantity (default to 1 if undefined)
        state.items[existingIndex].quantity = (state.items[existingIndex].quantity || 1) + 1;
      } else {
        // Add new item with quantity 1 and all plant details
        state.items.push({
          ...plant,
          quantity: 1
        });
      }
    },

    /**
     * Remove a plant from cart entirely
     * @param {string|Object} action.payload Plant name or object with name property
     */
    removeItem: (state, action) => {
      const name = typeof action.payload === 'string' ? action.payload : action.payload?.name;
      if (!name) {
        console.error('Invalid plant name provided to removeItem');
        return;
      }
      // Filter out the item with matching name
      state.items = state.items.filter(item => item.name !== name);
    },

    /**
     * Update quantity of a plant in cart, remove if quantity <= 0
     * @param {Object} action.payload Object with name and quantity
     * @param {string} action.payload.name Plant name
     * @param {number} action.payload.quantity New quantity (removes item if <= 0)
     */
    updateQuantity: (state, action) => {
      const { name, quantity } = action.payload || {};
      if (!name || typeof quantity !== 'number') {
        console.error('Invalid data provided to updateQuantity');
        return;
      }

      const idx = state.items.findIndex(item => item.name === name);
      if (idx >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is zero or negative
          state.items.splice(idx, 1);
        } else {
          // Update quantity if positive
          state.items[idx].quantity = quantity;
        }
      } else {
        console.error(`Item "${name}" not found in cart`);
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity } = CartSlice.actions;

export default CartSlice.reducer;
