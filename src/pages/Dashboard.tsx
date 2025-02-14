import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  FaShoppingCart,
  FaUsers,
  FaBoxOpen,
  FaChartLine,
  FaCalendar,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { ORDERS_URL } from "@/api/api";
import AXIOS from "@/api/network/Axios";
import Spinner from "@/components/Spinner";

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProfit: number;
  totalLoss: number;
  totalDiscount: number;
  totalTax: number;
}

type ChartData = {
  name: string; // e.g., "Feb 2025"
  date: string; // e.g., "2025-02"
  sales: number; // e.g., 3758.7
  discounts: number; // e.g., 0
  orderCount: number; // e.g., 3
  tax: number; // e.g., 0
  averageOrderValue: number; // e.g., 1252.9
};

// If you're working with an array of such data:
type ChartDataArray = ChartData[];

interface TopProduct {
  name: string;
  sku: string;
  totalQuantity: number;
  totalRevenue: number;
  profit: number;
  averagePrice: string;
}

const Dashboard: React.FC = () => {
  // Sample data for charts
  // const salesData = [
  //   { name: "Jan", sales: 4000 },
  //   { name: "Feb", sales: 3000 },
  //   { name: "Mar", sales: 5000 },
  //   { name: "Apr", sales: 4500 },
  //   { name: "May", sales: 6000 },
  //   { name: "Jun", sales: 5500 },
  // ];

  const productData = [
    { name: "Electronics", value: 400 },
    { name: "Clothing", value: 300 },
    { name: "Books", value: 200 },
    { name: "Food", value: 350 },
    { name: "Sports", value: 250 },
  ];

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)) // Previous 7 days
      .toISOString()
      .split("T")[0],
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)) // next days
      .toISOString()
      .split("T")[0],
  });

  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats", dateRange],
    queryFn: async () => {
      const response = await AXIOS.get(
        `${ORDERS_URL}/dashboard?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      );
      return response.data;
    },
  });

  const { data: chartsData, isLoading: chartsIsLoading } =
    useQuery<ChartDataArray>({
      queryKey: ["chart-stats", dateRange],
      queryFn: async () => {
        const response = await AXIOS.get(
          `${ORDERS_URL}/report/chart/sales?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        );
        return response.data?.chartData;
      },
    });

  const { data: topProducts } = useQuery<TopProduct[]>({
    queryKey: ["top-products"],
    queryFn: async () => {
      const response = await AXIOS.get(`${ORDERS_URL}/report/top-items`);
      return response.data;
    },
  });

  if (isLoading || chartsIsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner color="#32cd32" size="40px" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Filter */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FaCalendar className="text-gray-500" />
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
            }
            className="border rounded-md px-3 py-2 text-sm"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
            }
            className="border rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Stats Grid */}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-semibold text-gray-800">
                ${(stats?.totalSales || 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-800">
                {stats?.totalOrders || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaBoxOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Profit</p>
              <p className="text-2xl font-semibold text-gray-800">
                ${(stats?.totalProfit || 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaChartLine className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Loss</p>
              <p className="text-2xl font-semibold text-red-600">
                ${(stats?.totalLoss || 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FaChartLine className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Discount</p>
              <p className="text-2xl font-semibold text-orange-600">
                ${(stats?.totalDiscount || 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FaUsers className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Tax</p>
              <p className="text-2xl font-semibold text-indigo-600">
                ${(stats?.totalTax || 0).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <FaUsers className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Sales Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartsData?.map((item) => ({
                  name: item?.name,
                  order: item?.orderCount,
                  sales: item?.sales,
                  averageOrderValue: item?.averageOrderValue,
                }))}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#32cd32"
                  fill="#32cd32"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Categories Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Product Categories</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#32cd32" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts?.map((product, index) => (
                <tr
                  key={product.sku}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.sku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.totalQuantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${product.totalRevenue.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${product.averagePrice}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm ${
                        product.profit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ${product.profit.toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
