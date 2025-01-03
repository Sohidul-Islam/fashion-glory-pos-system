/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand': {
                    'primary': '#32cd32',
                    'hover': '#28a428',
                },
                "gray": {
                    "100": "#D9D9D9"
                }
            },
            width: {
                'sidebar': 'min(250px, 70vw)',
            }
        },
    },
    plugins: [],
} 