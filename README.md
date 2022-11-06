# edgedb-zod

`edgedb-zod` is a code generator for [Zod](https://github.com/colinhacks/zod) schemas from your EdgeDB database schema.

2 types of schemas will be generated:
- `Create`: All properties excluding link properties
- `Update`: All properties excluding link and readonly properties

## CLI

To run the CLI: `edgedb-zod [options]`

Currently the supported options are:
- `--outputDir`: The output directory relative from your `edgedb.toml`
- `--target ts|mts`: If set to `mts` will include `.js` in import statements

## Supported features

| Feature | Status |
| ------- | :----: |
| Most scalars          | ✔️ |
| Ranges                | ❌ |
| Arrays, tuples        | ✔️ |
| Union types           | ❌ |
| Abstract objects      | ✔️ |
| Overloaded properties | ✔️ |
| Regex constraints     | ✔️ |
| Min, max constraints  | ❌ |
| Custom validators     | ❌ |
| Property annotations  | ❌ |

## Example output

Partial output of `edgedb-zod/modules/default.ts`:
```ts
// #region default::User
export const CreateUserSchema = z.
  object({ // default::HasTimestamps
    createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?)?Z?$/).optional(), // std::datetime
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?)?Z?$/).optional(), // std::datetime
  })
  .extend({ // default::User
    name: z.string(), // std::str
    emailAddress: z.string().regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/), // std::str
    password: z.string(), // std::str
  });

export const UpdateUserSchema = z.
  object({ // default::HasTimestamps
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?)?Z?$/).optional(), // std::datetime
  })
  .extend({ // default::User
    name: z.string(), // std::str
    emailAddress: z.string().regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/), // std::str
    password: z.string(), // std::str
  });
// #endregion
```