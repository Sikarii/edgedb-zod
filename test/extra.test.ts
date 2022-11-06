import { z } from "zod";
import { it, describe, expect } from "vitest";

const extra = import("../dbschema/edgedb-zod/modules/extra");

describe("extra::MyEnum", async () => {
  const schema = (await extra).MyEnumSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodEnum);
  });

  it("has the expected values", () => {
    expect(schema._def.values).toMatchSnapshot();
  });
});

describe("extra::CreateMyType", async () => {
  const schema = (await extra).CreateMyTypeSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodObject);
  });

  it("has the expected shape", () => {
    expect(schema.shape).toMatchSnapshot();
  });
});

describe("extra::UpdateMyType", async () => {
  const schema = (await extra).UpdateMyTypeSchema;

  it("is exported", () => {
    expect(schema).toBeDefined();
  });

  it("is the correct instance", () => {
    expect(schema).toBeInstanceOf(z.ZodObject);
  });

  it("has the expected shape", () => {
    expect(schema.shape).toMatchSnapshot();
  });
});
