export const statusColors = [
{ status: "Completed", color: "#008236", bgCol: "#DCFCE6" },
  { status: "Processing", color: "#EAB308", bgCol: "#FEF9C3" },
  { status: "Shipped", color: "#2563EB", bgCol: "#DBEAFE" },
  { status: "Pending", color: "#DC2626", bgCol: "#FEE2E2" },

//   { status: "500", color: "#008236", bgCol: "#DCFCE6" },
//   { status: "250", color: "#EAB308", bgCol: "#FEF9C3" },
//   { status: "100", color: "#2563EB", bgCol: "#DBEAFE" },
//   { status: "50", color: "#DC2626", bgCol: "#FEE2E2" },

  { status: "Active", colors: "#008236", bgCol: "#DCFCE6" },
  { status: "Draft", colors: "#EAB308", bgCol: "#FEF9C3" },
  { status: "--", colors: "#2563EB", bgCol: "#DBEAFE" },
  { status: "Inactive", colors: "#DC2626", bgCol: "#FEE2E2" },
]

// statusColors export ko rehne do, but stock ke liye naya logic banao

export const getStockColors = (stockValue) => {
  const stock = parseInt(stockValue); // stock ko number mein convert karein

  if (stock >= 500) {
    // Green (High Stock)
    return { color: "#008236", bgCol: "#DCFCE6" };
  } else if (stock >= 100) {
    // Yellow (Medium/Processing Stock)
    return { color: "#EAB308", bgCol: "#FEF9C3" };
  } else if (stock >= 50) {
    // Blue (Low Stock)
    return { color: "#2563EB", bgCol: "#DBEAFE" };
  } else {
    // Red (Very Low/Pending Stock)
    return { color: "#DC2626", bgCol: "#FEE2E2" };
  }
};