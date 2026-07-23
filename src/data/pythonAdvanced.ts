import type { Deck } from '../types';

export const pythonAdvanced: Deck = {
  id: 'py-advanced',
  title: 'Python Advanced',
  description: 'Generators, decorators, async, and the questions that separate seniors.',
  icon: '⚡',
  color: '#a855f7',
  track: 'Python',
  cards: [
    {
      id: 'pya-generator',
      type: 'flash',
      front: 'What is a generator, and why use one over returning a list?',
      back: 'A function with `yield` returns a lazy iterator that produces values on demand and keeps its local state between calls. It uses O(1) memory for arbitrarily long (even infinite) streams, instead of materializing the whole list.',
    },
    {
      id: 'pya-decorator',
      type: 'mcq',
      prompt: 'What is `@timer` above a function definition equivalent to?',
      code: '@timer\ndef work():\n    ...',
      choices: [
        'work = timer(work)',
        'work = work(timer)',
        'timer.register(work)',
        'work.__decorator__ = timer',
      ],
      answer: 0,
      explanation:
        'A decorator is just a callable applied to the function right after definition; the name is rebound to the result.',
    },
    {
      id: 'pya-genexp',
      type: 'fill',
      prompt: 'Sum of squares without building a list in memory:',
      code: 'total = sum(x * x ____ x in range(1_000_000))',
      answers: ['for'],
      distractors: ['if', 'while', 'in'],
      explanation:
        'A generator expression (no square brackets) feeds sum() lazily, one value at a time.',
    },
    {
      id: 'pya-gil',
      type: 'flash',
      front: 'What is the GIL and what does it mean for concurrency?',
      back: 'The Global Interpreter Lock lets only one thread execute Python bytecode at a time. Threads still help for I/O-bound work (the GIL is released while waiting), but CPU-bound parallelism needs multiprocessing or native extensions (NumPy releases the GIL too).',
    },
    {
      id: 'pya-gen-exhaust',
      type: 'mcq',
      prompt: 'What does the second `list(g)` return?',
      code: 'g = (i for i in range(3))\nprint(list(g))\nprint(list(g))',
      choices: [
        '[]; the generator is exhausted',
        '[0, 1, 2] again; list() restarts the generator from the top',
        '[3, 4, 5]; the generator keeps counting where it left off',
        'RuntimeError',
      ],
      answer: 0,
      explanation:
        'Generators are single-use iterators. Once consumed, they raise StopIteration immediately.',
    },
    {
      id: 'pya-dataclass',
      type: 'mcq',
      prompt: 'What does the `@dataclass` decorator generate for you?',
      choices: [
        '__init__, __repr__, and __eq__',
        'Only __init__; repr and equality still fall back to the object defaults',
        'Database table mappings',
        'JSON serialization methods (__json__ plus a from_json constructor)',
      ],
      answer: 0,
      explanation:
        'dataclasses generate boilerplate from the class annotations; frozen=True adds immutability and __hash__.',
    },
    {
      id: 'pya-ctxmanager',
      type: 'fill',
      prompt: 'The two methods a class needs to work in a `with` block:',
      code: 'class Resource:\n    def __enter__(self): ...\n    def ____(self, exc_type, exc, tb): ...',
      answers: ['__exit__'],
      distractors: ['__close__', '__del__', '__leave__'],
      explanation:
        '__exit__ receives exception info (or Nones) and can suppress the exception by returning True.',
    },
    {
      id: 'pya-slots',
      type: 'flash',
      front: 'What does `__slots__` do?',
      back: 'It replaces the per-instance `__dict__` with fixed storage for the named attributes: less memory, slightly faster attribute access, and typos like `obj.nmae = 1` raise AttributeError instead of silently creating a new attribute.',
    },
    {
      id: 'pya-walrus',
      type: 'mcq',
      prompt: 'What does the walrus operator `:=` do?',
      code: 'while (chunk := f.read(8192)):\n    process(chunk)',
      choices: [
        'Assigns and returns the value inside an expression',
        'Compares by identity, like the is operator, but usable inside expressions',
        'Declares a constant',
        'Creates a weak reference',
      ],
      answer: 0,
      explanation:
        'Assignment expressions let you bind a name where a value is used: here avoiding a separate read before the loop and inside it.',
    },
    {
      id: 'pya-optional',
      type: 'fill',
      prompt: 'Type-hint a function that returns an int or None:',
      code: 'def find_index(xs: list[int], target: int) -> ____[int]:',
      answers: ['Optional', 'typing.Optional'],
      distractors: ['Union', 'Maybe', 'Nullable'],
      explanation:
        'Optional[int] means int | None (the modern spelling `int | None` is equivalent since 3.10).',
    },
    {
      id: 'pya-async',
      type: 'flash',
      front: 'When does `async`/`await` actually help, and when does it not?',
      back: 'Async shines for I/O-bound concurrency: thousands of network calls multiplexed on one thread by the event loop. It does nothing for CPU-bound work (still one thread), and any blocking call inside a coroutine stalls the entire loop.',
    },
    {
      id: 'pya-lru',
      type: 'mcq',
      prompt: 'What does `@functools.lru_cache` do when applied to a function?',
      choices: [
        'Memoizes results keyed by the arguments',
        'Limits how often the function can be called',
        'Runs the function in a background thread',
        'Logs each call for debugging',
      ],
      answer: 0,
      explanation:
        'Repeated calls with the same (hashable) arguments return the cached result: the one-line answer to "how would you speed up this recursive Fibonacci?"',
    },
    {
      id: 'pya-mutable-default',
      type: 'mcq',
      prompt: 'What does the second call print?',
      code: 'def add(item, bucket=[]):\n    bucket.append(item)\n    return bucket\n\nadd(1)\nprint(add(2))',
      choices: [
        '[1, 2]; the default list is created once and shared across calls',
        '[2]; the default expression is re-evaluated on every call that omits the argument',
        '[]; defaults are reset after every call',
        'TypeError: mutable defaults are not allowed',
      ],
      answer: 0,
      explanation:
        'Default values are evaluated once, at function definition time, not per call. The idiom: default to None and create the list inside the body.',
    },
    {
      id: 'pya-is-interning',
      type: 'tf',
      prompt: 'In CPython, `a = 256; b = 256; a is b` is True, but the same test with 257 can be False.',
      answer: true,
      explanation:
        'CPython interns small ints (-5 to 256) and some strings, so equal values can share one object. That is an implementation detail: use == for value comparison and reserve `is` for identity, like `x is None`.',
    },
    {
      id: 'pya-wraps',
      type: 'mcq',
      prompt: 'Why put `@functools.wraps(fn)` on the wrapper inside a decorator?',
      choices: [
        "It copies fn's __name__, __doc__, and other metadata onto the wrapper",
        'It caches results of repeated calls',
        'It is required: a decorator whose wrapper lacks wraps raises TypeError at decoration time',
        'It prevents the decorator from being applied twice',
      ],
      answer: 0,
      explanation:
        'Without it, the decorated function reports the wrapper\'s name and docstring, breaking help(), debugging, and pickling. A decorator that takes arguments needs one more layer: a factory that receives the arguments and returns the real decorator.',
    },
    {
      id: 'pya-contextlib',
      type: 'fill',
      prompt: 'Write a context manager as a generator with contextlib:',
      code: '@contextmanager\ndef managed(path):\n    f = open(path)\n    try:\n        ____ f\n    finally:\n        f.close()',
      answers: ['yield'],
      distractors: ['return', 'await', 'raise'],
      explanation:
        'Code before the yield runs on __enter__, the yielded value binds to `as`, and the finally block runs on __exit__ even if the with-body raised.',
    },
    {
      id: 'pya-abc-protocol',
      type: 'flash',
      front: 'Abstract base classes vs typing.Protocol: when do you use each?',
      back: 'ABCs are nominal: implementers must inherit from the base, which enforces required methods at instantiation and can share default implementations.\nProtocols are structural: any class with matching methods satisfies the type, no inheritance needed, checked statically (or at runtime with @runtime_checkable).\nUse a Protocol to type third-party or duck-typed objects you cannot make inherit from you; use an ABC when you own the hierarchy and want shared behavior.',
    },
    {
      id: 'pya-property-descriptor',
      type: 'flash',
      front: 'How does @property work under the hood?',
      back: 'property is a descriptor: a class attribute whose __get__, __set__, and __delete__ methods intercept attribute access on instances. Reading obj.x finds the property object on the class and calls its __get__, which runs your getter. Bound methods, classmethod, staticmethod, and __slots__ all ride the same descriptor protocol.',
    },
    {
      id: 'pya-dataclass-vs',
      type: 'flash',
      front: 'When would you pick a dataclass vs a NamedTuple vs a TypedDict?',
      back: '1. dataclass: mutable by default, supports defaults, methods, frozen=True, __post_init__; the general-purpose record.\n2. NamedTuple: immutable, iterable and indexable like a tuple, lighter than a dataclass; good for small fixed records.\n3. TypedDict: no runtime class at all, it just type-checks the keys and value types of a plain dict; use for JSON-shaped data at API boundaries.',
    },
  ],
};
