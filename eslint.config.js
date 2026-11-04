export default [
  {
    files: ["src/**/*.js", "test/**/*.{js,mjs}", "studio/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {
      semi: ["error", "always"],
      "prefer-const": "error"
    }
  }
];
