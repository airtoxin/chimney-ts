import { Assign, Intersection, PickByValue } from "utility-types";

type TransType<Into extends {}, From extends {}> = From extends Into
  ? TransformableTransformer<Into, From>
  : Transformer<Into, From>;

type KeyByValueType<Obj extends {}, ValueType> = keyof PickByValue<Obj, ValueType>;

type SameFieldValueKeyInB<A extends {}, B extends {}, AFieldName extends keyof A> = KeyByValueType<
  B,
  A[AFieldName]
>;

class Transformer<Into extends {}, From extends {}> {
  withFieldConst<
    IntoFieldName extends keyof Into,
    NextFrom extends Assign<From, Record<IntoFieldName, Into[IntoFieldName]>>
  >(intoFieldName: IntoFieldName, constValue: Into[IntoFieldName]): TransType<Into, NextFrom> {
    return null as any;
  }

  withFieldRenamed<
    FromFieldName extends keyof From,
    IntoFieldName extends SameFieldValueKeyInB<From, Into, FromFieldName>,
    NextFrom extends Assign<From, Record<IntoFieldName, Into[IntoFieldName]>>
  >(fromFieldName: FromFieldName, intoFieldName: IntoFieldName): TransType<Into, NextFrom> {
    return null as any;
  }

  withFieldComputed<
    IntoFieldName extends keyof Into,
    Computer extends (v: From) => Into[IntoFieldName],
    NextFrom extends Assign<From, Record<IntoFieldName, Into[IntoFieldName]>>
  >(intoFieldName: IntoFieldName, computer: Computer): TransType<Into, NextFrom> {
    return null as any;
  }

  omitExtraFields<NextFrom extends Intersection<Into, From>>(): TransType<Into, NextFrom> {
    return null as any;
  }
}

class TransformableTransformer<Into extends {}, From extends Into> extends Transformer<Into, From> {
  transform(): Into {
    return null as any;
  }
}

export class Chimney<From extends {}> {
  constructor(private fromObj: From) {}

  into<Into extends {}>(): TransType<Into, From> {
    return null as any;
  }
}
