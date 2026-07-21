import type { Deck } from '../types';

export const pyOopTesting: Deck = {
  id: 'py-oop-testing',
  title: 'OOP & Testing',
  description: 'Classes, dunders, and pytest — the "is your code professional?" round.',
  icon: '🏗️',
  color: '#c084fc',
  track: 'Python',
  cards: [
    {
      id: 'oop-init-self',
      type: 'fill',
      prompt: 'The constructor and the instance reference:',
      code: 'class Stack:\n    def __init__(____):\n        ____.items = []',
      answers: ['self'],
      distractors: ['this', 'cls', 'obj'],
      explanation:
        'self is just the conventional name for the instance passed as the first argument — Python makes the passing explicit rather than implicit.',
    },
    {
      id: 'oop-class-vs-instance',
      type: 'mcq',
      prompt: 'What is the bug?',
      code: 'class Dog:\n    tricks = []\n    def learn(self, t):\n        self.tricks.append(t)',
      choices: [
        'tricks is a class attribute — ALL dogs share one list; assign self.tricks = [] in __init__',
        'learn() needs @staticmethod',
        'Lists cannot be class attributes',
        'No bug',
      ],
      answer: 0,
      explanation:
        'Class-level mutables are shared state, same disease as mutable default args. Immutable class attributes (counters, constants) are fine.',
    },
    {
      id: 'oop-repr',
      type: 'mcq',
      prompt: '`__repr__` vs `__str__`?',
      choices: [
        '__repr__ is the unambiguous developer view (debugger, containers); __str__ the friendly print view; define __repr__ at minimum',
        '__str__ is called by lists when printing them',
        'They must always be identical',
        '__repr__ only exists on dataclasses',
      ],
      answer: 0,
      explanation:
        'print falls back to __repr__ when __str__ is missing — but not vice versa. A good __repr__ looks like the constructor call: Point(x=1, y=2).',
    },
    {
      id: 'oop-super',
      type: 'fill',
      prompt: 'Extend the parent constructor, don’t replace it:',
      code: 'class Robot(Agent):\n    def __init__(self, name):\n        ____().__init__(name)\n        self.battery = 100',
      answers: ['super'],
      distractors: ['parent', 'base', 'Agent'],
      explanation:
        'super() follows the MRO, which matters under multiple inheritance. Hardcoding Agent.__init__ works until the hierarchy changes.',
    },
    {
      id: 'oop-classmethod',
      type: 'mcq',
      prompt: '@staticmethod vs @classmethod?',
      choices: [
        'staticmethod gets no implicit argument; classmethod gets cls — the idiom for alternate constructors like from_json()',
        'classmethod is faster',
        'staticmethod can only be private',
        'They are interchangeable',
      ],
      answer: 0,
      explanation:
        'Dict.from_json(s) returning cls(**data) respects subclassing — the go-to example when asked "when would you use a classmethod?"',
    },
    {
      id: 'oop-property',
      type: 'mcq',
      prompt: 'What does @property buy you?',
      code: 'class Circle:\n    @property\n    def area(self):\n        return 3.14159 * self.r ** 2',
      choices: [
        'Computed attribute access — c.area without parentheses, no API break if it later becomes stored',
        'It caches the result automatically',
        'It makes the attribute private',
        'It enables multiple inheritance',
      ],
      answer: 0,
      explanation:
        'Start with a plain attribute, switch to @property when logic appears — callers never change. Add @area.setter for validated assignment. (functools.cached_property does cache.)',
    },
    {
      id: 'oop-dunder-eq',
      type: 'mcq',
      prompt: 'Two Point(1, 2) instances compare unequal. Why, and the fix?',
      choices: [
        'Default __eq__ is identity — implement __eq__ (and __hash__), or use @dataclass which generates them',
        'Points can never be equal',
        'You must override __cmp__',
        'Use is instead of ==',
      ],
      answer: 0,
      explanation:
        'Objects defining __eq__ without __hash__ become unhashable — no sets or dict keys. dataclass(frozen=True) gives you both, correctly.',
    },
    {
      id: 'oop-abc',
      type: 'mcq',
      prompt: 'How do you force subclasses to implement a method?',
      choices: [
        'Inherit from ABC and mark it @abstractmethod — instantiation fails until it’s implemented',
        'raise NotImplementedError is compile-time enforced',
        'Name it with a leading underscore',
        'Python cannot express this',
      ],
      answer: 0,
      explanation:
        'ABC fails fast at instantiation; the raise-NotImplementedError pattern only fails when the method is finally called. Interviews love the difference.',
    },
    {
      id: 'oop-duck',
      type: 'flash',
      front: 'Duck typing and EAFP — the Pythonic philosophy answer.',
      back: 'Duck typing: code against behavior, not types — anything with .read() is file-like. EAFP ("easier to ask forgiveness than permission"): try the operation and catch the exception, rather than pre-checking (LBYL). Both trade compile-time guarantees for flexibility; type hints + mypy add the guarantees back where they matter.',
    },
    {
      id: 'test-pytest-basic',
      type: 'fill',
      prompt: 'The simplest pytest test:',
      code: 'def test_merge():\n    ____ merge([[1,5],[3,7]]) == [[1,7]]',
      answers: ['assert'],
      distractors: ['expect', 'check', 'verify'],
      explanation:
        'pytest rewrites plain asserts to show both sides on failure — no assertEquals boilerplate. Files test_*.py, functions test_* are auto-discovered.',
    },
    {
      id: 'test-raises',
      type: 'fill',
      prompt: 'Assert that bad input raises:',
      code: 'def test_negative():\n    with pytest.____(ValueError):\n        set_age(-1)',
      answers: ['raises'],
      distractors: ['throws', 'expects', 'catch'],
      explanation:
        'The with-block passes only if the exception fires inside it. Add match="age" to also assert the message.',
    },
    {
      id: 'test-fixture',
      type: 'mcq',
      prompt: 'What is a pytest fixture?',
      choices: [
        'A named setup function; tests receive its return value by declaring the name as a parameter',
        'A hardcoded test data file',
        'A class every test must inherit',
        'A mock object',
      ],
      answer: 0,
      explanation:
        '@pytest.fixture def db(): yield connect() — yield enables teardown after the test. Scope="session" shares expensive setup across tests.',
    },
    {
      id: 'test-parametrize',
      type: 'mcq',
      prompt: 'Run one test body over many input/expected pairs?',
      choices: [
        '@pytest.mark.parametrize("raw,expected", [("a,b", 2), ("", 0)])',
        'Copy-paste the test per case',
        'A for-loop of asserts inside one test',
        'pytest cannot do this',
      ],
      answer: 0,
      explanation:
        'Each case reports as its own test — a loop of asserts stops at the first failure and hides the rest. This is the pytest feature interviewers fish for.',
    },
    {
      id: 'test-mock',
      type: 'mcq',
      prompt: 'Testing code that calls a paid LLM API — the standard approach?',
      choices: [
        'monkeypatch/mock the client call to return a canned response; assert your handling logic',
        'Call the real API in every test run',
        'Skip testing that code path',
        'Lower the temperature to 0 so it’s deterministic',
      ],
      answer: 0,
      explanation:
        'Unit tests isolate YOUR logic from the network: fast, free, deterministic. Keep one thin integration test hitting the real API, run sparingly.',
    },
  ],
};
