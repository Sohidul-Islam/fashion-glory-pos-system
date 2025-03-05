import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash, FaCrown } from "react-icons/fa";
import AXIOS from "@/api/network/Axios";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import { SUBSCRIPTION_PLAN } from "@/api/api";
import InputWithIcon from "@/components/InputWithIcon";

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  maxStorage: string;
  price: number;
  duration: number; // in months
  features: string[];
  maxProducts: number;
  maxUsers: number;
  status: "active" | "inactive";
}

interface PlanFormData {
  id?: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  maxStorage: string;
  maxProducts: number;
  maxUsers: number;
  status: "active" | "inactive";
}

const SubscriptionPlans = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<PlanFormData>({
    name: "",
    description: "",
    price: 0,
    maxStorage: "",
    duration: 1,
    features: [""],
    maxProducts: 0,
    maxUsers: 1,
    status: "active",
  });

  // Fetch Plans
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const response = await AXIOS.get(SUBSCRIPTION_PLAN);
      return response.data;
    },
  });

  // Create Plan Mutation
  const createMutation = useMutation({
    mutationFn: (data: PlanFormData) => AXIOS.post(SUBSCRIPTION_PLAN, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      toast.success("Plan created successfully");
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create plan");
    },
  });

  // Update Plan Mutation
  const updateMutation = useMutation({
    mutationFn: (data: PlanFormData) =>
      AXIOS.put(`${SUBSCRIPTION_PLAN}/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      toast.success("Plan updated successfully");
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update plan");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      duration: 1,
      features: [""],
      maxProducts: 0,
      maxUsers: 1,
      maxStorage: "",
      status: "active",
    });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""],
    });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner color="#32cd32" size="40px" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Subscription Plans</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-hover"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add Plan</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan: SubscriptionPlan) => (
          <div
            key={plan.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {plan.name}
                  </h3>
                  <p className="text-gray-500 mt-1">{plan.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFormData(plan);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-gray-600 hover:text-brand-primary"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">
                  ${plan.price}
                  <span className="text-base font-normal text-gray-500">
                    /{plan.duration} month{plan.duration > 1 ? "s" : ""}
                  </span>
                </p>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Features
                </h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <FaCrown className="w-4 h-4 text-brand-primary mt-1" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Max Products</span>
                  <span className="font-medium">{plan.maxProducts}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Max Storage</span>
                  <span className="font-medium">{plan.maxStorage}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Max Users</span>
                  <span className="font-medium">{plan.maxUsers}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    plan.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {plan.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Plan Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formData.id ? "Edit Plan" : "Add New Plan"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Plan Name*
              </label>
              <InputWithIcon
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <InputWithIcon
                name="description"
                type="textarea"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price ($)*
                </label>
                <InputWithIcon
                  type="number"
                  required
                  min="0"
                  step="0"
                  name="price"
                  value={formData.price?.toString()}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duration (months)*
                </label>
                <InputWithIcon
                  type="number"
                  required
                  min="1"
                  name="duration"
                  value={formData.duration?.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Features
              </label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <InputWithIcon
                    type="text"
                    value={feature}
                    name="features"
                    onChange={(e) => {
                      const newFeatures = [...formData.features];
                      newFeatures[index] = e.target.value;
                      setFormData({ ...formData, features: newFeatures });
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="mt-2 text-sm text-brand-primary hover:text-brand-hover"
              >
                + Add Feature
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Max Products*
                </label>
                <InputWithIcon
                  type="number"
                  required
                  min="0"
                  name="maxProducts"
                  value={formData.maxProducts?.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxProducts: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Max Users*
                </label>
                <InputWithIcon
                  type="number"
                  required
                  min="1"
                  name="maxUsers"
                  value={formData?.maxUsers?.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxUsers: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "active" | "inactive",
                  })
                }
                className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-md hover:bg-brand-hover disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <Spinner size="16px" color="#ffffff" className="mx-4 my-1" />
              ) : formData.id ? (
                "Update Plan"
              ) : (
                "Create Plan"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubscriptionPlans;
