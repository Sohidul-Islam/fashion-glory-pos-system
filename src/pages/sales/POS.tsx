import { useState } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaTrash,
  FaUser,
  FaCreditCard,
  FaMoneyBill,
  FaQrcode,
  FaTimes,
} from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

const POS: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
  });
  const [showMobileCart, setShowMobileCart] = useState(false);

  // Sample categories
  const categories = [
    { id: "all", name: "All" },
    { id: "drinks", name: "Drinks" },
    { id: "food", name: "Food" },
    { id: "snacks", name: "Snacks" },
    { id: "electronics", name: "Electronics" },
  ];

  // Sample products with more items per category
  const products: Product[] = [
    // Drinks Category
    {
      id: 1,
      name: "Coffee",
      price: 3,
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&fit=crop",
      category: "drinks",
      stock: 50,
    },
    {
      id: 2,
      name: "Green Tea",
      price: 2.5,
      image:
        "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=100&h=100&fit=crop",
      category: "drinks",
      stock: 45,
    },
    {
      id: 3,
      name: "Fresh Orange Juice",
      price: 4,
      image:
        "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=100&h=100&fit=crop",
      category: "drinks",
      stock: 30,
    },
    {
      id: 4,
      name: "Smoothie",
      price: 4.5,
      image:
        "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=100&h=100&fit=crop",
      category: "drinks",
      stock: 25,
    },

    // Food Category
    {
      id: 5,
      name: "Chicken Rice",
      price: 8.5,
      image:
        "https://images.unsplash.com/photo-1562967914-608f82629710?w=100&h=100&fit=crop",
      category: "food",
      stock: 20,
    },
    {
      id: 6,
      name: "Pasta Carbonara",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=100&h=100&fit=crop",
      category: "food",
      stock: 15,
    },
    {
      id: 7,
      name: "Caesar Salad",
      price: 7.5,
      image:
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=100&h=100&fit=crop",
      category: "food",
      stock: 25,
    },
    {
      id: 8,
      name: "Fish & Chips",
      price: 10.99,
      image:
        "https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=100&h=100&fit=crop",
      category: "food",
      stock: 18,
    },

    // Snacks Category
    {
      id: 9,
      name: "Burger",
      price: 6.99,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop",
      category: "snacks",
      stock: 30,
    },
    {
      id: 10,
      name: "French Fries",
      price: 3.99,
      image:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=100&h=100&fit=crop",
      category: "snacks",
      stock: 40,
    },
    {
      id: 11,
      name: "Chicken Wings",
      price: 7.99,
      image:
        "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=100&h=100&fit=crop",
      category: "snacks",
      stock: 35,
    },
    {
      id: 12,
      name: "Nachos",
      price: 5.99,
      image:
        "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=100&h=100&fit=crop",
      category: "snacks",
      stock: 28,
    },

    // Electronics Category
    {
      id: 13,
      name: "Wireless Earbuds",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop",
      category: "electronics",
      stock: 15,
    },
    {
      id: 14,
      name: "Power Bank",
      price: 29.99,
      image:
        "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100&h=100&fit=crop",
      category: "electronics",
      stock: 20,
    },
    {
      id: 15,
      name: "Phone Charger",
      price: 19.99,
      image:
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100&h=100&fit=crop",
      category: "electronics",
      stock: 30,
    },
    {
      id: 16,
      name: "Phone Case",
      price: 14.99,
      image:
        "https://images.unsplash.com/photo-1601593346740-925612772716?w=100&h=100&fit=crop",
      category: "electronics",
      stock: 40,
    },
  ];

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Cart functions
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Add cart total items count
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col md:flex-row gap-6 relative">
      {/* Products Section */}
      <div
        className={`flex-1 flex flex-col bg-white rounded-lg shadow overflow-hidden ${
          showMobileCart ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Search and Categories */}
        <div className="p-4 border-b space-y-4">
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

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-brand-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white border rounded-lg p-2 hover:shadow-md transition-shadow text-left"
              >
                <div className="aspect-square rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2">
                  <h3 className="font-medium truncate">{product.name}</h3>
                  <p className="text-brand-primary font-semibold">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section - Desktop */}
      <div
        className={`w-96 bg-white rounded-lg shadow flex flex-col md:flex ${
          showMobileCart ? "flex" : "hidden"
        }`}
      >
        {/* Mobile Cart Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">Shopping Cart</h2>
          <button
            onClick={() => setShowMobileCart(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Info */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <FaUser className="w-5 h-5" />
            <span className="font-medium">Customer Information</span>
          </div>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerInfo.name}
              onChange={(e) =>
                setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={customerInfo.phone}
              onChange={(e) =>
                setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 p-4 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FaShoppingCart className="w-8 h-8 mx-auto mb-2" />
                <p>Cart is empty</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <FaMinus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <FaPlus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals and Checkout */}
        <div className="p-4 border-t bg-gray-50">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-hover">
              <FaCreditCard />
              <span>Card</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              <FaMoneyBill />
              <span>Cash</span>
            </button>
          </div>

          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900">
            <FaQrcode className="w-5 h-5" />
            <span>Scan QR Code</span>
          </button>
        </div>
      </div>

      {/* Mobile Cart Toggle Button */}
      <button
        onClick={() => setShowMobileCart(true)}
        className={`md:hidden fixed bottom-4 right-4 bg-brand-primary text-white p-4 rounded-full shadow-lg ${
          showMobileCart ? "hidden" : "flex"
        } items-center justify-center`}
      >
        <div className="relative">
          <FaShoppingCart className="w-6 h-6" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </div>
      </button>
    </div>
  );
};

export default POS;
