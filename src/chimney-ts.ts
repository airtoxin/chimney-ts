import { Assign, Optional } from "utility-types";

type TransType<Into extends {}, From extends {}> = From extends Into
  ? TransformableTransformer<Into, From>
  : Transformer<Into, From>;

class Transformer<Into extends {}, From extends {}> {
  withFieldConst<
    IntoFieldName extends keyof Into,
    NextFrom extends Assign<From, Record<IntoFieldName, Into[IntoFieldName]>>
  >(intoFieldName: IntoFieldName, constValue: Into[IntoFieldName]): TransType<Into, NextFrom> {
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

const stevie = {
  size: 5,
  name: "Steve"
};
type Catterpillar = typeof stevie;

type Butterfly = {
  size: number;
  name: string;
  wingsColor: string;
};

const into = new Chimney(stevie)
  .into<Butterfly>()
  .withFieldConst("wingsColor", "red")
  .transform();
