"use client";
import { useState, useEffect } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    setVisible(false);
    const timeout = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timeout);
  }, [children]);
  
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out'
    }}>
      {children}
    </div>
  );
} 