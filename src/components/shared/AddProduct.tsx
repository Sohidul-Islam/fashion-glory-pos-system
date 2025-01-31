import {
  BRANDS_URL,
  CATEGORY_URL,
  PRODUCT_URL,
  UNITS_URL,
  UPDATE_PRODUCT_URL,
} from "@/api/api";

import AXIOS from "@/api/network/Axios";
import { successToast, uploadFile } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-toastify";
import InputWithIcon from "../InputWithIcon";
import {
  FaBox,
  FaDollarSign,
  FaPercent,
  FaBoxes,
  FaBell,
  FaCloudUploadAlt,
  FaTimes,
} from "react-icons/fa";
import { Brand, Unit } from "@/types/categoryType";
import { Category } from "@/types/categoryType";
import Spinner from "../Spinner";
import { ProductFormData } from "@/types/ProductType";

function AddProduct({
  productData,
  onClose,
}: {
  productData: ProductFormData;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState<ProductFormData>(productData);
  const [imagePreview, setImagePreview] = useState<string>("");

  const resetForm = () => {
    setFormData({
      id: undefined,
      code: null,
      sku: "",
      name: "",
      description: "",
      CategoryId: 0,
      BrandId: 0,
      UnitId: 0,
      alertQuantity: 0,
      productImage: "",
      discountType: null,
      discountAmount: null,
      purchasePrice: 0,
      salesPrice: 0,
      vat: 0,
      price: 0,
      stock: 0,
      status: "active",
    });
  };

  // Mutations
  const createMutation = useMutation<any, Error, ProductFormData>({
    mutationFn: (data: ProductFormData) => AXIOS.post(PRODUCT_URL, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create product");
    },
  });

  const updateMutation = useMutation<
    any,
    Error,
    { id: number; updates: ProductFormData }
  >({
    mutationFn: (data) =>
      AXIOS.post(`${UPDATE_PRODUCT_URL}/${data.id}`, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update product");
    },
  });

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.productImage;

      if (formData?.salesPrice < formData?.purchasePrice) {
        successToast("Sales price cannot be less than purchase price", "error");
        return;
      }

      // Upload image if new file is selected
      if (formData.imageFile) {
        imageUrl = await uploadFile(formData.imageFile);
        if (!imageUrl) {
          successToast("Failed to upload image", "error");
          return;
        }
      }

      const submitData = {
        ...formData,
        productImage: imageUrl,
      };

      if (formData.id) {
        updateMutation.mutate({
          id: formData.id,
          updates: submitData,
        });
      } else {
        createMutation.mutate(submitData);
      }
    } catch (error) {
      console.log(error);
      successToast("Failed to upload image", "error");
    }
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      const updatedData = { ...prevFormData, [name]: value };

      // Recalculate prices when related fields change
      if (
        name === "salesPrice" ||
        name === "discountType" ||
        name === "discountAmount" ||
        name === "vat"
      ) {
        const salesPrice = Number(updatedData.salesPrice || 0);
        const discountType = updatedData.discountType;
        const discountAmount = Number(updatedData.discountAmount || 0);
        const vat = Number(updatedData.vat || 0);

        let discountedPrice = salesPrice;

        // Apply discount
        if (discountType === "percentage") {
          discountedPrice -= (salesPrice * discountAmount) / 100;
        } else if (discountType === "amount") {
          discountedPrice -= discountAmount;
        }

        // Apply VAT
        const finalPrice = discountedPrice + (discountedPrice * vat) / 100;

        updatedData.price = Math.max(finalPrice, 0); // Ensure price is not negative
      }

      return updatedData;
    });
  };

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await AXIOS.get(CATEGORY_URL);
      return response.data;
    },
  });

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await AXIOS.get(BRANDS_URL);
      return response.data;
    },
  });

  const { data: units = [] } = useQuery<Unit[]>({
    queryKey: ["units"],
    queryFn: async () => {
      const response = await AXIOS.get(UNITS_URL);
      return response.data;
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SKU */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU*
          </label>
          <InputWithIcon
            icon={FaBox}
            name="sku"
            type="text"
            required
            placeholder="Enter SKU"
            value={formData.sku}
            onChange={handleInputChange}
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name*
          </label>
          <InputWithIcon
            icon={FaBox}
            name="name"
            type="text"
            required
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        {/* Description */}
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Enter product description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
            rows={3}
          />
        </div>

        {/* Category, Brand, Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category*
          </label>
          <select
            value={formData.CategoryId || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                CategoryId: e.target.value ? Number(e.target.value) : 0,
              })
            }
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand*
          </label>
          <select
            value={formData.BrandId || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                BrandId: e.target.value ? Number(e.target.value) : 0,
              })
            }
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
            required
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit*
          </label>
          <select
            value={formData.UnitId || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                UnitId: e.target.value ? Number(e.target.value) : 0,
              })
            }
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
            required
          >
            <option value="">Select Unit</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>

        {/* Prices */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Price*
          </label>
          <InputWithIcon
            icon={FaDollarSign}
            name="purchasePrice"
            type="number"
            step="0.01"
            required
            placeholder="Enter purchase price"
            value={formData.purchasePrice?.toString()}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sales Price*
          </label>
          <InputWithIcon
            icon={FaDollarSign}
            name="salesPrice"
            type="number"
            step="0.01"
            required
            placeholder="Enter sales price"
            value={formData.salesPrice?.toString()}
            onChange={handleInputChange}
          />
        </div>

        {/* Discount */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount Type
          </label>
          <select
            value={formData.discountType || ""}
            onChange={handleInputChange}
            name="discountType"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
          >
            <option value="">Select Discount Type</option>
            <option value="percentage">Percentage</option>
            <option value="amount">Amount</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount Amount
          </label>
          <InputWithIcon
            icon={FaDollarSign}
            name="discountAmount"
            type="number"
            step="0.01"
            placeholder="Enter discount amount"
            value={formData.discountAmount?.toString() || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* VAT */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            VAT (%)*
          </label>
          <InputWithIcon
            icon={FaPercent}
            name="vat"
            type="number"
            step="0.01"
            required
            placeholder="Enter VAT"
            value={formData.vat?.toString()}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Final Price*
          </label>
          <InputWithIcon
            icon={FaDollarSign}
            name="price"
            type="number"
            step="0.01"
            required
            placeholder="Enter final price"
            value={formData.price?.toString()}
            onChange={handleInputChange}
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock*
          </label>
          <InputWithIcon
            icon={FaBoxes}
            name="stock"
            type="number"
            required
            placeholder="Enter stock quantity"
            value={formData.stock?.toString()}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alert Quantity
          </label>
          <InputWithIcon
            icon={FaBell}
            name="alertQuantity"
            type="number"
            placeholder="Enter alert quantity"
            value={formData.alertQuantity?.toString()}
            onChange={handleInputChange}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status*
          </label>
          <select
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      {/* Image */}
      <div className="col-span-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Image
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative hover:border-brand-primary transition-colors">
          <div className="space-y-1 text-center">
            {imagePreview || formData.productImage ? (
              <div className="relative group">
                <img
                  src={imagePreview || formData.productImage}
                  alt="Preview"
                  className="mx-auto h-64 w-auto rounded-md object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        imageFile: null,
                        productImage: "",
                      }));
                      setImagePreview("");
                    }}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="product-image"
                    className="relative cursor-pointer rounded-md font-medium text-brand-primary hover:text-brand-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary"
                  >
                    <span>Upload a file</span>
                    <input
                      id="product-image"
                      name="product-image"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Form Actions */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => {
            onClose();
            resetForm();
          }}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-md hover:bg-brand-hover flex items-center gap-2"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending ? (
            <Spinner size="16px" color="#ffffff" className="mx-4 my-1" />
          ) : (
            <>{formData.id ? "Update" : "Create"} Product</>
          )}
        </button>
      </div>
    </form>
  );
}

export default AddProduct;
