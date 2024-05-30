import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                poppins: ["Poppins", "sans-serif"],
                livic: ['Livvic', "sans-serif"],
                BalooBhaina: ['"Baloo Bhaina"', "sans-serif"],
            },
            
            colors: {
                transparent: 'transparent',
                current: 'currentColor',
                'white': '#ffffff',
                'purple': '#3f3cbb',
                'midnight': '#121063',
                'metal': '#565584',
                'tahiti': '#3ab7bf',
                'silver': '#ecebff',
                'bubble-gum': '#ff77e9',
                'bermuda': '#78dcca',
                'sipaud-blue': {
                    100: '#BDD2FE',
                    200: '#5c5f7c',
                    300: '#404472',
                    400: '#263a68',
                    500: '#20335f',
                    600: '#1A2C56',
                    700: '#15254d',
                    800: '#2C679A',
                    900: '#255A86',
                  },
                'sipaud-yellow': {
                    100: '#f1e0d3',
                    200: '#e7d2c1',
                    300: '#dec5b1',
                    400: '#d5b9a2',
                    500: '#ceae94',
                    600: '#D1A683',
                    700: '#b29758',
                    800: '#b68d6c',
                    900: '#ad8360',
                  },
                'sipaud-red': {
                    100: '#FE8468',
                    200: '#e7d2c1',
                    300: '#D5461C',
                    400: '#d5b9a2',
                    500: '#ceae94',
                    600: '#D1A683',
                    700: '#b29758',
                    800: '#b68d6c',
                    900: '#ad8360',
                  },
                'chesna-blue-old': '#2C4D8D',
                'chesna-blue-young': '#87F1FD',
                'chesna-blue': {
                    100: '#c3c0c0',
                    200: '#5c5f7c',
                    300: '#404472',
                    400: '#263a68',
                    500: '#20335f',
                    600: '#1A2C56',
                    700: '#15254d',
                    800: '#102045',
                    900: '#191c40',
                  },
                'chesna-gold': {
                    100: '#f1e0d3',
                    200: '#e7d2c1',
                    300: '#dec5b1',
                    400: '#d5b9a2',
                    500: '#ceae94',
                    600: '#D1A683',
                    700: '#b29758',
                    800: '#b68d6c',
                    900: '#ad8360',
                  },
            },
        },
    },

    plugins: [forms,require('@tailwindcss/forms'),],
};
