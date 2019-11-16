import { Assign, KeyByValueType } from "./type-helpers";

type SameFieldValueKeyInB<A extends {}, B extends {}, AFieldName extends keyof A> = KeyByValueType<
  B,
  A[AFieldName]
>;

type TransType<Into extends {}, From extends {} | {}[] | Promise<{}>> = From extends Into
  ? TransformableTransformer<Into, From>
  : From extends Array<infer RFrom>
  ? RFrom extends Into
    ? TransformableTransformer<Into, RFrom[]>
    : Transformer<Into, From>
  : From extends Promise<infer RFrom>
  ? RFrom extends Into
    ? TransformableTransformer<Into, Promise<RFrom>>
    : Transformer<Into, From>
  : Transformer<Into, From>;

class Transformer<Into extends {}, From extends {} | {}[] | Promise<{}>> {
  constructor(protected fromObj: From, protected options: ChimneyOptions) {}

  private isPromise(obj: any): obj is Promise<any> {
    return (
      obj instanceof Promise ||
      (this.options.relaxPromise &&
        Object.prototype.hasOwnProperty.call(obj, "then") &&
        typeof (obj as any).then === "function")
    );
  }

  withFieldConst<
    IntoFieldName extends keyof Into,
    NextFrom extends From extends Array<infer RFrom>
      ? RFrom extends {}
        ? Assign<RFrom, Record<IntoFieldName, Into[IntoFieldName]>>[]
        : never
      : From extends Promise<infer RFrom>
      ? RFrom extends {}
        ? Promise<Assign<RFrom, Record<IntoFieldName, Into[IntoFieldName]>>>
        : never
      : Assign<From, Record<IntoFieldName, Into[IntoFieldName]>>
  >(intoFieldName: IntoFieldName, constValue: Into[IntoFieldName]): TransType<Into, NextFrom> {
    if (this.isPromise(this.fromObj)) {
      return new TransformableTransformer(
        this.fromObj.then(el => ({
          ...el,
          [intoFieldName]: constValue
        })),
        this.options
      ) as any;
    } else if (Array.isArray(this.fromObj)) {
      return new TransformableTransformer(
        this.fromObj.map(el => ({ ...el, [intoFieldName]: constValue })),
        this.options
      ) as any;
    } else {
      return new TransformableTransformer(
        {
          ...this.fromObj,
          [intoFieldName]: constValue
        },
        this.options
      ) as any;
    }
  }

  withFieldRenamed<
    FromFieldName extends From extends Array<infer RFrom>
      ? keyof RFrom
      : From extends Promise<infer RFrom>
      ? keyof RFrom
      : keyof From,
    IntoFieldName extends SameFieldValueKeyInB<From, Into, FromFieldName>,
    NextFrom extends From extends Array<infer RFrom>
      ? RFrom extends {}
        ? Assign<RFrom, Record<IntoFieldName, Into[IntoFieldName]>>[]
        : never
      : From extends Promise<infer RFrom>
      ? RFrom extends {}
        ? Promise<Assign<RFrom, Record<IntoFieldName, Into[IntoFieldName]>>>
        : never
      : Assign<From, Record<IntoFieldName, Into[IntoFieldName]>>
  >(fromFieldName: FromFieldName, intoFieldName: IntoFieldName): TransType<Into, NextFrom> {
    if (this.isPromise(this.fromObj)) {
      return new TransformableTransformer(
        this.fromObj.then(el => ({
          ...el,
          [intoFieldName]: el[fromFieldName]
        })),
        this.options
      ) as any;
    } else if (Array.isArray(this.fromObj)) {
      return new TransformableTransformer(
        this.fromObj.map(el => ({
          ...el,
          [intoFieldName]: el[fromFieldName]
        })),
        this.options
      ) as any;
    } else {
      return new TransformableTransformer(
        {
          ...this.fromObj,
          [intoFieldName]: this.fromObj[fromFieldName]
        },
        this.options
      ) as any;
    }
  }

  withFieldComputed<
    IntoFieldName extends keyof Into,
    ComputeFn extends (
      v: From extends Array<infer R> ? R : From extends Promise<infer R> ? R : From
    ) => Into[IntoFieldName],
    NextFrom extends From extends Array<infer RFrom>
      ? RFrom extends {}
        ? Assign<RFrom, Record<IntoFieldName, Into[IntoFieldName]>>[]
        : never
      : From extends Promise<infer RFrom>
      ? RFrom extends {}
        ? Promise<Assign<RFrom, Record<IntoFieldName, Into[IntoFieldName]>>>
        : never
      : Assign<From, Record<IntoFieldName, Into[IntoFieldName]>>
  >(intoFieldName: IntoFieldName, computeFn: ComputeFn): TransType<Into, NextFrom> {
    if (this.isPromise(this.fromObj)) {
      return new TransformableTransformer(
        this.fromObj.then(el => ({
          ...el,
          [intoFieldName]: computeFn(el)
        })),
        this.options
      ) as any;
    } else if (Array.isArray(this.fromObj)) {
      return new TransformableTransformer(
        this.fromObj.map(el => ({
          ...el,
          [intoFieldName]: computeFn(el)
        })),
        this.options
      ) as any;
    } else {
      return new TransformableTransformer(
        {
          ...this.fromObj,
          [intoFieldName]: computeFn(this.fromObj as any)
        },
        this.options
      ) as any;
    }
  }
}

class TransformableTransformer<
  Into extends {},
  From extends Into | Into[] | Promise<Into>
> extends Transformer<Into, From> {
  constructor(protected fromObj: From, protected options: ChimneyOptions) {
    super(fromObj, options);
  }

  transform(): From extends Into
    ? Into
    : From extends Into[]
    ? Into[]
    : From extends Promise<Into>
    ? Promise<Into>
    : never {
    return this.fromObj as any;
  }
}

export interface ChimneyOptions {
  relaxPromise: boolean;
}

const defaultOptions: ChimneyOptions = {
  relaxPromise: false
};

export class Chimney<From extends {} | {}[] | Promise<{}>> {
  constructor(private fromObj: From, private options: ChimneyOptions = defaultOptions) {}

  into<Into extends {}>(): TransType<Into, From> {
    return new TransformableTransformer(this.fromObj, this.options) as any;
  }
}
