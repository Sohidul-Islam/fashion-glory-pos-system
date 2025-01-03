/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";

const Products: React.FC = () => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });

  // Categories
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "electronics", name: "Electronics" },
    { id: "accessories", name: "Accessories" },
    { id: "gadgets", name: "Gadgets" },
  ];

  // Sample product data with categories
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      sku: "PRD-1000",
      price: 99.99,
      stock: 50,
      category: "accessories",
      image:
        "https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?w=500&h=500&fit=crop",
    },
    {
      id: 2,
      name: "Smart Watch",
      sku: "PRD-2000",
      price: 199.99,
      stock: 30,
      image:
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop",
    },
    {
      id: 3,
      name: "Camera Lens",
      sku: "PRD-3000",
      price: 299.99,
      stock: 20,
      image:
        "https://images.unsplash.com/photo-1515343480029-43cdfe6b6aae?w=500&h=500&fit=crop",
    },
    {
      id: 4,
      name: "Gaming Console",
      sku: "PRD-4000",
      price: 399.99,
      stock: 15,
      image:
        "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=500&h=500&fit=crop",
    },
    {
      id: 5,
      name: "Smartphone",
      sku: "PRD-5000",
      price: 699.99,
      stock: 25,
      image:
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop",
    },
    {
      id: 6,
      name: "Laptop",
      sku: "PRD-6000",
      price: 999.99,
      stock: 10,
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop",
    },
  ];

  // Filter products based on search, category, and price range
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesPrice =
        product.price >= priceRange.min && product.price <= priceRange.max;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchQuery, selectedCategory, priceRange]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-hover">
          Add Product
        </button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            Price Range:
          </span>
          <div className="flex-1 flex items-center gap-4">
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }))
              }
              min="0"
              placeholder="Min"
              className="w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
            <span>-</span>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }))
              }
              min="0"
              placeholder="Max"
              className="w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm">
              Search: {searchQuery}
              <button
                onClick={() => setSearchQuery("")}
                className="ml-2 hover:text-brand-hover"
              >
                ×
              </button>
            </span>
          )}
          {selectedCategory !== "all" && (
            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm">
              Category:{" "}
              {categories.find((c) => c.id === selectedCategory)?.name}
              <button
                onClick={() => setSelectedCategory("all")}
                className="ml-2 hover:text-brand-hover"
              >
                ×
              </button>
            </span>
          )}
          {(priceRange.min > 0 || priceRange.max < 1000) && (
            <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm">
              Price: ${priceRange.min} - ${priceRange.max}
              <button
                onClick={() => setPriceRange({ min: 0, max: 1000 })}
                className="ml-2 hover:text-brand-hover"
              >
                ×
              </button>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden group hover:shadow-lg transition-shadow duration-200"
            >
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-200"
                />
              </div>

              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm">SKU: {product.sku}</p>
                  </div>
                  <p className="text-brand-primary font-semibold">
                    ${product.price}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-600">
                    Stock: {product.stock}
                  </span>
                  <button className="px-3 py-1 text-brand-primary hover:bg-brand-primary/10 rounded-md transition-colors duration-200">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No products found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
