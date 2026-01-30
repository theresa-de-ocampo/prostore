# ESLint Config

VS Code surfaces editor diagnostics for symbols tagged with `/** @deprecated */` in `.d.ts` files.

ESLint won't report deprecations unless you enable a specific rule that uses type information.

## Make "deprecated usage" fail in `npm run lint`

Enable TypeScript-aware ESLint + the `no-deprecated` rule.

1. Install the needed tooling. This is already a dependency for `eslint-config-next`

   ```bash
   npm i -D typescript eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
   ```

2. Configure ESLint to use type info and flag deprecated symbols.

   In your ESLint config (flat config `eslint.config.mjs` or legacy `.eslintrc.*`):

   ```javascript
   defineConfig([
     {
       files: ["**/*.{ts,tsx}"],
       languageOptions: {
         parser: tsParser,
         parserOptions: {
           project: "./tsconfig.json",
           tsconfigRootDir: import.meta.dirname
         }
       },
       plugins: {
         "@typescript-eslint": tseslint
       },
       rules: {
         "@typescript-eslint/no-deprecated": "warn"
       }
     }
   ]);
   ```

   `parser` and `parserOptions` enables **typed linting** to rules like `no-deprecated` can use type info from `tsconfig.json`.

## What is Typed Linting?

Some rules (like `@typescript-eslint/no-deprecated`) need TypeScript's _type checker_. To get that, ESLint must spin up a TypeScript "Program" based on your `tsconfig.json`. When ESLint creates the Program, it uses parts of the `tsconfig.json` such as the `compilerOptions` to know how imports are interpreted.
