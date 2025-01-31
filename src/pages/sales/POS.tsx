import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import AXIOS from "@/api/network/Axios";
import { PRODUCT_URL, CATEGORY_URL } from "@/api/api";
import Spinner from "@/components/Spinner";
import ScrollButton from "@/components/ScrollButton";
import Invoice from "@/components/Invoice";
import { successToast } from "@/utils/utils";
import {
  generateOrderId,
  generateVerificationCode,
  getExpiryDate,
} from "@/utils/utils";
import Modal from "@/components/Modal";

interface Product {
  id: number;
  name: string;
  price: number;
  productImage: string;
  CategoryId: number;
  stock: number;
  Category: {
    id: number;
    name: string;
  };
  ProductVariants: {
    id: number;
    sku: string;
    quantity: number;
    alertQuantity: number;
    imageUrl: string;
    status: string;
    ProductId: number;
    ColorId: number;
    SizeId: number;
  }[];
}

interface CartItem extends Product {
  quantity: number;
  selectedVariant?: {
    id: number;
    sku: string;
    quantity: number;
    alertQuantity: number;
    imageUrl: string;
    status: string;
    ProductId: number;
    ColorId: number;
    SizeId: number;
  };
  cartItemId: string;
  imageUrl: string;
  sku: string;
}

interface OrderData {
  orderId: string;
  date: string;
  customer: {
    name: string;
    phone: string;
  };
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "cash" | "card";
  verificationCode: string;
  expiryDate: string;
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
  const [showInvoice, setShowInvoice] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderData | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<number, number>
  >({});

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState({
    left: false,
    right: false,
  });

