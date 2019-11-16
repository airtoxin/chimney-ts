import { Assign, KeyByValueType } from "./type-helpers";

type SameFieldValueKeyInB<A extends {}, B extends {}, AFieldName extends keyof A> = KeyByValueType<
  B,
  A[AFieldName]
>;

type TransType<Into extends {}, From extends {} | {}[]> = From extends Into
  ? TransformableTransformer<Into, From>
  : From extends Array<infer RFrom>
  ? RFrom extends Into
    ? TransformableTransformer<Into, RFrom[]>
    : Transformer<Into, From>
  : Transformer<Into, From>;

class Transformer<Into extends {}, From extends {} | {}[]> {
  constructor(protected fromObj: From) {}

  withFieldConst<
    IntoFieldName extends keyof Into,
    NextFrom extends From extends Array<infer RFrom>
      ? RFrom extends {}
        ? Assign<RFrom, Record<IntoFieldName, Into[IntoFieldName]>>[]
        : never
      : Assign<From, Record<IntoFieldName, Into[IntoFieldName]>>
  >(intoFieldName: IntoFieldName, constValue: Into[IntoFieldName]): TransType<Into, NextFrom> {
    if (Array.isArray(this.fromObj)) {
      return new TransformableTransformer(
        this.fromObj.map(el => ({ ...el, [intoFieldName]: constValue }))
      ) as any;
    } else {
      return new TransformableTransformer({ ...this.fromObj, [intoFieldName]: constValue }) as any;
    }
  }

  withFieldRenamed<
    FromFieldName extends From extends Array<infer RFrom> ? keyof RFrom : keyof From,
    IntoFieldName extends SameFieldValueKeyInB<From, Into, FromFieldName>,
    NextFrom extends From extends Array<infer RFrom>
      ? RFrom extends {}
        ? Assign<RFrom, Record<IntoFieldName, Into[IntoFieldName]>>[]
        : never
      : Assign<From, Record<IntoFieldName, Into[IntoFieldName]>>
  >(fromFieldName: FromFieldName, intoFieldName: IntoFieldName): TransType<Into, NextFrom> {
    if (Array.isArray(this.fromObj)) {
      return new TransformableTransformer(
        this.fromObj.map(el => ({
          ...el,
          [intoFieldName]: el[fromFieldName]
        }))
      ) as any;
    } else {
      return new TransformableTransformer({
        ...this.fromObj,
        [intoFieldName]: this.fromObj[fromFieldName]
      }) as any;
    }
  }

  withFieldComputed<
    IntoFieldName extends keyof Into,
    ComputeFn extends (v: From extends Array<infer R> ? R : From) => Into[IntoFieldName],
    NextFrom extends From extends Array<infer RFrom>
      ? RFrom extends {}
        ? Assign<RFrom, Record<IntoFieldName, Into[IntoFieldName]>>[]
        : never
      : Assign<From, Record<IntoFieldName, Into[IntoFieldName]>>
  >(intoFieldName: IntoFieldName, computeFn: ComputeFn): TransType<Into, NextFrom> {
    if (Array.isArray(this.fromObj)) {
      return new TransformableTransformer(
        this.fromObj.map(el => ({
          ...el,
          [intoFieldName]: computeFn(el)
        }))
      ) as any;
    } else {
      return new TransformableTransformer({
        ...this.fromObj,
        [intoFieldName]: computeFn(this.fromObj as any)
      }) as any;
    }
  }
}

class TransformableTransformer<Into extends {}, From extends Into | Into[]> extends Transformer<
  Into,
  From
> {
  constructor(protected fromObj: From) {
    super(fromObj);
  }

  transform(): From extends Into ? Into : Into[] {
    return this.fromObj as any;
  }
}

export class Chimney<From extends {} | {}[]> {
  constructor(private fromObj: From) {}

  into<Into extends {}>(): TransType<Into, From> {
    return new TransformableTransformer(this.fromObj) as any;
  }
}
