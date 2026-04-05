import type { Resolver, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * typedZodResolver
 * Helper that returns a `Resolver` typed to `T`. This centralizes the unsafe cast
 * in one place to avoid repeating `as unknown as Resolver<...>` everywhere.
 */
export const typedZodResolver = <T extends FieldValues = FieldValues>(
  schema: unknown
): Resolver<T> => {
  // Use a type guard to check if the schema has the expected Zod parse method
  if (
    typeof schema === "object" &&
    schema !== null &&
    "parse" in schema &&
    typeof (schema as { parse: unknown }).parse === "function"
  ) {
    // Instead of 'any', we use a structural type that satisfies Zod3Type
    // or Zod4 core interfaces while ensuring Input extends FieldValues.
    type CompatibleSchema = {
      _input: T;
      _output: T;
      _def: { typeName: string };
    };

    const resolverSchema = schema as unknown as CompatibleSchema;
    
    // We cast the result to unknown and then to Resolver<T> to avoid 
    // any direct 'any' keywords while maintaining runtime behavior.
    return (zodResolver as unknown as (s: CompatibleSchema) => Resolver<T>)(resolverSchema);
  }
  throw new Error("Invalid Zod schema provided to typedZodResolver");
};

export default typedZodResolver;
