export const isBuyerLoggedIn = () => {
    return !!localStorage.getItem("buyerToken");
};
