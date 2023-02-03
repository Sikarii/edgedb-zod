import { $ } from "edgedb";

const zodType = (name: string, ...args: unknown[]) => `${name}(${args})`;

const zodEnum = (values: unknown[]) => {
  const str = values.join(", ");
  return zodType("enum", `[${str}]`);
};

export const scalarToZod = (type: $.introspect.ScalarType) => {
  if (type.enum_values) {
    const values = type.enum_values.map((v) => `"${v}"`);

    return [
      zodEnum(values),
    ];
  }

  switch (type.name) {
    case "std::str":
      return [
        zodType("string"),
      ];

    case "std::bool":
      return [
        zodType("boolean"),
      ];

    case "std::json":
      return [
        zodType("unknown"),
      ];

    case "std::uuid":
      return [
        zodType("string"),
        zodType("uuid"),
      ];

    case "std::int16":
      return [
        zodType("number"),
        zodType("int"),
        zodType("min", 0),
        zodType("max", 65535),
      ];

    case "std::int32":
      return [
        zodType("number"),
        zodType("int"),
        zodType("min", 0),
        zodType("max", 2147483647),
      ];

    case "std::int64":
      return [
        zodType("number"),
        zodType("int"),
        zodType("min", 0),
      ];

    case "std::bigint":
      return [
        zodType("bigint"),
      ];

    case "std::datetime":
      return [
        zodType("date"),
      ];

    case "std::float32":
      return [
        zodType("number"),
        zodType("min", 0),
        zodType("max", 3.40282347E+38),
      ];

    case "std::float64":
      return [
        zodType("number"),
        zodType("min", 0),
        zodType("max", 1.7976931348623157E+308),
      ];

    // This is not a type in EdgeDB, the JS driver has this
    case "std::number":
      return [
        zodType("number"),
      ];

    default:
      // TODO: Null might make more sense
      return [
        zodType("never"),
      ];
  }
};
