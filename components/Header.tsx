"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname(); // Get the current path

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlHeader);
    
    return () => {
      window.removeEventListener("scroll", controlHeader);
    };
  }, [lastScrollY]);

  return (
    <header 
      className={`fixed top-0 left-0 w-full bg-background text-foreground shadow-md z-50 flex items-center justify-between px-4 py-2 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Logo - Clickable to navigate to home */}
      <Link href="/" className="flex items-center">
        <Image 
          src="/aganitha-logo.jpg" 
          alt="Aganitha Logo" 
          width={120} 
          height={120} 
          style={{ objectFit: "contain" }} 
        />
      </Link>
      
      {/* Centered Content */}
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-bold text-primary">WatEval</h1>
        <p className="text-sm text-muted-foreground">
          Automated pipeline to calculate binding free energies of water sites in protein-ligand systems
        </p>
      </div>
      
      {/* Navigation Links with Active Styling */}
      <div className="flex items-center space-x-4">
        <Link href="/about">
          <Button 
            variant="ghost" 
            className={`text-sm ${pathname === "/about" ? "text-primary font-semibold" : ""}`}
          >
            About
          </Button>
        </Link>
        <Link href="/docs">
          <Button 
            variant="ghost" 
            className={`text-sm ${pathname === "/docs" ? "text-primary font-semibold" : ""}`}
          >
            Docs
          </Button>
        </Link>
      </div>
    </header>
  );
}