// import js from "@eslint/js";
// import globals from "globals";
// import pluginReact from "eslint-plugin-react";
// import { defineConfig } from "eslint/config";


// export default defineConfig([
//   { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"] },
//   { files: ["**/*.{js,mjs,cjs,jsx}"], languageOptions: { globals: globals.browser } },
//   {
//     rules: {
//       // This rule expects 'React' to be in scope for JSX
//       'react/react-in-jsx-scope': 'off',
//     },
//   },
//   pluginReact.configs.flat.recommended,
// ]);


// import js from "@eslint/js";
// import globals from "globals";
// import pluginReact from "eslint-plugin-react";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   {
//     files: ["**/*.{js,mjs,cjs,jsx}"],
//     languageOptions: {
//       ecmaVersion: 2022,
//       sourceType: "module",
//       globals: globals.browser,
//     },
//     plugins: {
//       js,
//       react: pluginReact,
//     },
//     rules: {
//       // You can add or tweak rules here as needed
//     },
//     settings: {
//       react: {
//         version: "detect",
//       },
//     },
//     extends: [
//       "js/recommended",
//       "plugin:react/recommended",

//     ],
//   }
// ]);


import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      js,
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    extends: ["js/recommended"],
  },
]);
