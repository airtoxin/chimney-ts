import { Chimney } from "./chimney-ts";

type Not<A> = A extends true ? false : true;

export type TypeEq<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
  ? true
  : false;

export type TypeHas<A, B> = B extends keyof A ? true : false;

export function assertType<T extends true>() {
  // empty
}

type Transformable<A> = TypeHas<A, "transform">;

describe("Chimney", () => {
  const square = { size: 10 };
  const rect = { width: 10, height: 10 };
  const coloredRect = { width: 10, height: 10, color: "red" };

  type Square = typeof square;
  type Rect = typeof rect;
  type ColoredRect = typeof coloredRect;

  it("From/Into types are exactly equal type", () => {
    const result = new Chimney(rect).into<Rect>().transform();
    type Result = typeof result;
    assertType<TypeEq<Result, Rect>>();
  });

  it("From type compatible to Into type", () => {
    const coloredRect = { ...rect, color: "red" };
    const result = new Chimney(coloredRect).into<Rect>().transform();
    type Result = typeof result;
    assertType<TypeEq<Result, Rect>>();
  });

  it("can't call transform method if From type not compatible to Into type", () => {
    const transformer = new Chimney(square).into<Rect>();
    type Transformer = typeof transformer;
    assertType<Not<Transformable<Transformer>>>();
  });

  it("From type transform with withFieldConst to Into type", () => {
    const result = new Chimney(square)
      .into<Rect>()
      .withFieldConst("width", 10)
      .withFieldConst("height", 10)
      .transform();
    type Result = typeof result;
    assertType<TypeEq<Result, Rect>>();
  });

  it("can't call transform method if required fields are not exists at Transformer type in withFieldConst", () => {
    const transformer = new Chimney(square).into<Rect>().withFieldConst("width", 10);
    type Transformer = typeof transformer;
    assertType<Not<Transformable<Transformer>>>();
  });

  it("From type transform with withFieldRenamed to Into type", () => {
    const result = new Chimney(square)
      .into<Rect>()
      .withFieldRenamed("size", "width")
      .withFieldRenamed("size", "height")
      .transform();
    type Result = typeof result;
    assertType<TypeEq<Result, Rect>>();
  });

  it("can't call transform method if required fields are not exists at Transformer type in withFieldConst", () => {
    const transformer = new Chimney(square).into<Rect>().withFieldRenamed("size", "width");
    type Transformer = typeof transformer;
    assertType<Not<Transformable<Transformer>>>();
  });

  it("From type transform with withFieldComputed to Into type", () => {
    const result = new Chimney(square)
      .into<Rect>()
      .withFieldComputed("width", square => square.size * 10)
      .withFieldComputed("height", square => square.size * 10)
      .transform();
    type Result = typeof result;
    assertType<TypeEq<Result, Rect>>();
  });

  it("can't call transform method if required fields are not exists at Transformer type in withFieldComputed", () => {
    const transformer = new Chimney(square)
      .into<Rect>()
      .withFieldComputed("width", square => square.size * 10);
    type Transformer = typeof transformer;
    assertType<Not<Transformable<Transformer>>>();
  });

  it("omit extra fields in result object if omitExtraFields called", () => {
    const resultNotOmitted = new Chimney(square)
      .into<Rect>()
      .withFieldRenamed("size", "width")
      .withFieldRenamed("size", "height")
      .transform();
    const resultOmitted = new Chimney(square)
      .into<Rect>()
      .withFieldRenamed("size", "width")
      .withFieldRenamed("size", "height")
      .omitExtraFields()
      .transform();

    expect(resultNotOmitted).toEqual({ ...square, ...rect });
    expect(resultOmitted).toEqual(rect);
  });
});
