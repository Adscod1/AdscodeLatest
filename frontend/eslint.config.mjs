import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Ignore generated files and problematic directories
  {
    ignores: [
      // Generated files
      "lib/generated/**/*",
      "prisma/dev.db",
      "prisma/migrations/**/*",
      
      // Build outputs and system files
      "node_modules/**/*",
      ".next/**/*",
      "out/**/*",
      "build/**/*",
      "dist/**/*",
      
      // Config files that might have different rules
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      
      // Docker files
      "Dockerfile*",
      "docker-compose*.yml",
      ".dockerignore"
    ]
  },
  
  // Apply Next.js rules to remaining files with relaxed settings
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Override rules to be less strict for existing codebase
  {
    rules: {
      // Allow unused variables with underscore prefix
      "@typescript-eslint/no-unused-vars": [
        "warn", 
        { 
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "ignoreRestSiblings": true,
          "destructuredArrayIgnorePattern": "^_"
        }
      ],
      
      // Allow any type in existing code
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Relax React rules for existing content
      "react/no-unescaped-entities": "warn",
      
      // Allow img tags (can be fixed gradually)
      "@next/next/no-img-element": "warn",
      
      // Allow console for debugging
      "no-console": "warn",
      
      // Allow empty catch blocks
      "no-empty": "warn",
      
      // Allow require imports in some contexts
      "@typescript-eslint/no-require-imports": "warn",
      
      // Relax other strict rules
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-wrapper-object-types": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/no-unnecessary-type-constraint": "warn",
      "@typescript-eslint/no-this-alias": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
    }
  }
];

export default eslintConfig;
