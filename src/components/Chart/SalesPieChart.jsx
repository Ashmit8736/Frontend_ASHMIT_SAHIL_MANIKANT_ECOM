import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const SalesPieChart = () => {
const categoryData = [
  { name: "Electronics", value: 40000 },
  { name: "Fashion", value: 25000 },
  { name: "Groceries", value: 15000 },
  { name: "Books", value: 10000 },
];
    return (
        <div>
            <PieChart width={400} height={300}>
                <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                >
                    {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    )
}

export default SalesPieChart