"use client"; 

import { useState, useEffect } from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface Product {
  id: number;
  title: string;
  category: string;
}

interface ChartData {
  name: string; 
  products: number; 
}

export function BarChartSection() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductCategories() {
      try {
        const response = await fetch("https://dummyjson.com/products?limit=100");
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }
        const result = await response.json();
        const products: Product[] = result.products;

        const categoryCounts = products.reduce((acc, product) => {
          const categoryName = product.category || 'Unknown';
          acc.set(categoryName, (acc.get(categoryName) || 0) + 1);
          return acc;
        }, new Map<string, number>());

        const formattedData: ChartData[] = Array.from(categoryCounts.entries())
          .map(([name, products]) => ({ name, products }))
          .sort((a, b) => b.products - a.products); 

        setChartData(formattedData);
      } catch (err: any) {
        console.error("Error fetching or processing product data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProductCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 border rounded-lg bg-white shadow-sm mt-8 flex items-center justify-center h-[350px]">
        <p className="text-gray-500">Loading product category chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border rounded-lg bg-white shadow-sm mt-8 flex items-center justify-center h-[350px]">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-1 md:p-6 border rounded-lg bg-white shadow-sm mt-8">
      <h3 className="text-lg font-semibold mb-4">Products by Category</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
            <Legend />
            <Bar dataKey="products" fill="oklch(45% 0.085 224.283)" name="Number of Products" radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-74 text-gray-500">
          No product data available to display.
        </div>
      )}
    </div>
  );
}