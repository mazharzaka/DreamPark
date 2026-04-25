import { ZOO_PINS } from '@/src/features/portal/data/zooData';
import React from 'react'
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PIns() {
    const t = useTranslations('DreamZoo');
    return (
        <div>
            {ZOO_PINS.map((pin) => {
                const Icon = MapPin;
                return (
                    <motion.div
                        key={pin.id}
                        className="absolute z-30"
                        style={{ top: `${pin.top}%`, left: `${pin.left}%` }}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 15, delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative group/pin">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-110 active:scale-95 ${pin.variant === 'accent' ? 'bg-secondary' :
                                pin.variant === 'primary' ? 'bg-[#1e61b8]' :
                                    'bg-[#147063]'
                                }`}>
                                <Icon className="w-6 h-6" />
                            </div>

                            {/* Tooltip/Label */}
                            <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover/pin:opacity-100 transition-all duration-300 pointer-events-none`}>
                                <div className="bg-primary text-white text-[10px] font-bold px-4 py-2 rounded-full whitespace-nowrap shadow-xl uppercase tracking-widest border border-white/20">
                                    {t(pin.labelKey)}
                                </div>
                                <div className="w-2 h-2 bg-primary rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1" />
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    )
}