import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
const Chart = () => {
  const data = [
  { month: "Jan", revenue: 32000 },
  { month: "Feb", revenue: 45000 },
  { month: "Mar", revenue: 40000 },
  { month: "Apr", revenue: 52000 },
  { month: "May", revenue: 61000 }
];
  return (
    <div>
    <BarChart width={500} height={300} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="revenue" fill="#00A63D" />
  </BarChart>
    </div>
  )
}

export default Chart