export interface Product {
  id: string;
  name: string;
  categoryId: string | null;
  category: { id: string; name: string } | null;
  price: string;
  gstPercentage: string;
  purchaseType: "WITH_BILL" | "WITHOUT_BILL";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  gstNumber: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
}
