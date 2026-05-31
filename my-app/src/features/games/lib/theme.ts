export interface ThemePalette {
  gradientBg: string; // Tailwind class
  glowColor: string;
  textAccent: string;
  bgAccent: string;
  buttonGrad: string;
  borderHover: string;
  badgeStyle: string;
}

export const THEME_PALETTES: Record<string, ThemePalette> = {
  crimson: {
    gradientBg: "from-red-950/80 via-red-900/60 to-[#b5161e]/40",
    glowColor: "bg-red-500/5",
    textAccent: "text-[#b5161e]",
    bgAccent: "bg-[#b5161e]/10",
    buttonGrad: "from-[#b5161e] to-red-500 hover:from-red-500 hover:to-[#b5161e]",
    borderHover: "hover:border-[#b5161e]/20",
    badgeStyle: "bg-[#b5161e]/10 text-[#b5161e]",
  },
  sky: {
    gradientBg: "from-[#0b2545]/80 via-[#134074]/60 to-[#005caa]/40",
    glowColor: "bg-blue-500/5",
    textAccent: "text-[#005caa]",
    bgAccent: "bg-[#005caa]/10",
    buttonGrad: "from-[#005caa] to-sky-500 hover:from-sky-500 hover:to-[#005caa]",
    borderHover: "hover:border-[#005caa]/20",
    badgeStyle: "bg-[#005caa]/10 text-[#005caa]",
  },
  nebula: {
    gradientBg: "from-indigo-950/80 via-purple-950/60 to-purple-900/40",
    glowColor: "bg-purple-500/5",
    textAccent: "text-purple-600",
    bgAccent: "bg-purple-500/10",
    buttonGrad: "from-purple-700 to-indigo-500 hover:from-indigo-500 hover:to-purple-700",
    borderHover: "hover:border-purple-500/20",
    badgeStyle: "bg-purple-500/10 text-purple-600",
  },
  amazon: {
    gradientBg: "from-teal-950/80 via-[#0d4a41]/60 to-[#147063]/40",
    glowColor: "bg-teal-500/5",
    textAccent: "text-teal-700",
    bgAccent: "bg-teal-500/10",
    buttonGrad: "from-teal-800 to-emerald-500 hover:from-emerald-500 hover:to-teal-800",
    borderHover: "hover:border-teal-500/20",
    badgeStyle: "bg-teal-500/10 text-teal-700",
  },
  phoenix: {
    gradientBg: "from-red-950/80 via-[#7c2d12]/60 to-[#ea580c]/40",
    glowColor: "bg-orange-500/5",
    textAccent: "text-orange-600",
    bgAccent: "bg-orange-500/10",
    buttonGrad: "from-[#ea580c] to-amber-500 hover:from-amber-500 hover:to-[#ea580c]",
    borderHover: "hover:border-orange-500/20",
    badgeStyle: "bg-orange-500/10 text-orange-600",
  },
  midas: {
    gradientBg: "from-[#2d2306]/80 via-[#5c4508]/60 to-[#755700]/40",
    glowColor: "bg-yellow-500/5",
    textAccent: "text-[#755700]",
    bgAccent: "bg-[#755700]/10",
    buttonGrad: "from-[#755700] to-yellow-600 hover:from-yellow-600 hover:to-[#755700]",
    borderHover: "hover:border-[#755700]/20",
    badgeStyle: "bg-[#755700]/10 text-[#755700]",
  },
  amber: {
    gradientBg: "from-[#2d2306]/80 via-[#5c4508]/60 to-amber-600/40",
    glowColor: "bg-amber-500/5",
    textAccent: "text-amber-600",
    bgAccent: "bg-amber-500/10",
    buttonGrad: "from-amber-600 to-yellow-500 hover:from-yellow-500 hover:to-amber-600",
    borderHover: "hover:border-amber-500/20",
    badgeStyle: "bg-amber-500/10 text-amber-600",
  },
  emerald: {
    gradientBg: "from-teal-950/80 via-[#047857]/60 to-[#10b981]/40",
    glowColor: "bg-emerald-500/5",
    textAccent: "text-emerald-600",
    bgAccent: "bg-emerald-500/10",
    buttonGrad: "from-emerald-700 to-teal-500 hover:from-teal-500 hover:to-emerald-700",
    borderHover: "hover:border-emerald-500/20",
    badgeStyle: "bg-emerald-500/10 text-emerald-600",
  },
  rose: {
    gradientBg: "from-rose-950/80 via-[#881337]/60 to-[#be123c]/40",
    glowColor: "bg-rose-500/5",
    textAccent: "text-rose-600",
    bgAccent: "bg-rose-500/10",
    buttonGrad: "from-[#be123c] to-pink-500 hover:from-pink-500 hover:to-[#be123c]",
    borderHover: "hover:border-rose-500/20",
    badgeStyle: "bg-rose-500/10 text-rose-600",
  },
};

export function getTheme(styleName?: string): ThemePalette {
  if (!styleName || !THEME_PALETTES[styleName]) {
    // Default to sky / secondary theme
    return THEME_PALETTES.sky;
  }
  return THEME_PALETTES[styleName];
}
