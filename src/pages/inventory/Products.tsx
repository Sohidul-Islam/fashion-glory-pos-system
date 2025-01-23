/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBox,
  FaDollarSign,
  FaPercent,
  FaBoxes,
  FaBell,
  FaCloudUploadAlt,
  FaTimes,
} from "react-icons/fa";
import AXIOS from "@/api/network/Axios";
import {
  PRODUCT_URL,
  DELETE_PRODUCT_URL,
  UPDATE_PRODUCT_URL,
  CATEGORY_URL,
  BRANDS_URL,
  UNITS_URL,
} from "@/api/api";
import Spinner from "@/components/Spinner";
import Modal from "@/components/Modal";
import InputWithIcon from "@/components/InputWithIcon";
import { successToast, uploadFile } from "@/utils/utils";

// Interfaces
interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface Unit {
  id: number;
  name: string;
}

interface Product {
  id: number;
  code: string | null;
  sku: string;
  name: string;
  description: string;
  CategoryId: number;
  BrandId: number;
  UnitId: number;
  alertQuantity: number;
  productImage: string;
  discountType: string | null;
  discountAmount: number | null;
  purchasePrice: number;
  salesPrice: number;
  vat: number;
  price: number;
  stock: number;
  status: "active" | "inactive";
  UserId: number;
  Category: Category;
  Brand: Brand;
  Unit: Unit;
}

interface ProductFormData {
  id: number | undefined;
  code: string | null;
  sku: string;
  name: string;
  description: string;
  CategoryId: number;
  BrandId: number;
  UnitId: number;
  alertQuantity: number;
  productImage: string;
  discountType: string | null;
  discountAmount: number | null;
  purchasePrice: number;
  salesPrice: number;
  vat: number;
  price: number;
  stock: number;
  status: "active" | "inactive";
  imageFile?: File | null;
}

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

  const { data: units = [] } = useQuery<Unit[]>({
    queryKey: ["units"],
    queryFn: async () => {
      const response = await AXIOS.get(UNITS_URL);
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.productImage;

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

  console.log({ formData, imagePreview });

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
                      {product.discountAmount && (
                        <span className="text-sm text-red-500 line-through">
                          $
                          {Number(
                            product.price + product.discountAmount || 0
                          ).toFixed(2)}
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
                setIsModalOpen(false);
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
      </Modal>
    </div>
  );
};

export default Products;
