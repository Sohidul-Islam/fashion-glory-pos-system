import { Brand, Unit } from "./categoryType";

import { Category } from "./categoryType";

export interface ProductFormData {
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

export interface ProductVariant {
  id: number;
  sku: string;
  status: "active" | "inactive";
  ProductId: number;
  ColorId: number;
  SizeId: number;
  quantity: number;
  alertQuantity: number;
  imageUrl: string;
}

export interface Product {
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
  ProductVariants: ProductVariant[];
}
