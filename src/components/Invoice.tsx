import React from "react";
import { FaPrint } from "react-icons/fa";
import LogoSvg from "./icons/LogoSvg";
import Barcode from "react-barcode";

interface InvoiceProps {
  orderData: {
    orderId: string;
    date: string;
    customer: {
      name: string;
      phone: string;
    };
    items: {
      name: string;
      quantity: number;
      price: number;
    }[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: "cash" | "card";
  } | null;
  onClose: () => void;
  onPrint: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ orderData, onClose, onPrint }) => {
  if (!orderData) return null;
  return (
    <div className=" flex items-center justify-center z-50">
      <div className="w-full">
        {/* Print Preview */}
        <div className="p-6" id="invoice-print">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <LogoSvg className="h-12" />
            </div>
            <h2 className="text-xl font-semibold">Sales Invoice</h2>
            <p className="text-gray-500 text-sm">
              Order #{orderData.orderId} • {orderData.date}
            </p>
          </div>

          {/* Customer Info */}
          {(orderData?.customer?.name || orderData?.customer?.phone) && (
            <div className="mb-6 text-sm">
              <h3 className="font-medium mb-2">Customer Information</h3>
              {orderData?.customer?.name && (
                <p>Name: {orderData?.customer?.name}</p>
              )}
              {orderData?.customer?.phone && (
                <p>Phone: {orderData?.customer?.phone}</p>
              )}
            </div>
          )}

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
                {orderData.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.name}</td>
                    <td className="text-center py-2">{item.quantity}</td>
                    <td className="text-right py-2">
                      ${Number(item.price).toFixed(2)}
                    </td>
                    <td className="text-right py-2">
                      $
                      {Number(
                        Number(item.quantity) * Number(item.price)
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${orderData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>${orderData.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-2 border-t">
              <span>Total</span>
              <span>${Number(orderData.total).toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mt-6 pt-4 border-t text-center text-sm text-gray-500">
            <p>Paid via {orderData.paymentMethod.toUpperCase()}</p>
            <p className="mt-2">Thank you for your purchase!</p>
          </div>

          {/* Add Barcode */}
          <div className="mt-6 flex flex-col items-center justify-center border-t pt-4">
            <Barcode
              value={orderData.orderId}
              width={1.5}
              height={50}
              fontSize={12}
              margin={0}
              displayValue={true} // Show the text below barcode
            />
            <p className="text-xs text-gray-500 mt-2">
              Scan to verify purchase
            </p>
          </div>

          {/* Add QR Code for digital verification */}
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>Verify online at: verify.yourstore.com/{orderData.orderId}</p>
            <p className="mt-1">Valid until: {getExpiryDate(orderData.date)}</p>
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
            onClick={onPrint}
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

// Helper function to calculate expiry date (e.g., 30 days from purchase)
const getExpiryDate = (purchaseDate: string) => {
  const date = new Date(purchaseDate);
  date.setDate(date.getDate() + 30);
  return date.toLocaleDateString();
};

export default Invoice;
