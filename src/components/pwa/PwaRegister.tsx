"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          if (process.env.NODE_ENV === "development") {
            console.log("PWA Service Worker registered with scope:", reg.scope);
          }
        })
        .catch((err) => {
          console.error("PWA Service Worker registration failed:", err);
        });
    }
  }, []);

  return null;
}
