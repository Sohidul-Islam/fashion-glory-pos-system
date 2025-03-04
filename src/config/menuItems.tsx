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
  FaTags,
  FaRuler,
  FaPalette,
  FaRulerHorizontal,
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
        id: "categories",
        title: "Categories",
        path: "/inventory/categories",
        icon: <FaTags className="w-5 h-5" />,
      },
      {
        id: "suppliers",
        title: "Suppliers",
        path: "/inventory/suppliers",
        icon: <FaTruck className="w-5 h-5" />,
      },
      {
        id: "brands",
        title: "Brands",
        path: "/inventory/brands",
        icon: <FaTags className="w-5 h-5" />,
      },
      {
        id: "units",
        title: "Units",
        path: "/inventory/units",
        icon: <FaRuler className="w-5 h-5" />,
      },
      {
        id: "sizes",
        title: "Sizes",
        path: "/inventory/sizes",
        icon: <FaRulerHorizontal className="w-5 h-5" />,
      },
      {
        id: "colors",
        title: "Colors",
        path: "/inventory/colors",
        icon: <FaPalette className="w-5 h-5" />,
      },
    ],
  },
  {
    id: "users",
    title: "Users",
    path: "/users",
    icon: <FaUsers className="w-5 h-5" />,
  },
  // {
  //   id: "customers",
  //   title: "Customers",
  //   path: "/customers",
  //   icon: <FaUsers className="w-5 h-5" />,
  // },
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

export const adminMenuItems = [
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
    id: "users",
    title: "Users",
    path: "/users",
    icon: <FaUsers className="w-5 h-5" />,
  },

  // {
  //   id: "reports",
  //   title: "Reports",
  //   path: "/reports",
  //   icon: <FaChartBar className="w-5 h-5" />,
  // },
  // {
  //   id: "settings",
  //   title: "Settings",
  //   path: "/settings",
  //   icon: <FaCog className="w-5 h-5" />,
  // },
];
