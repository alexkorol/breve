import type { Deck } from '../types';

export const jsFundamentals: Deck = {
  id: 'js-fundamentals',
  title: 'JavaScript Fundamentals',
  description: 'The core-language questions every JS interview opens with.',
  icon: '🟨',
  color: '#facc15',
  track: 'JavaScript & TypeScript',
  cards: [
    {
      id: 'jsf-var-let-const',
      type: 'flash',
      front: 'The var vs let vs const question: what are the actual differences an interviewer wants to hear?',
      back: 'Scope: var is function-scoped, let and const are block-scoped.\nHoisting: all three hoist, but var initializes to undefined while let and const stay uninitialized in the temporal dead zone, so reading them early throws a ReferenceError.\nReassignment: const forbids reassigning the binding, not mutation (const arr = [] still allows arr.push).\nDefault choice: const, then let when reassignment is needed; var only appears in legacy code.',
    },
    {
      id: 'jsf-tdz',
      type: 'mcq',
      prompt: 'What does this print?',
      code: 'console.log(x);\nlet x = 1;',
      choices: [
        'Throws a ReferenceError: x is in the temporal dead zone',
        'undefined',
        '1',
        'null',
      ],
      answer: 0,
      explanation:
        'let hoists but stays uninitialized until its declaration line runs. With var instead, it would log undefined: the follow-up interviewers use to check you know both behaviors.',
    },
    {
      id: 'jsf-eq-coercion',
      type: 'flash',
      front: 'Explain == vs ===: what does each compare, and which coercion rules are worth knowing cold?',
      back: '=== compares without conversion: different types are never equal, and NaN !== NaN. == coerces first.\nRules worth knowing: 1) null == undefined is true, and neither == anything else. 2) String vs number: the string converts to a number, so "5" == 5. 3) Booleans convert to numbers first, so true == 1 but true != "true". 4) Object vs primitive: the object converts via valueOf/toString.\nDefault to ===, and reserve == for the single idiom x == null (catches null and undefined together).',
    },
    {
      id: 'jsf-falsy-list',
      type: 'mcq',
      prompt: 'Which of these values is truthy?',
      choices: ['"0" (a non-empty string)', '0', '""', 'NaN'],
      answer: 0,
      explanation:
        'The complete falsy list is exactly eight values: false, 0, -0, 0n, "" (empty string), null, undefined, NaN. Everything else is truthy, including "0", "false", [], and {}. The empty array being truthy is the classic trap.',
    },
    {
      id: 'jsf-reference-eq',
      type: 'mcq',
      prompt: 'What does [1, 2] === [1, 2] evaluate to?',
      choices: [
        'false: two different objects, and === compares references',
        'true: same contents',
        'true: === deep-compares arrays',
        'It throws: arrays cannot be compared',
      ],
      answer: 0,
      explanation:
        'Primitives compare by value; objects, arrays, and functions compare by identity, and two literals are two allocations. To compare contents you write your own check or serialize deliberately.',
    },
    {
      id: 'jsf-closure-loop',
      type: 'flash',
      front: 'What is a closure? Explain it with the classic loop that prints 3, 3, 3.',
      back: 'A closure is a function bundled with the scope it was created in: it keeps live access to those variables after the outer function returns.\nThe classic: for (var i = 0; i < 3; i++) setTimeout(() => console.log(i)) prints 3, 3, 3 because all three callbacks close over the SAME function-scoped i, and the loop has finished by the time they run.\nFixes: let gives each iteration a fresh block-scoped i, or pass i into an IIFE. The one-liner: closures capture variables, not values.',
    },
    {
      id: 'jsf-this-rules',
      type: 'flash',
      front: 'How is `this` determined when a function is called?',
      back: 'Four rules, decided at call time, not definition time:\n1) new Foo(): this is the freshly created object.\n2) Explicit: fn.call(obj) and fn.apply(obj) set this to obj for one call; fn.bind(obj) returns a copy locked to obj.\n3) Implicit: obj.method() sets this to whatever is left of the dot.\n4) Default: globalThis, or undefined in strict mode.\nArrow functions ignore all four: they capture this lexically from the enclosing scope. Losing implicit binding (const f = obj.method; f()) is the bug interviewers probe most.',
    },
    {
      id: 'jsf-this-precedence',
      type: 'order',
      prompt: 'Order the `this` binding rules from highest precedence to lowest.',
      items: [
        'new binding: new Foo()',
        'Explicit binding: call, apply, bind',
        'Implicit binding: obj.method()',
        'Default binding: globalThis, or undefined in strict mode',
      ],
      explanation:
        'When rules compete, new beats bind, bind beats the call-site object, and the default is the fallback. Arrow functions sit outside the list entirely: they inherit this lexically.',
    },
    {
      id: 'jsf-arrow-this',
      type: 'tf',
      prompt: 'An arrow function\'s `this` is determined by how it is called, and can be changed with .call() or .bind().',
      answer: false,
      explanation:
        'Arrow functions have no own this: they capture it from the enclosing scope at definition time, and call/apply/bind cannot override it. That is why arrows work as callbacks inside methods but fail as object methods and constructors.',
    },
    {
      id: 'jsf-prototype-chain',
      type: 'flash',
      front: 'Explain prototypal inheritance in one clear mental model.',
      back: 'Objects link to objects. Every object carries a hidden [[Prototype]] reference; reading a property missing on the object walks up that chain until it is found or the chain ends at null. Nothing is copied: "inheritance" is delegated lookup at read time. class syntax is sugar over the same mechanism: methods live once on Foo.prototype, and instances created by new link to it.',
    },
    {
      id: 'jsf-proto-lookup',
      type: 'order',
      prompt: 'Order the steps when you read obj.name and it is not an own property.',
      items: [
        'Check obj\'s own properties: miss',
        'Follow obj\'s [[Prototype]] link and check there',
        'Repeat up the chain, link by link',
        'Reach Object.prototype, the usual last stop',
        'Hit null: return undefined',
      ],
      explanation:
        'Reads walk the chain; writes do not. Assigning obj.name creates an own property that shadows the prototype\'s version.',
    },
    {
      id: 'jsf-mutating-methods',
      type: 'mcq',
      prompt: 'Which array method mutates the array it is called on?',
      choices: ['sort()', 'toSorted()', 'map()', 'slice()'],
      answer: 0,
      explanation:
        'sort, reverse, splice, push, pop, shift, and unshift mutate in place (sort even returns the same mutated array). map, filter, reduce, slice, concat, and the newer toSorted/toReversed/toSpliced return new arrays. Mutating an array passed in as a prop or argument is the bug class this question screens for.',
    },
    {
      id: 'jsf-fill-reduce',
      type: 'fill',
      prompt: 'Sum an array into a single number:',
      code: 'const total = nums.____((sum, n) => sum + n, 0);',
      answers: ['reduce'],
      distractors: ['map', 'forEach', 'filter', 'flat'],
      explanation:
        'reduce folds the array into one accumulated value; the 0 is the initial accumulator. The trio to narrate in interviews: map transforms one-to-one, filter selects, reduce combines.',
    },
    {
      id: 'jsf-spread-shallow',
      type: 'tf',
      prompt: 'const copy = { ...original } produces a fully independent deep copy of original.',
      answer: false,
      explanation:
        'Spread copies one level: nested objects and arrays are shared references, so copy.settings.theme = "dark" also changes original. For a real deep copy use structuredClone(original); the old JSON.parse(JSON.stringify(x)) trick drops undefined and functions and turns Dates into strings.',
    },
    {
      id: 'jsf-destructure-default',
      type: 'mcq',
      prompt: 'What does this log?',
      code: 'const { timeout = 500 } = { timeout: 0 };\nconsole.log(timeout);',
      choices: [
        '0: defaults only apply when the value is undefined',
        '500',
        'undefined',
        'It throws a TypeError',
      ],
      answer: 0,
      explanation:
        'Destructuring defaults trigger on undefined only; 0, null, and "" are real values, and null does NOT trigger the default either. The same rule governs function parameter defaults. Rest works here too: const { a, ...others } collects the remaining properties.',
    },
    {
      id: 'jsf-template-literals',
      type: 'flash',
      front: 'What do template literals give you over quoted strings and concatenation?',
      back: 'Backtick strings with three features: 1) interpolation: ${expr} embeds any expression, not just variable names; 2) real multiline strings without escape-and-concatenate; 3) tagged templates, where a function receives the string parts and values separately (how styled-components and SQL escapers work). Interpolation stringifies values, so ${obj} yields "[object Object]" unless the object defines its own conversion.',
    },
    {
      id: 'jsf-fill-nullish',
      type: 'fill',
      prompt: 'Fall back to "anonymous" only when the name is missing, keeping "" as a valid name:',
      code: 'const name = user?.profile?.name ____ \'anonymous\';',
      answers: ['??'],
      distractors: ['||', '&&', '?:'],
      explanation:
        '?? falls back only on null or undefined; || also falls back on "", 0, and false. The optional chain user?.profile?.name short-circuits to undefined instead of throwing when user or profile is nullish, and ?? then supplies the default. Use || only when every falsy value should trigger the fallback.',
    },
    {
      id: 'jsf-json-stringify',
      type: 'mcq',
      prompt: 'What does this return?',
      code: 'JSON.stringify({ a: undefined, b: () => 1,\n  c: new Date(0), d: NaN })',
      choices: [
        '\'{"c":"1970-01-01T00:00:00.000Z","d":null}\': undefined and functions are dropped, Dates become ISO strings, NaN becomes null',
        '\'{"a":null,"b":null,"c":{},"d":null}\'',
        'It throws a TypeError on the function',
        '\'{"c":"1970-01-01T00:00:00.000Z"}\': NaN is dropped too',
      ],
      answer: 0,
      explanation:
        'In objects, undefined, functions, and symbols are omitted entirely; in arrays they become null. NaN and Infinity serialize as null. Dates survive as ISO strings because Date defines toJSON, but they come back from JSON.parse as plain strings. The case that actually throws is a circular reference.',
    },
  ],
};
