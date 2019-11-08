# Chimney-ts

[![Travis](https://img.shields.io/travis/alexjoverm/typescript-library-starter.svg)](https://travis-ci.org/alexjoverm/typescript-library-starter)
[![Coveralls](https://img.shields.io/coveralls/alexjoverm/typescript-library-starter.svg)](https://coveralls.io/github/alexjoverm/typescript-library-starter)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/airtoxin)

Type safe transformation in TypeScript.

### Usage

```typescript
import { Chimney } from "chimney-ts";

const square = { size: 10 };
type Rect = { width: number, height: number };

const incompleteRect = new Chimney(square)
  .into<Rect>()
  .withFieldRenamed("size", "width");
// Can't call `transform()` because `height` property not filled
// incompleteRect.transform()

const completeRect = incompleteRect
  .withFieldRenamed("size", "height")
  .transform();
// Square transforms into Rect
```

### API

