import { Assign, PickByValue } from "utility-types";

type TransType<Into extends {}, From extends {}> = From extends Into
  ? TransformableTransformer<Into, From>
  : Transformer<Into, From>;

type KeyByValueType<Obj extends {}, ValueType> = keyof PickByValue<Obj, ValueType>;

type SameFieldValueKeyInB<A extends {}, B extends {}, AFieldName extends keyof A> = KeyByValueType<
  B,
  A[AFieldName]
>;

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
  >(intoFieldName: IntoFieldName, computer: Computer): TransType<Into, NextFrom> {
    return new TransformableTransformer({
      ...this.fromObj,
      [intoFieldName]: computer(this.fromObj)
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
