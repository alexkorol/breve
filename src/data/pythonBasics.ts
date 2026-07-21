import type { Deck } from '../types';

export const pythonBasics: Deck = {
  id: 'py-basics',
  title: 'Python Fundamentals',
  description: 'Core syntax, data types, and idioms every interview assumes.',
  icon: '🐍',
  color: '#3b82f6',
  track: 'Python',
  cards: [
    {
      id: 'pyb-list-str',
      type: 'mcq',
      prompt: 'What does `list("abc")` return?',
      choices: ["['a', 'b', 'c']", "['abc']", "('a', 'b', 'c')", 'TypeError'],
      answer: 0,
      explanation:
        'list() consumes any iterable. A string iterates character by character, so each character becomes an element.',
    },
    {
      id: 'pyb-comprehension',
      type: 'fill',
      prompt: 'Complete the comprehension so it keeps only even numbers:',
      code: 'squares = [x**2 for x in range(10) if x % 2 == ____]',
      answers: ['0'],
      distractors: ['1', '2', 'True'],
      explanation: 'x % 2 == 0 is true for even numbers.',
    },
    {
      id: 'pyb-mutable',
      type: 'mcq',
      prompt: 'Which of these types is mutable?',
      choices: ['list', 'tuple', 'str', 'frozenset'],
      answer: 0,
      explanation:
        'Lists can be modified in place. Tuples, strings, and frozensets are immutable: "changing" them creates new objects.',
    },
    {
      id: 'pyb-is-vs-eq',
      type: 'flash',
      front: 'What is the difference between `is` and `==`?',
      back: '`is` compares identity: whether two names point to the same object in memory. `==` compares values. Rule of thumb: use `is` only for singletons like `None` (`if x is None`).',
    },
    {
      id: 'pyb-default-arg',
      type: 'mcq',
      prompt: 'What does this print?',
      code: 'def add(item, acc=[]):\n    acc.append(item)\n    return acc\n\nprint(add(1))\nprint(add(2))',
      choices: ['[1] then [1, 2]', '[1] then [2]', '[1, 2] then [1, 2]', 'TypeError'],
      answer: 0,
      explanation:
        'Default arguments are evaluated once at function definition. The same list is shared across calls: a classic interview gotcha. Use acc=None and create the list inside.',
    },
    {
      id: 'pyb-dict-get',
      type: 'fill',
      prompt: 'Read a key with a fallback of 0 (no KeyError):',
      code: 'count = counts.____(word, 0) + 1',
      answers: ['get'],
      distractors: ['fetch', 'find', 'pop'],
      explanation: 'dict.get(key, default) returns the default when the key is missing.',
    },
    {
      id: 'pyb-args-kwargs',
      type: 'flash',
      front: 'What do `*args` and `**kwargs` do in a function signature?',
      back: '`*args` collects extra positional arguments into a tuple; `**kwargs` collects extra keyword arguments into a dict. On the calling side, `*` and `**` unpack sequences and dicts into arguments.',
    },
    {
      id: 'pyb-slice-reverse',
      type: 'mcq',
      prompt: 'What does `"python"[::-1]` evaluate to?',
      choices: ["'nohtyp'", "'python'", "'p'", 'IndexError'],
      answer: 0,
      explanation: 'A slice with step -1 walks the sequence backwards: the idiomatic string reverse.',
    },
    {
      id: 'pyb-with',
      type: 'fill',
      prompt: 'Open a file so it is closed automatically, even on errors:',
      code: '____ open("data.txt") as f:\n    text = f.read()',
      answers: ['with'],
      distractors: ['try', 'using', 'as'],
      explanation: 'The with statement drives the context manager protocol: __exit__ closes the file.',
    },
    {
      id: 'pyb-range-step',
      type: 'mcq',
      prompt: 'What does `list(range(1, 10, 2))` return?',
      choices: ['[1, 3, 5, 7, 9]', '[1, 3, 5, 7, 9, 11]', '[2, 4, 6, 8]', '[1, 2, 3, ..., 10]'],
      answer: 0,
      explanation: 'range(start, stop, step) excludes stop: 1, 3, 5, 7, 9.',
    },
    {
      id: 'pyb-tf-tuple',
      type: 'tf',
      prompt: 'A tuple can be used as a dictionary key.',
      answer: true,
      explanation:
        'Tuples are immutable and hashable (as long as their contents are), so they work as keys: lists don’t.',
    },
    {
      id: 'pyb-tf-strconcat',
      type: 'tf',
      prompt: '`sorted(my_list)` modifies my_list in place.',
      answer: false,
      explanation:
        'sorted() returns a NEW list and works on any iterable; my_list.sort() is the in-place version (and returns None).',
    },
    {
      id: 'pyb-copy',
      type: 'flash',
      front: 'Shallow copy vs deep copy: what is the difference?',
      back: 'A shallow copy (`list(x)`, `x[:]`, `copy.copy`) duplicates the outer container but shares nested objects. `copy.deepcopy` recursively duplicates everything. Mutating a nested list through a shallow copy affects the original.',
    },
    {
      id: 'pyb-enumerate',
      type: 'mcq',
      prompt: 'What does `enumerate(["a", "b"])` yield?',
      choices: ['(0, "a"), (1, "b")', '("a", 0), ("b", 1)', '(1, "a"), (2, "b")', '"a", "b"'],
      answer: 0,
      explanation:
        'enumerate yields (index, value) pairs starting at 0 (or a custom start: enumerate(x, 1)).',
    },
    {
      id: 'pyb-lambda',
      type: 'fill',
      prompt: 'Sort a list of (name, score) pairs by score:',
      code: 'pairs.sort(key=____ p: p[1])',
      answers: ['lambda'],
      distractors: ['def', 'func', 'fn'],
      explanation: 'lambda creates a small anonymous function: the standard sort key idiom.',
    },
    {
      id: 'pyb-finally',
      type: 'mcq',
      prompt: 'In a try/except/else/finally statement, which block always runs?',
      choices: ['finally', 'else', 'except', 'none of them is guaranteed'],
      answer: 0,
      explanation:
        'finally runs whether or not an exception occurred, even if the try block returns. else runs only when no exception was raised.',
    },
    {
      id: 'pyb-lcm-fold',
      type: 'fill',
      prompt: 'Fold an LCM across numbers (smallest value divisible by all of 1..20):',
      code: 'import math\nresult = 1\nfor n in range(1, 21):\n    result = (result * n) // math.____(result, n)',
      answers: ['gcd'],
      distractors: ['lcm', 'sqrt', 'floor'],
      explanation:
        'lcm(a, b) = a * b // gcd(a, b): dividing by the gcd removes the factors a and b already share. Initialize result BEFORE the loop or it resets to 1 every iteration. (Euler 5.)',
    },
    {
      id: 'pyb-sqrt-power',
      type: 'fill',
      prompt: 'Square root without importing math: the trial-division bound in a primality check:',
      code: 'for i in range(2, int(n ** ____) + 1):\n    if n % i == 0:\n        return False',
      answers: ['0.5'],
      distractors: ['2', '0.25', '-1'],
      explanation:
        'n ** 0.5 == math.sqrt(n): any composite has a factor at or below its square root. The + 1 matters because range excludes its stop: without it a perfect-square factor never gets tested.',
    },
  ],
};
