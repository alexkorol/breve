import type { Deck } from '../types';

export const jsGotchas: Deck = {
  id: 'js-gotchas',
  title: 'JS Gotchas & Trick Questions',
  description: 'The "what does this print" traps, and the reasoning that defuses them.',
  icon: '🪤',
  color: '#fb7185',
  track: 'JavaScript & TypeScript',
  cards: [
    {
      id: 'jsg-float-equal',
      type: 'mcq',
      prompt: 'What does this print?',
      code: 'console.log(0.1 + 0.2 === 0.3);\nconsole.log(0.1 + 0.2);',
      choices: [
        'false, then 0.30000000000000004',
        'true, then 0.3',
        'false, then 0.3 (console.log rounds)',
        'true, then 0.30000000000000004',
      ],
      answer: 0,
      explanation:
        'Neither 0.1 nor 0.2 has an exact binary (IEEE 754 double) representation, and the rounding errors survive the addition. This is a property of binary floating point, not of JavaScript: Python and Java print the same sum.',
    },
    {
      id: 'jsg-float-fix',
      type: 'fill',
      prompt: 'Complete the standard tolerance check for float equality:',
      code: 'const close = Math.abs(a - b) < Number.____;',
      answers: ['EPSILON'],
      distractors: ['MIN_VALUE', 'MAX_SAFE_INTEGER', 'MIN_SAFE_INTEGER', 'NaN'],
      explanation:
        'Number.EPSILON is the gap between 1 and the next representable double, a sane tolerance for values near 1. The other fixes: do money math in integer units (cents, not dollars), or round only for display with toFixed. toFixed returns a string, which is its own trap.',
    },
    {
      id: 'jsg-typeof-null',
      type: 'mcq',
      prompt: 'What does `typeof null` evaluate to?',
      choices: ["'object'", "'null'", "'undefined'", 'It throws a TypeError'],
      answer: 0,
      explanation:
        'A bug from the original 1995 engine: values carried type tags, and null shared the object tag (0). A spec fix was rejected because it would break existing sites. Check for null with x === null, never with typeof.',
    },
    {
      id: 'jsg-nan',
      type: 'flash',
      front: 'Why is NaN !== NaN, and what is the right way to test for it?',
      back: 'IEEE 754 defines NaN as unequal to everything, including itself, so a failed computation can never accidentally equal a real value.\nRight: Number.isNaN(x), which does no coercion.\nWrong: global isNaN(x), which coerces first, so isNaN(\'hello\') is true.\nAlso valid: Object.is(x, NaN), and x !== x as the classic pre-ES6 idiom.',
    },
    {
      id: 'jsg-empty-plus',
      type: 'mcq',
      prompt: 'What does `[] + []` evaluate to?',
      choices: [
        "'' (an empty string)",
        '[] (an empty array)',
        '0',
        'It throws a TypeError',
      ],
      answer: 0,
      explanation:
        "+ converts both operands to primitives, and arrays stringify via join, giving '', so the result is '' + '' = ''. Same rule makes [] + {} produce '[object Object]'. But {} + [] at the start of a statement is 0: the braces parse as an empty block, leaving unary +[], which is +'' = 0.",
    },
    {
      id: 'jsg-plus-minus',
      type: 'mcq',
      prompt: "What do `'5' + 3` and `'5' - 3` evaluate to?",
      choices: ["'53' and 2", '8 and 2', "'53' and NaN", "8 and '2'"],
      answer: 0,
      explanation:
        '+ is overloaded: if either operand is a string, it concatenates. - has no string meaning, so both operands are coerced to numbers. The asymmetry is the trap: + prefers strings, every other arithmetic operator prefers numbers.',
    },
    {
      id: 'jsg-array-holes',
      type: 'mcq',
      prompt: 'What does this print?',
      code: "console.log(Array(3).map(() => 'x'));",
      choices: [
        '[ <3 empty items> ]: three holes, untouched',
        "['x', 'x', 'x']: map visits every index up to length",
        '[undefined, undefined, undefined]: holes read as undefined, so map passes them through',
        'It throws a RangeError',
      ],
      answer: 0,
      explanation:
        'Array(3) creates length 3 with no elements: holes, not undefineds. map, forEach, and filter skip holes entirely because the indices were never assigned. Array.of(3) instead makes [3]. To get a real mappable array, use Array.from({ length: 3 }) or Array(3).fill().',
    },
    {
      id: 'jsg-sort-lexi',
      type: 'mcq',
      prompt: 'What does `[10, 1, 2].sort()` return?',
      choices: ['[1, 10, 2]', '[1, 2, 10]', '[10, 2, 1]', '[2, 10, 1]'],
      answer: 0,
      explanation:
        "The default comparator converts elements to strings and compares UTF-16 code units, so '10' sorts before '2'. Always pass a comparator for numbers: sort((a, b) => a - b). It also sorts in place and returns the same array; use toSorted() for a copy.",
    },
    {
      id: 'jsg-map-parseint',
      type: 'mcq',
      prompt: 'What does this print?',
      code: "console.log(['1', '2', '3'].map(parseInt));",
      choices: ['[1, NaN, NaN]', '[1, 2, 3]', '[NaN, NaN, NaN]', '[1, 2, NaN]'],
      answer: 0,
      explanation:
        "map passes (value, index, array) and parseInt takes (string, radix), so it runs:\n1. parseInt('1', 0) → 1 (radix 0 means auto-detect)\n2. parseInt('2', 1) → NaN (base 1 is invalid)\n3. parseInt('3', 2) → NaN (3 is not a binary digit)\nFix: .map(Number) or .map(s => parseInt(s, 10)). An explicit radix also guards the legacy quirk where parseInt('08') parsed as octal and returned 0.",
    },
    {
      id: 'jsg-var-timeout',
      type: 'order',
      prompt: 'This loop prints 3, 3, 3. Arrange what happens, in order.',
      code: 'for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i));\n}',
      items: [
        'Loop runs to completion; the single var i ends at 3',
        'Timer callbacks wait until the call stack is empty',
        'The event loop runs the three queued callbacks',
        'Each callback reads the same shared i and logs 3',
      ],
      explanation:
        'var is function-scoped, so all three closures capture one binding. let creates a fresh binding per loop iteration, so the same code with let prints 0, 1, 2.',
    },
    {
      id: 'jsg-iife',
      type: 'flash',
      front: 'What is an IIFE, and why was it everywhere before ES modules?',
      back: 'An Immediately Invoked Function Expression: (function () { ... })(), defined and called in one shot. Pre-ES6, the only way to create a new scope was a function, so IIFEs gave scripts private variables and kept the global namespace clean (the module pattern). Block scope with let/const and real modules made them mostly obsolete; the shape survives as the async wrapper (async () => { ... })().',
    },
    {
      id: 'jsg-hoisting',
      type: 'flash',
      front: 'Which can you call before its definition: a function declaration or a function expression? And what error does each failure throw?',
      back: 'Declaration: callable early. function f() {} is hoisted whole, body included.\nvar expression: var f = function () {} hoists only the binding as undefined, so an early call throws TypeError: f is not a function.\nlet/const expression: the temporal dead zone throws ReferenceError instead.\nInterviewers often probe by asking which error each case produces.',
    },
    {
      id: 'jsg-delete-hole',
      type: 'tf',
      prompt: 'After `delete arr[1]`, the array is shorter and later elements shift left.',
      answer: false,
      explanation:
        'delete removes the property but leaves a hole: length is unchanged, nothing shifts, and iteration methods like map now skip that index. To actually remove an element, use arr.splice(1, 1).',
    },
    {
      id: 'jsg-asi-return',
      type: 'order',
      prompt: 'This function returns undefined. Arrange what the parser does, in order.',
      code: 'function make() {\n  return\n  { ok: true };\n}',
      items: [
        'The parser reaches return followed by a line break',
        'ASI inserts a semicolon: the statement becomes return;',
        'The braces parse as an unreachable block, not an object',
        'The call returns undefined',
      ],
      explanation:
        'Automatic semicolon insertion ends the statement at a newline after return (also break, continue, and throw). Keep the opening brace or parenthesis on the same line as return.',
    },
    {
      id: 'jsg-eq-null',
      type: 'tf',
      prompt: '`x == null` is true exactly when x is null or undefined, and for no other value.',
      answer: true,
      explanation:
        "The loose-equality table makes null and undefined equal only to each other: 0, '', false, and NaN all fail the check. That makes == null a deliberate one-shot test for both empty values, and it is the one use of == many style guides still allow.",
    },
    {
      id: 'jsg-object-is',
      type: 'flash',
      front: 'How does Object.is differ from ===?',
      back: 'Identical except for two edge cases:\n1. Object.is(NaN, NaN) is true; NaN === NaN is false.\n2. Object.is(0, -0) is false; 0 === -0 is true (IEEE 754 keeps a signed zero).\nArray.prototype.includes uses the related SameValueZero rule: NaN matches, but -0 and 0 count as equal. indexOf uses === and can never find NaN.',
    },
    {
      id: 'jsg-string-immutable',
      type: 'tf',
      prompt: "Given `let s = 'cat'`, assigning `s[0] = 'b'` changes s to 'bat'.",
      answer: false,
      explanation:
        "Strings are immutable: the assignment fails silently in sloppy mode and throws a TypeError in strict mode, so s stays 'cat'. Every string method (slice, replace, toUpperCase) returns a new string. To edit by index: split to an array, change it, join back.",
    },
    {
      id: 'jsg-sloppy-globals',
      type: 'flash',
      front: 'What happens when you assign to a variable you never declared, and how does strict mode change it?',
      back: 'In sloppy mode the assignment walks the scope chain, finds nothing, and creates a property on the global object: a silent global, the classic way a typo "works" and corrupts state across functions. In strict mode (\'use strict\', or automatically inside modules and class bodies) the same assignment throws ReferenceError. Related: a plain function call binds this to the global object in sloppy mode, undefined in strict mode.',
    },
  ],
};
