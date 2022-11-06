module extra {
  scalar type MyEnum extending enum<`1`, `2`, `3`, `4`, `5`>;

  type MyType extending default::HasTimestamps {
    optional property jsonData -> json;
    optional property enumTest -> MyEnum;
    optional property rangeTest -> range<int64>;
  };
};