"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const effects = [
    {
        title: "Blazing Speed",
        content: "Accelerates productivity with warp-speed efficiency.",
        color: "bg-gradient-to-r from-red-500 to-orange-500",
    },
    {
        title: "Crystal Clarity",
        content: "Sharpens focus and enhances mental clarity.",
        color: "bg-gradient-to-r from-blue-500 to-indigo-500",
    },
    {
        title: "Lunar Magic",
        content: "Taps into cosmic energy to power your workflow.",
        color: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
        title: "Zen Mastery",
        content: "Balances mind and body for perfect harmony.",
        color: "bg-gradient-to-r from-green-500 to-teal-500",
    },
];

const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            staggerChildren: 0.3,
        },
    },
    hover: {
        scale: 1.1,
        transition: { yoyo: Infinity, duration: 0.3 },
    },
};

const textVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const Billboard = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % effects.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-36 flex items-center justify-center bg-black">
            <motion.div
                key={activeIndex}
                className="absolute bottom-10 justify-center transform -translate-x-1/2 text-white text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold">{effects[activeIndex].title}</h1>
                <p className="text-lg mt-2">{effects[activeIndex].content}</p>
            </motion.div>
        </div>
    );
};

export default Billboard;

