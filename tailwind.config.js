/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,ejs}", "./public/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        "white-60": "rgba(255, 255, 255, 0.60);",
        "white-80": "rgba(255, 255, 255, 0.8);",
        "teal-100": "#3DD1DB",
        "teal-8": "#243031",
        "card-grey": "#2A2A2A",
        "background-grey": "#222222",
        "darkest-grey": "#1B1B1B",
        "light-grey": "#343434",
        "intern-red": "#FC4545",
        header: "#1E1E1E",
        body: "#2B2B2B",
      },
    },
  },
  plugins: [],
};
