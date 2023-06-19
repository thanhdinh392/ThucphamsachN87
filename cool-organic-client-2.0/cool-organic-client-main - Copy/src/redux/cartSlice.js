import { createSlice } from '@reduxjs/toolkit';

const calculateTotalPrice = (products) => {
  return products.reduce((total, item) => {
    return total + item.product.salePrice * item.quantity;
  }, 0);
};

const calculateTotalQuantity = (products) => {
  return products.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
};

const initialState = {
  products: [],
  totalPrice: 0,
  totalQuantity: 0,
  isLoading: true,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const index = state.products.findIndex(
        (item) => item.product.id === product.id
      );
      if (index === -1) {
        state.products.push({
          product,
          quantity,
        });
      } else {
        state.products[index].quantity += quantity;
      }
      state.totalQuantity += quantity;
      state.totalPrice += quantity * product.salePrice;
    },
    removeFromCart: (state, action) => {
      const { id, quantity } = action.payload;
      const index = state.products.findIndex((item) => item.product.id === id);
      state.products[index].quantity -= quantity;
      state.totalQuantity -= quantity;
      state.totalPrice -= quantity * state.products[index].product.salePrice;
      if (state.products[index].quantity === 0) {
        state.products.splice(index, 1);
      }
    },
    removeProductFromCart: (state, action) => {
      const productId = action.payload;
      const index = state.products.findIndex(
        (item) => item.product.id === productId
      );
      state.totalQuantity -= state.products[index].quantity;
      state.totalPrice -=
        state.products[index].quantity *
        state.products[index].product.salePrice;
      state.products.splice(index, 1);
    },
    setQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.products.find((item) => item.product.id === id);
      const product = item.product;
      state.totalQuantity -= item.quantity;
      state.totalPrice -= product.salePrice * item.quantity;
      item.quantity = quantity;
      state.totalQuantity += quantity;
      state.totalPrice += quantity * product.salePrice;
    },
    setCart: (state, action) => {
      state.products = action.payload;
      state.totalPrice = calculateTotalPrice(action.payload);
      state.totalQuantity = calculateTotalQuantity(action.payload);
    },
    setIsLoadingCart: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  removeProductFromCart,
  setQuantity,
  setCart,
  setIsLoadingCart,
} = cartSlice.actions;

export default cartSlice.reducer;
