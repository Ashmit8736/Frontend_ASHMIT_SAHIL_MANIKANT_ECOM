// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     items: [],
// };

// const cartSlice = createSlice({
//     name: "cart",
//     initialState,
//     reducers: {
//         addToCart: (state, action) => {
//             const item = action.payload;
//             const existingItem = state.items.find((i) => i.id === item.id);
//             if (existingItem) {
//                 existingItem.quantity += 1;
//             } else {
//                 state.items.push({ ...item, quantity: 1 });
//             }
//         },
//     },
// });

// export const { addToCart } = cartSlice.actions;
// export default cartSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [], // backend se aane wale cart items
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // ✅ FULL CART SET (Navbar / refresh ke liye)
        setCart(state, action) {
            state.items = action.payload || [];
        },

        // ✅ ADD / UPDATE SINGLE ITEM (optional)
        addOrUpdateItem(state, action) {
            const item = action.payload;

            const existing = state.items.find(
                (i) => i.product_id === item.product_id
            );

            if (existing) {
                existing.quantity = item.quantity;
            } else {
                state.items.push(item);
            }
        },

        // ✅ CLEAR CART (logout ke liye)
        clearCart(state) {
            state.items = [];
        },
        removeItem(state, action) {
            const { product_id, owner_type } = action.payload;

            state.items = state.items.filter(
                (item) =>
                    !(
                        item.product_id === product_id &&
                        item.owner_type === owner_type
                    )
            );
        }
    },
});

export const { setCart, addOrUpdateItem, clearCart, removeItem, } = cartSlice.actions;
export default cartSlice.reducer;
