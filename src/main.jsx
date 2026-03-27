// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import { RouterProvider } from "react-router-dom";
// import router from "./Route/Route.jsx";
// import { store } from "./store/Store.jsx";
// import { Provider } from "react-redux";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import ScrollToTop from "./components/ScrollToTop/ScrollToTop.jsx";

// createRoot(document.getElementById("root")).render(

//   <StrictMode>

//     <Provider store={store}>
//       <RouterProvider router={router} />

//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//     </Provider>
//   </StrictMode>
// );



import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./Route/Route.jsx";
import { store } from "./store/Store.jsx";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCart } from "./store/slices/cartSlice";
import api from "./store/APi/axiosInstance";

// ✅ Naya wrapper component
const AppInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart");
        const items = res.data?.data || [];
        dispatch(setCart(items));
      } catch {
        dispatch(setCart([]));
      }
    };
    fetchCart();
  }, []);

  return null; // kuch render nahi karta, sirf cart fetch karta hai
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppInit /> {/* ✅ Yahan add karo */}
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Provider>
  </StrictMode>
);