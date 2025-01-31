/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaBox } from "react-icons/fa";
import AXIOS from "@/api/network/Axios";
import {
  PRODUCT_URL,
  DELETE_PRODUCT_URL,
  UPDATE_PRODUCT_URL,
  CATEGORY_URL,
  BRANDS_URL,
} from "@/api/api";
import Spinner from "@/components/Spinner";
import Modal from "@/components/Modal";

import { successToast, uploadFile } from "@/utils/utils";
import AddProduct from "@/components/shared/AddProduct";
import { Product, ProductFormData } from "@/types/ProductType";
import { Brand } from "@/types/categoryType";
import { Category } from "@/types/categoryType";

const Products: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all"
  );
  const [selectedBrand, setSelectedBrand] = useState<number | "all">("all");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
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

  // Additional state
  const [imagePreview, setImagePreview] = useState<string>("");

  // Queries
  const { data: products = [], isLoading: isLoadingProducts } = useQuery<
    Product[]
  >({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await AXIOS.get(PRODUCT_URL);
      return response.data;
    },
  });

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

  // Mutations
  const createMutation = useMutation<any, Error, ProductFormData>({
    mutationFn: (data: ProductFormData) => AXIOS.post(PRODUCT_URL, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
      setIsModalOpen(false);
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
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update product");
    },
  });

  const deleteMutation = useMutation<any, Error, number>({
    mutationFn: (id: number) => AXIOS.post(`${DELETE_PRODUCT_URL}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete product");
    },
  });

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.CategoryId === selectedCategory;
      const matchesBrand =
        selectedBrand === "all" || product.BrandId === selectedBrand;
      const matchesPrice =
        product.price >= priceRange.min && product.price <= priceRange.max;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, priceRange]);

  // Handlers

  const handleEdit = (product: Product) => {
    setFormData({
      id: product.id,
      code: product.code,
      sku: product.sku,
      name: product.name,
      description: product.description,
      CategoryId: product.CategoryId,
      BrandId: product.BrandId,
      UnitId: product.UnitId,
      alertQuantity: product.alertQuantity,
      productImage: product.productImage || "",
      discountType: product.discountType,
      discountAmount: product.discountAmount,
      purchasePrice: product.purchasePrice,
      salesPrice: product.salesPrice,
      vat: product.vat,
      price: product.price,
      stock: product.stock,
      status: product.status,
    });
    setImagePreview("");
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

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

  // Keep your existing return JSX but update the products mapping
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Your existing filter UI */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-4 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-hover flex items-center gap-2"
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedCategory(value === "all" ? "all" : Number(value));
          }}
          className="border rounded-lg px-3 py-2"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={selectedBrand}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedBrand(value === "all" ? "all" : Number(value));
          }}
          className="border rounded-lg px-3 py-2"
        >
          <option value="all">All Brands</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

        {/* Price Range */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange({ ...priceRange, min: Number(e.target.value) })
            }
            className="border rounded-lg px-3 py-2 w-24"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange({ ...priceRange, max: Number(e.target.value) })
            }
            className="border rounded-lg px-3 py-2 w-24"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoadingProducts ? (
          <div className="col-span-full flex justify-center py-8">
            <Spinner color="#32cd32" size="40px" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No products found
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              {/* Product Image Section */}
              <div className="relative h-56">
                <img
                  src={product?.productImage}
                  alt={product?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Status Badge */}
                <span
                  className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${
                    product.status === "active"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {product?.status}
                </span>

                {/* Quick Action Buttons */}
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-lg transition-colors"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Details Section */}
              <div className="p-5">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1 line-clamp-1">
                    {product?.name}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <FaBox className="w-4 h-4" />
                    {product.sku}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {product?.description}
                </p>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-gray-500 block text-xs">
                      Category
                    </span>
                    <span className="font-medium text-gray-800">
                      {product?.Category?.name}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-gray-500 block text-xs">Brand</span>
                    <span className="font-medium text-gray-800">
                      {product?.Brand?.name}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-gray-500 block text-xs">Unit</span>
                    <span className="font-medium text-gray-800">
                      {product?.Unit?.name}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-gray-500 block text-xs">Stock</span>
                    <span
                      className={`font-medium ${
                        product.stock <= product.alertQuantity
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {product?.stock}
                    </span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-xs text-gray-500">Sales Price</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-brand-primary">
                        ${Number(product?.price || 0)?.toFixed(2)}
                      </span>
                      {product?.discountAmount && (
                        <span className="text-sm text-red-500 line-through">
                          $
                          {(() => {
                            const salesPrice = Number(product?.salesPrice) || 0; // Ensure salesPrice is a number
                            const vatPercentage = Number(product?.vat) || 0; // Ensure VAT is a number
                            const vatAmount =
                              (salesPrice * vatPercentage) / 100; // Calculate VAT
                            return (salesPrice + vatAmount).toFixed(2); // Add VAT to salesPrice and format
                          })()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">VAT</span>
                    <p className="text-sm font-medium text-gray-600">
                      {product.vat}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Product Form Modal */}
      <Modal
        isOpen={isModalOpen}
        className="lg:!max-w-[80vw] !max-w-[95vw]"
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={formData.id ? "Edit Product" : "Add Product"}
      >
        <AddProduct
          productData={formData}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Products;
