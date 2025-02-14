import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSearch, FaEye, FaFileInvoice } from "react-icons/fa";
import AXIOS from "@/api/network/Axios";
import { ORDERS_URL } from "@/api/api";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";
import Modal from "@/components/Modal";
import Invoice from "@/components/Invoice";

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  orderDate: string;
  subtotal: string;
  tax: string;
  discount: string;
  total: string;
  paymentMethod: "cash" | "card";
  paymentStatus: "pending" | "completed" | "failed";
  orderStatus: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  UserId: number;
}

const Orders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  // Fetch Orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const response = await AXIOS.get(ORDERS_URL);
        return response.data;
      } catch (error: any) {
        toast.error(error?.message || "Failed to fetch orders");
        return [];
      }
    },
  });

  // Filter orders based on search query
  const filteredOrders = orders?.filter(
    (order: Order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate final amount with discount
  // const calculateFinalAmount = (order: Order) => {
  //   const subtotal = Number(order.subtotal);
  //   const tax = Number(order.tax);
  //   const discount = Number(order.discount);
  //   return (subtotal + tax - discount).toFixed(2);
  // };

  // Handle print invoice
  const handlePrintInvoice = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Orders</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-semibold mt-2">{orders?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Completed Orders</h3>
          <p className="text-2xl font-semibold mt-2 text-green-600">
            {orders?.filter((o: Order) => o.orderStatus === "completed")
              .length || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Pending Orders</h3>
          <p className="text-2xl font-semibold mt-2 text-yellow-600">
            {orders?.filter((o: Order) => o.orderStatus === "pending").length ||
              0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <p className="text-2xl font-semibold mt-2">
            $
            {orders
              ?.reduce(
                (acc: number, curr: Order) => acc + Number(curr.total),
                0
              )
              .toFixed(2) || "0.00"}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">
                    <Spinner color="#32cd32" size="24px" />
                  </td>
                </tr>
              ) : filteredOrders?.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders?.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowInvoice(true);
                          }}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full"
                          title="View Order"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowInvoice(true);
                          }}
                          className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full"
                          title="Print Invoice"
                        >
                          <FaFileInvoice className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      <Modal
        isOpen={showInvoice}
        onClose={() => {
          setShowInvoice(false);
          setSelectedOrder(null);
        }}
        title="Order Invoice"
        className="max-w-4xl"
      >
        {selectedOrder && (
          <Invoice
            orderId={selectedOrder?.id}
            onClose={() => {
              setShowInvoice(false);
              setSelectedOrder(null);
            }}
            onPrint={handlePrintInvoice}
          />
        )}
      </Modal>
    </div>
  );
};

export default Orders;
