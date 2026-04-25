import { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface EditorialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "glass";
}

export function EditorialButton({ children, variant = "primary", className, ...props }: EditorialButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-[#ff766d] text-white shadow-ambient transition-all hover:scale-105 active:scale-95",
    secondary: "bg-secondary text-white shadow-ambient transition-all hover:scale-105 active:scale-95",
    glass: "glassmorphism text-on-surface shadow-ambient transition-all hover:scale-105 active:scale-95",
  };

  return (
    <button 
      className={cn(
        "px-10 py-5 rounded-full font-sans font-extrabold text-sm tracking-widest uppercase flex items-center justify-center min-w-[64px] min-h-[64px]",
        variants[variant],
        className
      )} 
      {...props}
    >
      {children}
    </button>
  );
}
