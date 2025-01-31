import React from "react";
import { useEffect } from "react";

interface BarcodeModalProps {
  sku: string;
  name: string;
  price: number;
  onClose: () => void;
}

const BarcodeModal: React.FC<BarcodeModalProps> = ({
  sku,
  name,
  price,
  onClose,
}) => {
  useEffect(() => {
    // Initialize barcode after component mounts
    const svg = document.querySelector("#barcode");
    if (svg) {
      (window as any).JsBarcode(svg, sku, {
        format: "CODE128",
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 14,
        margin: 10,
      });
    }
  }, [sku]);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Barcode</title>
            <style>
              @media print {
                body {
                  margin: 0;
                  padding: 10mm;
                }
                .barcode-container {
                  width: 50mm;
                  padding: 2mm;
                  text-align: center;
                  page-break-inside: avoid;
                }
                .product-name {
                  font-size: 10pt;
                  margin: 2mm 0;
                  font-family: Arial, sans-serif;
                }
                .product-price {
                  font-size: 12pt;
                  font-weight: bold;
                  margin: 2mm 0;
                  font-family: Arial, sans-serif;
                }
                svg {
                  max-width: 100%;
                  height: auto;
                }
              }
            </style>
          </head>
          <body>
            <div class="barcode-container">
              ${document.querySelector("#barcode-container")?.innerHTML || ""}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Barcode Preview */}
      <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300">
        <div
          id="barcode-container"
          className="w-64 mx-auto space-y-2 text-center"
        >
          <svg id="barcode" className="w-full"></svg>
          <div className="text-sm font-medium product-name">{name}</div>
          <div className="text-sm text-gray-600">SKU: {sku}</div>
          <div className="text-sm font-bold product-price">
            ${Number(price).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Print Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handlePrint}
          className="px-6 py-2 text-white bg-brand-primary rounded-lg hover:bg-brand-hover transition-colors"
        >
          Print Barcode
        </button>
      </div>
    </div>
  );
};

export default BarcodeModal;
