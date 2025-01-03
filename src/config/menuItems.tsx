import {
  FaHome,
  FaShoppingCart,
  FaBoxOpen,
  FaWarehouse,
  FaUsers,
  FaChartBar,
  FaCog,
  FaFileInvoice,
  FaTruck,
} from "react-icons/fa";

export const menuItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    path: "/dashboard",
    icon: <FaHome className="w-5 h-5" />,
  },
  {
    id: "sales",
    title: "Sales",
    path: "/sales",
    icon: <FaShoppingCart className="w-5 h-5" />,
    submenu: [
      {
        id: "pos",
        title: "POS",
        path: "/sales/pos",
        icon: <FaFileInvoice className="w-5 h-5" />,
      },
      {
        id: "orders",
        title: "Orders",
        path: "/sales/orders",
        icon: <FaBoxOpen className="w-5 h-5" />,
      },
    ],
  },
  {
    id: "inventory",
    title: "Inventory",
    path: "/inventory",
    icon: <FaWarehouse className="w-5 h-5" />,
    submenu: [
      {
        id: "products",
        title: "Products",
        path: "/inventory/products",
        icon: <FaBoxOpen className="w-5 h-5" />,
      },
      {
        id: "suppliers",
        title: "Suppliers",
        path: "/inventory/suppliers",
        icon: <FaTruck className="w-5 h-5" />,
      },
    ],
  },
  {
    id: "customers",
    title: "Customers",
    path: "/customers",
    icon: <FaUsers className="w-5 h-5" />,
  },
  {
    id: "reports",
    title: "Reports",
    path: "/reports",
    icon: <FaChartBar className="w-5 h-5" />,
  },
  {
    id: "settings",
    title: "Settings",
    path: "/settings",
    icon: <FaCog className="w-5 h-5" />,
  },
];