  // Fetch Products
  const { data: products = [], isLoading: isLoadingProducts } = useQuery<
    Product[]
  >({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await AXIOS.get(PRODUCT_URL);
      return response.data;
    },
  });

  // Fetch Categories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await AXIOS.get(CATEGORY_URL);
      return response.data;
    },
  });

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        product.CategoryId === Number(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Cart operations
  const addToCart = (product: CartItem) => {
    const existingItem = cart.find(
      (item) => item.cartItemId === product.cartItemId
    );

    if (existingItem) {
      if (
        existingItem.quantity >=
        (product.selectedVariant?.quantity || product.stock)
      ) {
        successToast("Stock limit reached", "warn");
        return;
      }
      setCart(
        cart.map((item) =>
          item.cartItemId === product.cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + change;
            if (newQuantity > item.stock) {
              successToast("Cannot add more than available stock", "warn");
              return item;
            }
            return { ...item, quantity: Math.max(0, newQuantity) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item?.price || 0) * Number(item?.quantity || 0),
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Cart items count
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Add this function to check scroll buttons visibility
  const checkScrollButtons = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        categoryScrollRef.current;
      setShowScrollButtons({
        left: scrollLeft > 0,
        right: scrollLeft < scrollWidth - clientWidth - 10, // 10px buffer
      });
    }
  };

  // Add scroll handlers
  const handleScroll = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200; // Adjust this value as needed
      const newScrollLeft =
        direction === "left"
          ? categoryScrollRef.current.scrollLeft - scrollAmount
          : categoryScrollRef.current.scrollLeft + scrollAmount;

      categoryScrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  // Add useEffect to initialize and update scroll buttons
  useEffect(() => {
    checkScrollButtons();
    const scrollContainer = categoryScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      }
    };
  }, []);

  // Add this mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: OrderData) => {
      const response = await AXIOS.post("/orders", orderData);
      return response.data;
    },
    onSuccess: () => {
      successToast("Order created successfully!", "success");
    },
    onError: (error: any) => {
      successToast(error?.message || "Failed to create order", "error");
    },
  });

  // Add these handlers
  const handlePayment = (method: "cash" | "card") => {
    if (cart.length === 0) {
      successToast("Cart is empty!", "error");
      return;
    }

    const verificationCode = generateVerificationCode();
    const orderData: OrderData = {
      orderId: generateOrderId(),
      date: new Date().toLocaleString(),
      customer: customerInfo,
      items: cart,
      subtotal,
      tax,
      total,
      paymentMethod: method,
      verificationCode,
      expiryDate: getExpiryDate(new Date().toLocaleString()),
    };

    createOrderMutation.mutate(orderData);
    setCurrentOrder(orderData);
    setShowInvoice(true);
  };

  const handlePrintInvoice = () => {
    const printContent = document.getElementById("invoice-print");
    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Reload to restore React app
    }
  };

  const handleAddToCart = (product: Product, variantId?: number) => {
    if (product.ProductVariants.length > 0 && !variantId) {
      successToast("Please select a variant", "warn");
      return;
    }

    const variant = product.ProductVariants.find((v) => v.id === variantId);

    // Add to cart with variant details
    addToCart({
      ...product,
      selectedVariant: variant,
      cartItemId: `${product.id}-${variantId || "default"}`,
      imageUrl: variant?.imageUrl || product.productImage,
      sku: variant?.sku || product.ProductVariants[0]?.sku,
      quantity: 1,
      stock: variant?.quantity || product.ProductVariants[0]?.quantity,
    });
  };

  if (isLoadingProducts || isLoadingCategories) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
        <Spinner color="#32cd32" size="40px" />
      </div>
    );
  }

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

          <div className="relative flex items-center">
            {/* Left Scroll Button */}
            {showScrollButtons.left && (
              <ScrollButton
                direction="left"
                onClick={() => handleScroll("left")}
              />
            )}

            {/* Categories Container */}
            <div
              ref={categoryScrollRef}
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide scroll-smooth mx-8"
              onScroll={checkScrollButtons}
            >
              <button
                key="all"
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  selectedCategory === "all"
                    ? "bg-brand-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All Products
              </button>
              {categories.map((category: any) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id.toString())}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                    selectedCategory === category.id.toString()
                      ? "bg-brand-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Right Scroll Button */}
            {showScrollButtons.right && (
              <ScrollButton
                direction="right"
                onClick={() => handleScroll("right")}
              />
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-all"
              >
                {/* Product Image */}
                <div className="relative aspect-square">
                  <img
                    src={
                      selectedVariants[product.id]
                        ? product.ProductVariants.find(
                            (v) => v.id === selectedVariants[product.id]
                          )?.imageUrl
                        : product.ProductVariants?.length > 0
                        ? product.ProductVariants[0]?.imageUrl
                        : product.productImage
                    }
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>

                  {/* Variant Selection */}
                  {product.ProductVariants?.length > 0 && (
                    <div className="mt-3">
                      <label className="text-sm text-gray-600">
                        Select Variant
                      </label>
                      <div className="mt-2 flex gap-2 overflow-x-auto">
                        {product.ProductVariants.map((variant) => (
                          <button
                            key={variant.id}
                            type="button"
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [product.id]: variant.id,
                              }))
                            }
                            className={`flex-none w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                              ${
                                selectedVariants[product.id] === variant.id
                                  ? "border-brand-primary shadow-lg scale-105"
                                  : "border-gray-200"
                              }`}
                          >
                            <img
                              src={variant.imageUrl}
                              alt={`Variant ${variant.sku}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={() =>
                      handleAddToCart(product, selectedVariants[product.id])
                    }
                    disabled={
                      !selectedVariants[product.id] &&
                      product.ProductVariants?.length > 0
                    }
                    className="mt-4 w-full px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
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
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      ${Number(item?.price || 0).toFixed(2)} × {item.quantity}
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
            <button
              onClick={() => handlePayment("card")}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-hover"
              disabled={createOrderMutation.isPending}
            >
              <FaCreditCard />
              <span>Card</span>
            </button>
            <button
              onClick={() => handlePayment("cash")}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              disabled={createOrderMutation.isPending}
            >
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

      <Modal
        title="Invoice"
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
      >
        <Invoice
          orderData={currentOrder}
          onClose={() => {
            setShowInvoice(false);
            setCart([]);
            setCustomerInfo({ name: "", phone: "" });
          }}
          onPrint={handlePrintInvoice}
        />
      </Modal>
    </div>
  );
};

export default POS;
