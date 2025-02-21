import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSearch, FaEye, FaFilter } from "react-icons/fa";
import AXIOS from "@/api/network/Axios";
import { ORDERS_URL } from "@/api/api";
import Pagination from "@/components/Pagination";
import { toast } from "react-toastify";
import Modal from "@/components/Modal";
import Invoice from "@/components/Invoice";
import { BiSpreadsheet } from "react-icons/bi";
import ProductStatement from "@/components/ProductStatement";

interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: string;
  purchasePrice: string;
  subtotal: string;
  Product: {
    name: string;
    sku: string;
  };
  ProductVariant?: {
    sku: string;
    Color: {
      name: string;
    };
    Size: {
      name: string;
    };
  } | null;
}

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
  paymentMethod: "cash" | "card" | "mobile_banking";
  paymentStatus: "pending" | "completed" | "failed";
  orderStatus: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  UserId: number;
  OrderItems: OrderItem[];
}

interface PaginationData {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface OrdersResponse {
  orders: Order[];
  pagination: PaginationData;
}

interface FilterParams {
  page: number;
  pageSize: number;
  searchKey?: string;
  orderStatus?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
}

const Orders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    pageSize: 20,
  });

  const [isOpen, setIsOpen] = useState(false);

  // Fetch Orders
  const {
    data: ordersData,
    isLoading,
    isFetching,
  } = useQuery<OrdersResponse>({
    queryKey: ["orders", filters],
    queryFn: async () => {
      try {
        const response = await AXIOS.get(ORDERS_URL, { params: filters });
        return response.data;
      } catch (error: any) {
        toast.error(error?.message || "Failed to fetch orders");
        return { orders: [], pagination: {} as PaginationData };
      }
    },
  });

  console.log({ ordersData });

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

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, page: 1, searchKey: searchQuery }));
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, page: 1, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <form onSubmit={handleSearch} className="flex-1 md:w-80">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 border rounded-lg hover:bg-gray-50"
          >
            <FaFilter className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => {
              setShowFilters(!showFilters);
              setIsOpen(true);
            }}
            className="p-2 border rounded-lg hover:bg-gray-50"
          >
            <BiSpreadsheet className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow">
          <select
            value={filters.orderStatus || ""}
            onChange={(e) => handleFilterChange("orderStatus", e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="">All Order Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filters.paymentStatus || ""}
            onChange={(e) =>
              handleFilterChange("paymentStatus", e.target.value)
            }
            className="border rounded-lg p-2"
          >
            <option value="">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={filters.paymentMethod || ""}
            onChange={(e) =>
              handleFilterChange("paymentMethod", e.target.value)
            }
            className="border rounded-lg p-2"
          >
            <option value="">All Payment Methods</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="mobile_banking">Mobile Banking</option>
          </select>

          <div className="flex gap-2">
            <input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="border rounded-lg p-2 w-1/2"
            />
            <input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="border rounded-lg p-2 w-1/2"
            />
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">
                    <p>Loading...</p>
                    {/* <Spinner color="#32cd32" size="15px" /> */}
                  </td>
                </tr>
              ) : ordersData?.orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                ordersData?.orders.map((order: Order) => (
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
                        {/* <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowInvoice(true);
                          }}
                          className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full"
                          title="Print Invoice"
                        >
                          <FaFileInvoice className="w-4 h-4" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}

      <Pagination
        currentPage={filters.page}
        totalPages={ordersData?.pagination.totalPages || 1}
        totalItems={ordersData?.pagination.totalItems || 1}
        pageSize={filters.pageSize || 10}
        hasNextPage={ordersData?.pagination.hasNextPage || false}
        hasPreviousPage={ordersData?.pagination.hasPreviousPage || false}
        onPageChange={handlePageChange}
      />

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

      <ProductStatement
        isOpen={isOpen}
        startDate={filters?.startDate}
        endDate={filters?.endDate}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default Orders;
