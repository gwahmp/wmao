/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,md,mdx,js,ts}"],
    theme: {
      extend: {
        colors: {
          wmblue: "#0077b5",
          twitter: '#000000',
          facebook: '#1877F2',
          instagram: '#E4405F',
          youtube: '#FF0000',
          linkedin: '#0A66C2',
        },
      },
    },
    plugins: [require('@tailwindcss/typography')],
  };