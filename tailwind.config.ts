import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                uclaBlue: "#2774AE", // ucla blue
                darkestBlue: "#003B5C", // Darkest blue
                darkerBlue: "#005587", // Darker blue
                lighterBlue: "#8BB8E8", // Lighter blue
                lightestBlue: "#DAEBFE", // Darkest blue
                uclaGold: "#FFD100", // ucla gold
                darkestGold: "#FFB81C", // Darkest gold
                darkerGold: "#FFC72C", // Darker gold
            },
        },
    },
    plugins: [],
};
export default config;
