# Chimney-ts

[![Travis](https://img.shields.io/travis/airtoxin/chimney-ts.svg)](https://travis-ci.org/airtoxin/chimney-ts)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/airtoxin)

Type safe transformation in TypeScript.

## Usage

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

## API

### Chimney

Creates new chimney transformer. 

```typescript
import { Chimney } from "chimney-ts";
const transformer = new Chimney(fromObj).into<Into>();
```

__type constraints__

+ `fromObj` value must extends `{}` type.
+ `Into` type must extends `{}` type.

### Transformer#withFieldConst

Creates new transformer that fills constantValue at fieldName.

```typescript
transformer
  .withFieldConst("width", 10)
  .withFieldConst("height", 10)
```

Compatible code: `{ ...fromObj, [intoFieldName]: constValue }`

__arguments & type constraints__

+ intoFieldName: `keyof Into` type.
+ constValue: value that extends type of `Into<IntoFieldName>`

### Transformer#withFieldRenamed

Creates new transformer that renames field. 

```typescript
transformer
  .withFieldRenamed("size", "width")
  .withFieldRenamed("size", "height")
```

Compatible code: `{ ...fromObj, [intoFieldName]: fromObj[fromFieldName] }`

__arguments & type constraints__

+ fromFieldName: `keyof From` type.
+ intoFieldName: `keyof Into` type & `From<IntoFieldName>` equals to `Into<IntoFieldName>`

### Transformer#withFieldComputed

Creates new transformer that fills computed value at fieldName.

```typescript
transformer
  .withFieldComputed("width", fromObj => fromObj.size * 10)
  .withFieldComputed("height", fromObj => fromObj.size * 10)
```

Compatible code: `{ ...fromObj, [intoFieldName]: computeFn(fromObj) }`

__arguments & type constraints__

+ intoFieldName: `keyof Into` type
+ computeFn(fromObj): function that returns value that extends `Into<IntoFieldName>` type

### Transformer#transform

Returns transformed value that has `Into` type.  
If transformer is not compatible with Into type, method can't call!

```typescript
transformer.transform()
```
