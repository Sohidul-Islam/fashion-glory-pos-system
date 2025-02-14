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
  onPrint?: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ orderId, onClose, onPrint }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { data: invoiceData, isLoading } = useQuery<InvoiceData>({
    queryKey: ["invoice", orderId],
    queryFn: async () => {
      try {
        const response = await AXIOS.get(`${ORDERS_URL}/${orderId}/invoice`);
        return response.data;
      } catch (error: any) {
        toast.error(error?.message || "Failed to fetch invoice");
        return null;
      }
    },
    enabled: !!orderId,
  });

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printStyles = `
      @page {
        size: 80mm 297mm;
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        .invoice-print {
          width: 80mm;
          padding: 5mm;
          page-break-after: always;
        }
        .no-print {
          display: none !important;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        td, th {
          padding: 2px;
          font-size: 12px;
        }
        .text-xs {
          font-size: 10px;
        }
        .border-t {
          border-top: 1px dashed #ccc;
        }
        .border-b {
          border-bottom: 1px dashed #ccc;
        }
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = printStyles;
    document.head.appendChild(styleSheet);

    const printWindow = window.open("", "", "height=600,width=800");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Invoice</title>
            <style>${printStyles}</style>
          </head>
          <body>
            <div class="invoice-print">
              ${printContent.innerHTML}
            </div>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();

      // Print after images are loaded
      const images = printWindow.document.getElementsByTagName("img");
      let loadedImages = 0;
      const totalImages = images.length;

      if (totalImages === 0) {
        printWindow.print();
        printWindow.close();
      } else {
        Array.from(images).forEach((img) => {
          img.onload = () => {
            loadedImages++;
            if (loadedImages === totalImages) {
              printWindow.print();
              printWindow.close();
            }
          };
        });
      }
    }

    document.head.removeChild(styleSheet);
    onPrint?.();
  };

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
      <div className="w-full max-w-[80mm]">
        {/* Print Preview */}
        <div ref={printRef} className="p-4" id="invoice-print">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-2">
              <LogoSvg className="h-8" />
            </div>
            <h2 className="text-sm font-semibold">
              {invoiceData.businessInfo.name}
            </h2>
            <p className="text-xs text-gray-500">
              {invoiceData.businessInfo.address}
            </p>
            <p className="text-xs text-gray-500">
              Tel: {invoiceData.businessInfo.phone}
            </p>
          </div>

          {/* Invoice Details */}
          <div className="text-xs mb-4">
            <div className="flex justify-between">
              <span>Invoice #:</span>
              <span>{invoiceData.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date(invoiceData.date).toLocaleString()}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="text-xs mb-4">
            <p>Customer: {invoiceData.customer.name}</p>
            <p>Phone: {invoiceData.customer.phone}</p>
          </div>

          {/* Items */}
          <table className="w-full text-xs mb-4">
            <thead className="border-t border-b">
              <tr>
                <th className="text-left py-1">Item</th>
                <th className="text-center py-1">Qty</th>
                <th className="text-right py-1">Price</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-1">
                    <div>
                      <p>{item.productName}</p>
                      <p className="text-[10px] text-gray-500">
                        {item.details}
                      </p>
                    </div>
                  </td>
                  <td className="text-center py-1">{item.quantity}</td>
                  <td className="text-right py-1">${item.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div className="text-xs space-y-1 border-t pt-2">
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
              <div className="flex justify-between">
                <span>Discount ({invoiceData.summary.discountRate})</span>
                <span>-${invoiceData.summary.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold pt-1 border-t">
              <span>Total</span>
              <span>${invoiceData.summary.total}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-4 text-center text-xs">
            <p>Paid via {invoiceData.payment.method.toUpperCase()}</p>
            <p className="mt-1">
              Status: {invoiceData.payment.status.toUpperCase()}
            </p>
          </div>

          {/* Barcode */}
          <div className="mt-4 flex justify-center">
            <Barcode
              value={invoiceData.invoiceNumber}
              width={1}
              height={40}
              fontSize={10}
              margin={0}
              displayValue={true}
            />
          </div>

          {/* Footer */}
          <div className="mt-4 text-center text-[10px] text-gray-500">
            <p>Thank you for your business!</p>
            <p>{invoiceData.businessInfo.website}</p>
            <p>Valid until: {getExpiryDate(invoiceData.date)}</p>
          </div>
        </div>

        {/* Actions - No Print */}
        <div className="border-t px-4 py-3 flex justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-sm font-medium text-white bg-brand-primary hover:bg-brand-hover rounded-md flex items-center gap-2"
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
