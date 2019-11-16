export type Intersection<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>;
export type SetDifference<A, B> = A extends B ? never : A;
export type Diff<T extends object, U extends object> = Pick<T, SetDifference<keyof T, keyof U>>;
export type Assign<
  T extends object,
  U extends object,
  I = Diff<T, U> & Intersection<U, T> & Diff<U, T>
> = Pick<I, keyof I>;
export type PickByValue<T, ValueType> = Pick<
  T,
  {
    [Key in keyof T]: T[Key] extends ValueType ? Key : never;
  }[keyof T]
>;
export type KeyByValueType<Obj extends {}, ValueType> = keyof PickByValue<Obj, ValueType>;
