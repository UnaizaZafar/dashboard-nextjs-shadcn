"use client";
import { useState, useEffect } from "react";
import { Users, MapPin, Briefcase } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface User {
  id: number;
  gender: string;
  address: {
    city: string;
  };
  company: {
    department: string;
  };
}
interface Metric {
  title: string;
  description: string;
  value: string;
  stats: { label: string; count: number }[];
  icon: React.ReactNode;
}
const getGenderStats = (users: User[]): Metric => {
  const maleCount = users.filter(
    (u) => u.gender.toLowerCase() === "male"
  ).length;
  const femaleCount = users.filter(
    (u) => u.gender.toLowerCase() === "female"
  ).length;
  const total = users.length;

  return {
    title: "Gender Distribution",
    value: `${total.toLocaleString()} Users`,
    description: "Breakdown of users by gender.",
    icon: <Users className="h-4 w-4 text-muted-foreground" />,
    stats: [
      {
        label: `Male (${((maleCount / total) * 100).toFixed(0)}%)`,
        count: maleCount,
      },
      {
        label: `Female (${((femaleCount / total) * 100).toFixed(0)}%)`,
        count: femaleCount,
      },
    ],
  };
};
const getCityStats = (users: User[]): Metric => {
  const cityMap = users.reduce((acc, user) => {
    const city = user.address.city || "Unknown";
    acc.set(city, (acc.get(city) || 0) + 1);
    return acc;
  }, new Map<string, number>());

  const stats = Array.from(cityMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Show top 5 cities

  return {
    title: "Top 5 User Cities",
    value: `${users.length.toLocaleString()} Users`,
    description: "Most frequent cities in the dataset.",
    icon: <MapPin className="h-4 w-4 text-muted-foreground" />,
    stats,
  };
};
const getDepartmentStats = (users: User[]): Metric => {
  const departmentMap = users.reduce((acc, user) => {
    const department = user.company.department || "Unknown";
    acc.set(department, (acc.get(department) || 0) + 1);
    return acc;
  }, new Map<string, number>());

  const stats = Array.from(departmentMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Show top 5 departments

  return {
    title: "Top 5 User Departments",
    value: `${users.length.toLocaleString()} Users`,
    description: "Highest count of users per department.",
    icon: <Briefcase className="h-4 w-4 text-muted-foreground" />,
    stats,
  };
};
export function KPICards() {
  const [allMetrics, setAllMetrics] = useState<Metric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchAndCalculateMetrics() {
      try {
        const response = await fetch("https://dummyjson.com/users");
        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }
        const data = await response.json();
        const users: User[] = data.users;

        if (users.length === 0) {
          setAllMetrics([]);
          setIsLoading(false);
          return;
        }

        // Calculate all three metrics
        const genderMetric = getGenderStats(users);
        const cityMetric = getCityStats(users);
        const departmentMetric = getDepartmentStats(users);

        setAllMetrics([genderMetric, cityMetric, departmentMetric]);
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        setAllMetrics([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAndCalculateMetrics();
  }, []);
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-8">
        {/* Skeleton loading cards */}
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 w-1/2 rounded bg-gray-300 dark:bg-gray-600 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-3 w-11/12 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {allMetrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            {/* Main Value / Total */}
            <div className="text-2xl font-bold">{metric.value}</div>

            {/* Breakdown Stats */}
            <div className="mt-4 space-y-2 text-sm">
              {metric.stats.map((stat, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-white/90">{stat.label}:</span>
                  <span className="font-semibold">
                    {stat.count.toLocaleString()}
                  </span>
                </div>
              ))}
              {metric.stats.length === 0 && (
                <span className="text-muted-foreground">
                  No data available.
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
