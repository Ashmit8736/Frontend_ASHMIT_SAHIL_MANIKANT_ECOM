import { configureStore } from "@reduxjs/toolkit";
import sellerReducer from "./slices/Seller.slice";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
    reducer: {
        seller: sellerReducer,
        cart: cartReducer,

    },
});