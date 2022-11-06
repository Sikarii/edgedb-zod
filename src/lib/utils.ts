import { $, adapter, Client } from "edgedb";

export interface PointerConstraint {
  name: string,
  params: {
    name: string,
    kind: string,
    value: string,
  }[]
}

export const ensureDir = async (path: string) => {
  const exists = await adapter.exists(path);

  if (!exists) {
    return adapter.fs.mkdir(path, {
      recursive: true,
    });
  }
};

export const getProjectRoot = async (dir?: string): Promise<string | null> => {
  const currentDir = dir ?? adapter.process.cwd();
  const systemRoot = adapter.path.parse(currentDir).root;

  if (currentDir === systemRoot) {
    return null;
  }

  const tomlPath = adapter.path.join(currentDir, "edgedb.toml");

  const tomlExists = await adapter.exists(tomlPath);
  if (tomlExists) {
    return currentDir;
  }

  const next = adapter.path.join(currentDir, "..");
  return getProjectRoot(next);
};

export const getPointerConstraints = async (
  client: Client,
  objName: string,
  pointer: $.introspect.Pointer,
) => {
  const query = `
    WITH
      module schema,
      object := (
        select ObjectType filter .name = <str>$objectName LIMIT 1
      ),
      pointer := (
        select object.pointers filter .name = <str>$pointerName LIMIT 1
      )
    SELECT pointer.constraints {
      name,
      params: {
        name,
        kind,
        value := @value
      }
    }
  `;

  const result = await client.queryJSON(query, {
    objectName: objName,
    pointerName: pointer.name,
  });

  return JSON.parse(result) as PointerConstraint[];
};
