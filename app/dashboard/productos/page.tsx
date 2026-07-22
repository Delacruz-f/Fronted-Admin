"use client";


import React, { useState } from "react";
import ProductsTab from "@/components/products/ProductsTab";
import { useDashboard } from "@/lib/context/DashboardContext";
import { products as initialProducts } from "@/lib/mockData";

export default function ProductosPage() {
  const { darkMode, showNotification } = useDashboard();
  const [products, setProducts] = useState(initialProducts);

  return (
    <ProductsTab
      darkMode={darkMode}
      products={products}
      onUpdateProducts={setProducts}
      onShowNotification={showNotification}
    />
  );
}