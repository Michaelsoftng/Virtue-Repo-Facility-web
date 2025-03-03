import React from "react";
import { motion } from "framer-motion";

const PieChartPreloader = () => {
    return (
        <div className="flex items-center justify-center h-[100px]">
            <svg width="100" height="100" viewBox="0 0 32 32" className="animate-spin">
                <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="4"
                />
                <motion.path
                    d="M16 2 A14 14 0 1 1 15.99 2.01"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                />
            </svg>
        </div>
    );
};

export default PieChartPreloader;