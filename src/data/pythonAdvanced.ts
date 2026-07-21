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
      choices: ['[]; the generator is exhausted', '[0, 1, 2] again', '[3, 4, 5]', 'RuntimeError'],
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
        'Only __init__',
        'Database table mappings',
        'JSON serialization methods',
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
        'Compares by identity',
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
  ],
};
