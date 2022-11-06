import { $ } from "edgedb";

interface RegistryItem<T> {
  id: string;
  type: T;
  name: string;
  module: string;
  fullName: string;
}

export class Registry {
  public readonly objects: RegistryItem<$.introspect.ObjectType>[];
  public readonly scalars: RegistryItem<$.introspect.ScalarType>[];

  private readonly modules: Set<string>;

  private readonly warnings: string[];

  constructor(private readonly types: $.introspect.Types) {
    this.objects = [];
    this.scalars = [];
    this.modules = new Set();
    this.warnings = [];
  }

  resolveType(id: string) {
    return this.types.get(id);
  }

  registerScalar(scalar: $.introspect.ScalarType) {
    return this.register(scalar, this.scalars);
  }

  registerObject(object: $.introspect.ObjectType) {
    return this.register(object, this.objects);
  }

  registerScalarByName(name: string) {
    const typesArr = [...this.types.values()];

    const type = typesArr.find((t) => t.name === name);
    if (!type) {
      throw new Error(`Cannot locate scalar ${name}`);
    }

    if (type.kind !== "scalar") {
      throw new Error(`Cannot register ${type.kind} ${name} as scalar`);
    }

    return this.registerScalar(type);
  }

  getModules() {
    return [...this.modules.values()];
  }

  getAllByModule(module: string) {
    const scalars = this.scalars.filter((s) => s.module === module);
    const objects = this.objects.filter((o) => o.module === module);

    const sortNumeric = (a: string, b: string) => {
      return a.localeCompare(b, undefined, {
        numeric: true,
      });
    };

    return {
      scalars: [...scalars].sort((a, b) => sortNumeric(a.name, b.name)),
      objects: [...objects].sort((a, b) => sortNumeric(a.name, b.name)),
    };
  }

  private register<T extends $.introspect.Type>(type: T, arr: RegistryItem<T>[]) {
    if (!type.name.includes("::")) {
      throw new Error(`Invalid type name: ${type.name}`);
    }

    const [mod, name] = type.name.split("::");

    const oldEntry = arr.find((x) => x.fullName === type.name);
    if (!oldEntry) {
      this.modules.add(mod);

      arr.push({
        id: type.id,
        type: type,
        name: name,
        module: mod,
        fullName: type.name,
      });
    }
  }
}
