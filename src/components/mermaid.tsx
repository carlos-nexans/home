"use client";

import mermaid from "mermaid";
import { useEffect } from "react";

export default function Mermaid({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: "loose",
    });
    
    // Force mermaid to re-render diagrams
    mermaid.run();
  }, []);

  return <>{children}</>;
}
