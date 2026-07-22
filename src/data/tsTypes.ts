import type { Deck } from '../types';

export const tsTypes: Deck = {
  id: 'ts-types',
  title: 'TypeScript in Practice',
  description: 'The type-system questions that separate users from understanders.',
  icon: '🔷',
  color: '#3b82f6',
  track: 'JavaScript & TypeScript',
  cards: [
    {
      id: 'tst-structural',
      type: 'flash',
      front: 'Two unrelated interfaces have identical members. Why does TypeScript let you assign one to the other?',
      back: 'TypeScript is structurally typed: compatibility is decided by shape (member names and types), not by the declared name. If a value has everything the target requires, it is assignable. Nominal languages (Java, C#) match by name instead. Practical upshot: look-alike types interchange freely, and when you truly need nominal behavior (UserId vs OrderId, both number) the workaround is branding: adding a unique tag property to make the shapes differ.',
    },
    {
      id: 'tst-interface-vs-type',
      type: 'flash',
      front: 'interface vs type alias: what can each do that the other cannot?',
      back: 'Interface only:\n1) Declaration merging: two interface Foo blocks merge into one type. This is how library users augment existing types (extending Window, adding fields to Express\'s Request).\nType alias only:\n2) Unions, tuples, mapped types, conditional types, and naming primitives.\nBoth can describe objects and be extended (extends vs intersection). Working default: interface for object shapes others may augment, type for everything else.',
    },
    {
      id: 'tst-unknown-any-never',
      type: 'flash',
      front: 'unknown vs any vs never: what does each mean and what is the canonical use of each?',
      back: 'any: opts out of checking in both directions; a migration escape hatch, not a design tool.\nunknown: the type-safe top type; anything is assignable to it, but you must narrow before using it. Canonical: catch-clause errors, JSON.parse results, untrusted input.\nnever: the bottom type with no values at all. Canonical: exhaustiveness checks (assign the leftover case to never) and functions that always throw.',
    },
    {
      id: 'tst-union-access',
      type: 'mcq',
      prompt: 'const x: Cat | Dog. Before any narrowing, which members can you access on x?',
      choices: [
        'Only members that exist on every type in the union',
        'All members of both Cat and Dog',
        'None until you cast x to one of them',
        'The members of whichever type is listed first',
      ],
      answer: 0,
      explanation:
        'A union means "one of these, unknown which", so only the shared surface is safe. Intersection (Cat & Dog) is the opposite: a single value carrying the members of both types.',
    },
    {
      id: 'tst-as-const',
      type: 'mcq',
      prompt: "What does `as const` change about `const config = { retries: 3, mode: 'fast' } as const`?",
      choices: [
        "Every property becomes readonly and keeps its literal type (3, 'fast') instead of widening",
        'The object becomes immutable at runtime, like Object.freeze',
        'The object is converted to a const enum',
        'Nothing: const declarations already prevent widening inside objects',
      ],
      answer: 0,
      explanation:
        'Without it, mode widens to string and properties stay writable to the checker. It is compile-time only: runtime freezing still needs Object.freeze. Common trick: a literal array as const, then typeof arr[number] to derive a union.',
    },
    {
      id: 'tst-discriminated-union',
      type: 'mcq',
      prompt: 'Model fetch state so that `data` is only reachable when the request succeeded. The right tool?',
      choices: [
        'A discriminated union: one variant per state, each with a literal status tag',
        'One interface with optional loading, data, and error fields',
        'An enum for the status plus a class with nullable fields',
        'A boolean isLoading flag next to data: T | null',
      ],
      answer: 0,
      explanation:
        'The single-interface version permits impossible states (loading with data, success without it). Switching on a literal tag narrows to exactly one variant, so data exists if and only if status is "success". This is THE TypeScript pattern for state modeling.',
    },
    {
      id: 'tst-narrowing',
      type: 'flash',
      front: 'Name the built-in narrowing guards and when each one applies.',
      back: '1) typeof x === "string": primitives only; typeof of any object is just "object".\n2) x instanceof Foo: class instances, via the prototype chain.\n3) "prop" in x: narrows plain object unions by property presence.\n4) Discriminant equality: x.kind === "circle" narrows a tagged union to one variant.\n5) Truthiness: removes null/undefined, but also drops 0 and empty string, a classic bug with numeric or string unions.',
    },
    {
      id: 'tst-type-guard',
      type: 'fill',
      prompt: 'Complete the user-defined type guard signature:',
      code: "function isFish(pet: Cat | Fish): pet ____ Fish {\n  return 'swim' in pet;\n}",
      answers: ['is'],
      distractors: ['as', 'instanceof', 'extends', ':'],
      explanation:
        'The `pet is Fish` return type is a type predicate: when the call returns true, the caller\'s pet narrows to Fish. The compiler trusts the predicate blindly, so a wrong implementation lies to the type system without any error.',
    },
    {
      id: 'tst-generics-why',
      type: 'flash',
      front: 'Why is Array<T> better than any[], and what do extends constraints and default type params add?',
      back: 'Generics preserve the relationship between types: first(arr: T[]): T returns the element type, while any[] returns any and all checking stops at the call site.\nConstraints: <T extends { id: string }> lets the body use t.id while still returning the caller\'s exact T, not the widened constraint.\nDefaults: <T = string> makes the parameter optional at use sites.\nSmell test: a type parameter that appears only once in a signature is usually unnecessary.',
    },
    {
      id: 'tst-keyof-indexed',
      type: 'mcq',
      prompt: 'function get<T, K extends keyof T>(obj: T, key: K): T[K]. What does this signature guarantee?',
      choices: [
        'key must be a real property name of obj, and the return type is that property\'s exact type',
        'key can be any string, and the return type is any',
        'It only works when T is an interface, not a type alias',
        'obj must be assignable to Record<string, unknown>',
      ],
      answer: 0,
      explanation:
        'keyof T is the union of T\'s property names, so typo keys fail at the call site. T[K] is an indexed access type: the property lookup you do on values, performed on types.',
    },
    {
      id: 'tst-utility-omit',
      type: 'mcq',
      prompt: 'You need User without its password field for an API response type. Which utility?',
      choices: [
        "Omit<User, 'password'>",
        "Pick<User, 'password'>",
        'Partial<User>',
        "Exclude<User, 'password'>",
      ],
      answer: 0,
      explanation:
        'Pick keeps only the listed keys (the inverse of Omit). Exclude filters union members, not object keys, a frequent mix-up. The rest of the core set: Partial (all optional), Required (its reverse), Record<K, V> (keyed map), ReturnType<typeof fn> (extract a return type without retyping it).',
    },
    {
      id: 'tst-optional-vs-undefined',
      type: 'tf',
      prompt: 'In an object type, `name?: string` and `name: string | undefined` are interchangeable.',
      answer: false,
      explanation:
        'Optional (?) means the key may be absent entirely; the union form requires the key to be present even when its value is undefined. They behave differently for "name" in obj, Object.keys, and spread merges, and the exactOptionalPropertyTypes flag makes the checker enforce the distinction.',
    },
    {
      id: 'tst-strict-null',
      type: 'mcq',
      prompt: 'What does strictNullChecks actually change?',
      choices: [
        'null and undefined stop being assignable to every type; you must model and narrow them explicitly',
        'The compiler throws runtime errors when a value is null',
        'The null type is banned from the codebase',
        'All object properties become required',
      ],
      answer: 0,
      explanation:
        'Without it, string silently admits null and the checker misses the most common JS crash. Its partner flag noImplicitAny stops unannotated parameters from becoming any. "strict": true enables the whole family; new projects should never run without it.',
    },
    {
      id: 'tst-enum-vs-union',
      type: 'mcq',
      prompt: "enum Status { Active = 'active' } vs type Status = 'active' | 'inactive'. Why do unions usually win?",
      choices: [
        'Unions are erased at compile time, need no import at use sites, and match plain strings structurally',
        'Enums cannot be used in switch statements',
        'Unions are faster than enums at runtime',
        'Enums cannot hold string values',
      ],
      answer: 0,
      explanation:
        'An enum emits a runtime object and behaves nominally: a raw "active" from JSON is not assignable to the enum without conversion, while the union accepts it directly at zero cost. Enums still earn their keep when you want a closed set whose member names can be renamed independently of their values.',
    },
    {
      id: 'tst-satisfies',
      type: 'fill',
      prompt: 'Check the object against Config without widening its inferred type:',
      code: "const config = {\n  port: 3000,\n  env: 'dev',\n} ____ Config;",
      answers: ['satisfies'],
      distractors: ['as', 'is', 'implements', 'extends'],
      explanation:
        'satisfies validates against Config but keeps the narrow inferred type (env stays "dev", not string). An annotation (: Config) widens to the declared type; `as` does not even validate. Reach for satisfies when you want checking plus precise inference.',
    },
    {
      id: 'tst-erasure',
      type: 'tf',
      prompt: 'Annotating a fetch result as User makes TypeScript verify the response shape at runtime.',
      answer: false,
      explanation:
        'All types are erased during compilation; nothing is checked at runtime. An annotation on external data is an unchecked assertion. Validate untrusted input with a runtime validator (zod, valibot, or hand-written guards) and derive the static type from that schema.',
    },
    {
      id: 'tst-du-steps',
      type: 'order',
      prompt: 'Order the steps to model request state as a discriminated union.',
      items: [
        'Define one type per state with a literal tag field',
        'Union the variants into a single State type',
        'switch on the tag to narrow each branch',
        'Access variant-only fields inside their own case',
        'Assign the default case to never for exhaustiveness',
      ],
      explanation:
        'The never assignment turns a forgotten case into a compile error: add a new variant and every non-exhaustive switch fails to build instead of failing in production.',
    },
    {
      id: 'tst-assignability-ladder',
      type: 'order',
      prompt: 'Arrange from most specific (assignable upward) to most general.',
      items: [
        'never',
        "the literal type 'GET'",
        'string',
        'string | number',
        'unknown',
      ],
      explanation:
        'Assignability flows toward the more general type: never fits anywhere, and everything fits into unknown. any sits outside this ladder, assignable in both directions, which is exactly why it is unsafe.',
    },
  ],
};
