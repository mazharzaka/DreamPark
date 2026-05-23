import { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface EditorialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "glass";
  link?: string;
}

export function EditorialButton({ children, variant = "primary", className, link, onClick, ...props }: EditorialButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-[#ff766d] text-white shadow-ambient transition-all hover:scale-105 active:scale-95",
    secondary: "bg-secondary text-white shadow-ambient transition-all hover:scale-105 active:scale-95",
    glass: "glassmorphism text-on-surface shadow-ambient transition-all hover:scale-105 active:scale-95",
  };

  const sharedClassName = cn(
    "px-10 py-5 rounded-full font-sans font-extrabold text-sm tracking-widest uppercase flex items-center justify-center min-w-[64px] min-h-[64px]",
    variants[variant],
    className
  );

  if (link) {
    return (
      <Link href={link} className={sharedClassName} onClick={onClick as any}>
        {children}
      </Link>
    );
  }

  return (
    <button className={sharedClassName} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
