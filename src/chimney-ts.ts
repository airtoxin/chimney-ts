type Intersection<T extends object, U extends object> = Pick<T, Extract<keyof T, keyof U> & Extract<keyof U, keyof T>>;
type SetDifference<A, B> = A extends B ? never : A;
type Diff<T extends object, U extends object> = Pick<T, SetDifference<keyof T, keyof U>>;
type Assign<T extends object, U extends object, I = Diff<T, U> & Intersection<U, T> & Diff<U, T>> = Pick<I, keyof I>;
type PickByValue<T, ValueType> = Pick<T, {
  [Key in keyof T]: T[Key] extends ValueType ? Key : never;
}[keyof T]>;
type SameFieldValueKeyInB<A extends {}, B extends {}, AFieldName extends keyof A> = KeyByValueType<
  B,
  A[AFieldName]
  >;
type KeyByValueType<Obj extends {}, ValueType> = keyof PickByValue<Obj, ValueType>;

type TransType<Into extends {}, From extends {}> = From extends Into
  ? TransformableTransformer<Into, From>
  : Transformer<Into, From>;

class Transformer<Into extends {}, From extends {}> {
  constructor(protected fromObj: From) {}

  withFieldConst<
    IntoFieldName extends keyof Into,
    NextFrom extends Assign<From, Record<IntoFieldName, Into[IntoFieldName]>>
  >(intoFieldName: IntoFieldName, constValue: Into[IntoFieldName]): TransType<Into, NextFrom> {
    return new TransformableTransformer({ ...this.fromObj, [intoFieldName]: constValue }) as any;
  }

  withFieldRenamed<
    FromFieldName extends keyof From,
    IntoFieldName extends SameFieldValueKeyInB<From, Into, FromFieldName>,
    NextFrom extends Assign<From, Record<IntoFieldName, Into[IntoFieldName]>>
  >(fromFieldName: FromFieldName, intoFieldName: IntoFieldName): TransType<Into, NextFrom> {
    return new TransformableTransformer({
      ...this.fromObj,
      [intoFieldName]: this.fromObj[fromFieldName]
    }) as any;
  }

  withFieldComputed<
    IntoFieldName extends keyof Into,
    Computer extends (v: From) => Into[IntoFieldName],
    NextFrom extends Assign<From, Record<IntoFieldName, Into[IntoFieldName]>>
  >(intoFieldName: IntoFieldName, computeFn: Computer): TransType<Into, NextFrom> {
    return new TransformableTransformer({
      ...this.fromObj,
      [intoFieldName]: computeFn(this.fromObj)
    }) as any;
  }
}

class TransformableTransformer<Into extends {}, From extends Into> extends Transformer<Into, From> {
  constructor(protected fromObj: From) {
    super(fromObj);
  }

  transform(): Into {
    return this.fromObj;
  }
}

export class Chimney<From extends {}> {
  constructor(private fromObj: From) {}

  into<Into extends {}>(): TransType<Into, From> {
    return new TransformableTransformer(this.fromObj) as any;
  }
}
