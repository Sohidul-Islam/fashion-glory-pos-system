import React, { useRef } from "react";
import { FaPrint } from "react-icons/fa";
import LogoSvg from "./icons/LogoSvg";
import Barcode from "react-barcode";
import { getExpiryDate } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import AXIOS from "@/api/network/Axios";
import { ORDERS_URL } from "@/api/api";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";

interface InvoiceItem {
  productName: string;
  sku: string;
  details: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  items: InvoiceItem[];
  summary: {
    subtotal: string;
    tax: string;
    taxRate: string;
    discount: string;
    discountRate: string;
    total: string;
  };
  payment: {
    method: "cash" | "card";
    status: string;
  };
  orderStatus: string;
  businessInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    taxId: string;
  };
  stats: {
    totalItems: number;
    totalUniqueItems: number;
    averageItemPrice: string;
  };
}

interface InvoiceProps {
  orderId: number;
  onClose: () => void;
  onPrint: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ orderId, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const { data: invoiceData, isLoading } = useQuery<InvoiceData>({
    queryKey: ["invoice", orderId],
    queryFn: async () => {
      try {
        const response = await AXIOS.get(
          `${ORDERS_URL}/${Number(orderId || 0)}/invoice`
        );
        return response.data;
      } catch (error: any) {
        toast.error(error?.message || "Failed to fetch invoice");
        return null;
      }
    },
    enabled: !!orderId,
  });

  if (!orderId) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner color="#32cd32" size="40px" />
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Failed to load invoice data</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center z-50">
      <div className="w-full">
        <div className="p-6" id="invoice-print" ref={contentRef}>
          {/* Business Info */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <LogoSvg className="h-12" />
            </div>
            <h2 className="text-xl font-semibold">
              {invoiceData.businessInfo.name}
            </h2>
            <p className="text-gray-500 text-sm">
              {invoiceData.businessInfo.address}
            </p>
            <p className="text-gray-500 text-sm">
              Tel: {invoiceData.businessInfo.phone} | Email:{" "}
              {invoiceData.businessInfo.email}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Invoice #{invoiceData.invoiceNumber} •{" "}
              {new Date(invoiceData.date).toLocaleString()}
            </p>
          </div>

          {/* Customer Info */}
          <div className="mb-6 text-sm">
            <h3 className="font-medium mb-2">Customer Information</h3>
            <p>Name: {invoiceData.customer.name}</p>
            <p>Phone: {invoiceData.customer.phone}</p>
            {invoiceData.customer.email !== "N/A" && (
              <p>Email: {invoiceData.customer.email}</p>
            )}
          </div>

          {/* Items */}
          <div className="mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Item</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-xs text-gray-500">
                          SKU: {item.sku} | {item.details}
                        </p>
                      </div>
                    </td>
                    <td className="text-center py-2">{item.quantity}</td>
                    <td className="text-right py-2">${item.unitPrice}</td>
                    <td className="text-right py-2">${item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${invoiceData.summary.subtotal}</span>
            </div>
            {Number(invoiceData.summary.tax) > 0 && (
              <div className="flex justify-between">
                <span>Tax ({invoiceData.summary.taxRate})</span>
                <span>${invoiceData.summary.tax}</span>
              </div>
            )}
            {Number(invoiceData.summary.discount) > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount ({invoiceData.summary.discountRate})</span>
                <span>-${invoiceData.summary.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-medium text-lg pt-2 border-t">
              <span>Total</span>
              <span>${invoiceData.summary.total}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-6 pt-4 border-t text-center text-sm text-gray-500">
            <p>Paid via {invoiceData.payment.method.toUpperCase()}</p>
            <p className="mt-1">
              Status: {invoiceData.payment.status.toUpperCase()}
            </p>
            <p className="mt-2">Thank you for your business!</p>
          </div>

          {/* Barcode */}
          <div className="mt-6 flex flex-col items-center justify-center border-t pt-4">
            <Barcode
              value={invoiceData.invoiceNumber}
              width={1.5}
              height={50}
              fontSize={12}
              margin={0}
              displayValue={true}
            />
          </div>

          {/* Business Details */}
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>Tax ID: {invoiceData.businessInfo.taxId}</p>
            <p>{invoiceData.businessInfo.website}</p>
            <p className="mt-1">
              Valid until: {getExpiryDate(invoiceData.date)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t px-6 py-4 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Close
          </button>
          <button
            onClick={() => reactToPrintFn()}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-brand-hover rounded-md flex items-center gap-2"
          >
            <FaPrint className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
