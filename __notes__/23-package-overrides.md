# Overrides

## `hono`

**Dependencies**

- `@prisma/dev`

## `lodash-es`

**Dependencies**

- `@prisma/dev`
- `@streamdown/mermaid@1.0.1` from AI Elements

```bash
lodash  4.0.0 - 4.17.21
Severity: moderate
Lodash has Prototype Pollution Vulnerability in `_.unset` and `_.omit` functions - https://github.com/advisories/GHSA-xxjr-mmjv-4gpg
No fix available
node_modules/lodash
  @chevrotain/cst-dts-gen  10.0.0 - 11.1.0
  Depends on vulnerable versions of @chevrotain/gast
  Depends on vulnerable versions of @chevrotain/gast
  Depends on vulnerable versions of lodash
  Depends on vulnerable versions of lodash-es
  node_modules/@chevrotain/cst-dts-gen
  node_modules/@mrleebo/prisma-ast/node_modules/@chevrotain/cst-dts-gen
  @chevrotain/gast  <=11.1.0
  Depends on vulnerable versions of lodash
  Depends on vulnerable versions of lodash-es
  node_modules/@chevrotain/gast
  node_modules/@mrleebo/prisma-ast/node_modules/@chevrotain/gast
  chevrotain  10.0.0 - 11.1.0
  Depends on vulnerable versions of @chevrotain/cst-dts-gen
  Depends on vulnerable versions of @chevrotain/cst-dts-gen
  Depends on vulnerable versions of @chevrotain/gast
  Depends on vulnerable versions of @chevrotain/gast
  Depends on vulnerable versions of lodash
  Depends on vulnerable versions of lodash-es
  node_modules/@mrleebo/prisma-ast/node_modules/chevrotain
  node_modules/chevrotain
    @mrleebo/prisma-ast  >=0.4.2
    Depends on vulnerable versions of chevrotain
    node_modules/@mrleebo/prisma-ast
      @prisma/dev  >=0.11.1
      Depends on vulnerable versions of @mrleebo/prisma-ast
      node_modules/@prisma/dev
        prisma  >=6.20.0-dev.1
        Depends on vulnerable versions of @prisma/dev
        node_modules/prisma
    langium  2.1.0 - 4.1.3
    Depends on vulnerable versions of chevrotain
    node_modules/langium
      @mermaid-js/parser  *
      Depends on vulnerable versions of langium
      node_modules/@mermaid-js/parser
        mermaid  >=11.0.0-alpha.1
        Depends on vulnerable versions of @mermaid-js/parser
        node_modules/mermaid
          @streamdown/mermaid  *
          Depends on vulnerable versions of mermaid
          node_modules/@streamdown/mermaid

lodash-es  4.0.0 - 4.17.22
Severity: moderate
Lodash has Prototype Pollution Vulnerability in `_.unset` and `_.omit` functions - https://github.com/advisories/GHSA-xxjr-mmjv-4gpg
No fix available
node_modules/@chevrotain/cst-dts-gen/node_modules/lodash-es
node_modules/@chevrotain/gast/node_modules/lodash-es
node_modules/chevrotain/node_modules/lodash-es

12 moderate severity vulnerabilities
```
