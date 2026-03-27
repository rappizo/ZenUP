"use client";

import { useEffect } from "react";

export function ClearCartOnLoad() {
  useEffect(() => {
    void Promise.allSettled([
      fetch("/api/cart/clear", {
        method: "POST"
      }),
      fetch("/api/checkout/clear", {
        method: "POST"
      })
    ]);
  }, []);

  return null;
}
