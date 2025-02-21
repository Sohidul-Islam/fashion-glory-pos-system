import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaSearch, FaEdit, FaFilter } from "react-icons/fa";
import AXIOS from "@/api/network/Axios";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";
import InputWithIcon from "@/components/InputWithIcon";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiBox,
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  businessName: string;
  businessType: string;
  accountStatus: "active" | "inactive";
  accountType: "super admin" | "admin" | "default";
  isVerified: boolean;
  createdAt: string;
}

interface UserResponse {
  users: User[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const Users = () => {
  const queryClient = useQueryClient();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const user = useAuth();

  console.log({ user: user?.user?.accountType });

  const [filters, setFilters] = useState({
    searchKey: "",
    accountStatus: "",
    accountType: "",
    page: 1,
    pageSize: 10,
  });

  // Fetch Users
  const { data: userData, isLoading } = useQuery<UserResponse>({
    queryKey: ["users", filters],
    queryFn: async () => {
      const response = await AXIOS.get("/users", { params: filters });
      return response.data;
    },
  });

  // Update User Mutation
  const updateUserMutation = useMutation({
    mutationFn: async (data: Partial<User> & { userId: number }) => {
      const response = await AXIOS.post(`/profile?userId=${data.userId}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("User updated successfully");
      setShowEditModal(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update user");
    },
  });

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleUpdateUser = (formData: Partial<User>) => {
    if (!selectedUser) return;
    updateUserMutation.mutate({ ...formData, userId: selectedUser.id });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by email..."
              value={filters.searchKey}
              onChange={handleFilterChange}
              name="searchKey"
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 border rounded-lg hover:bg-gray-50"
          >
            <FaFilter className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Status
            </label>
            <select
              name="accountStatus"
              value={filters.accountStatus}
              onChange={handleFilterChange}
              className="mt-1 border rounded-lg p-2 block w-full border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Type
            </label>
            <select
              name="accountType"
              value={filters.accountType}
              onChange={handleFilterChange}
              className="mt-1 block w-full border rounded-lg p-2 border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
            >
              <option value="">All</option>
              <option value="super admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="default">Default</option>
            </select>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <p>Loading...</p>
                  </td>
                </tr>
              ) : (
                userData?.users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.phoneNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {user.businessName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.businessType}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.accountStatus === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.accountStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {user.accountType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="text-brand-primary hover:text-brand-hover"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {userData && (
        <Pagination
          currentPage={filters.page}
          totalPages={userData.pagination.totalPages}
          totalItems={userData.pagination.totalItems}
          pageSize={filters.pageSize}
          hasNextPage={userData.pagination.hasNextPage}
          hasPreviousPage={userData.pagination.hasPreviousPage}
          onPageChange={handlePageChange}
        />
      )}

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit User"
      >
        {selectedUser && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleUpdateUser({
                fullName: formData.get("fullName") as string,
                email: formData.get("email") as string,
                phoneNumber: formData.get("phoneNumber") as string,
                location: formData.get("location") as string,
                businessName: formData.get("businessName") as string,
                businessType: formData.get("businessType") as string,
                accountStatus: formData.get("accountStatus") as
                  | "active"
                  | "inactive",
                accountType: formData.get("accountType") as
                  | "super admin"
                  | "admin"
                  | "default",
              });
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <InputWithIcon
                  type="text"
                  name="fullName"
                  icon={<FiUser className="text-gray-400" />}
                  defaultValue={selectedUser.fullName}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <InputWithIcon
                  type="email"
                  name="email"
                  icon={<FiMail className="text-gray-400" />}
                  defaultValue={selectedUser.email}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <InputWithIcon
                  type="tel"
                  name="phoneNumber"
                  icon={<FiPhone className="text-gray-400" />}
                  defaultValue={selectedUser.phoneNumber}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <InputWithIcon
                  type="text"
                  name="location"
                  icon={<FiMapPin className="text-gray-400" />}
                  defaultValue={selectedUser.location}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Name
                </label>
                <InputWithIcon
                  type="text"
                  name="businessName"
                  icon={<FiBriefcase className="text-gray-400" />}
                  defaultValue={selectedUser.businessName}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Type
                </label>
                <InputWithIcon
                  type="text"
                  name="businessType"
                  icon={<FiBox className="text-gray-400" />}
                  defaultValue={selectedUser.businessType}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Status
                </label>
                <select
                  name="accountStatus"
                  defaultValue={selectedUser.accountStatus}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <select
                  name="accountType"
                  defaultValue={selectedUser.accountType}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                >
                  <option value="super admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="default">Default</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateUserMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-brand-hover rounded-md disabled:opacity-50"
              >
                {updateUserMutation.isPending ? "Updating..." : "Update User"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Users;
