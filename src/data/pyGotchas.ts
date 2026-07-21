import type { Deck } from '../types';

export const pyGotchas: Deck = {
  id: 'py-gotchas',
  title: 'Gotchas & Debugging',
  description: 'The traps interviewers plant and the bugs that eat afternoons.',
  icon: '🪤',
  color: '#fb923c',
  track: 'Python',
  cards: [
    {
      id: 'gt-late-binding',
      type: 'mcq',
      prompt: 'What does this print?',
      code: 'funcs = [lambda: i for i in range(3)]\nprint([f() for f in funcs])',
      choices: ['[2, 2, 2]', '[0, 1, 2]', '[0, 0, 0]', 'NameError'],
      answer: 0,
      explanation:
        'Closures capture the VARIABLE, not its value — all three lambdas see the final i. Fix: lambda i=i: i (default arg binds at definition time).',
    },
    {
      id: 'gt-mutable-mult',
      type: 'mcq',
      prompt: 'Why is `grid = [[0] * 3] * 3` broken?',
      choices: [
        'All three rows are the SAME list — writing grid[0][0] changes every row',
        'It creates a 9-element flat list',
        'Multiplication of lists is not allowed',
        'It works fine',
      ],
      answer: 0,
      explanation:
        'Outer * copies references, not lists. Correct: [[0] * 3 for _ in range(3)] — the inner lists are fresh per iteration. ([0]*3 alone is fine: ints are immutable.)',
    },
    {
      id: 'gt-is-small-ints',
      type: 'mcq',
      prompt: 'Why does `a is b` return True for `a = b = 256` but often False for 257?',
      choices: [
        'CPython caches small ints (-5..256) as singletons; larger ones may be distinct objects',
        '257 overflows the int type',
        'is compares values above 256',
        'It is random',
      ],
      answer: 0,
      explanation:
        'An implementation detail that exists purely to punish people who use `is` for value comparison. Use == for values; is for None.',
    },
    {
      id: 'gt-chained-comparison',
      type: 'mcq',
      prompt: 'What does `1 < 3 > 2` evaluate to?',
      choices: ['True — chained comparisons: (1 < 3) and (3 > 2)', 'False', 'SyntaxError', '2'],
      answer: 0,
      explanation:
        'Python chains comparisons: a < b < c means (a < b) and (b < c) with b evaluated once. Elegant when intended, bewildering when accidental.',
    },
    {
      id: 'gt-default-none',
      type: 'fill',
      prompt: 'The safe pattern replacing a mutable default argument:',
      code: 'def add(item, acc=None):\n    if acc is ____:\n        acc = []\n    acc.append(item)\n    return acc',
      answers: ['None'],
      distractors: ['[]', 'Empty', 'False'],
      explanation:
        'Sentinel None + create inside — the standard fix for the shared-default-list gotcha.',
    },
    {
      id: 'gt-copy-slice',
      type: 'mcq',
      prompt: 'You pass a list to a function that sorts it. The caller’s list is now sorted too. Why?',
      choices: [
        'Lists pass by reference — the function mutated the caller’s object; sort a copy (sorted(x) or x[:]) instead',
        'Python copies lists on function calls',
        'sort() returns a new list',
        'It is a scoping bug in Python',
      ],
      answer: 0,
      explanation:
        '"Pass by object reference": the parameter is another name for the same list. Mutation travels; rebinding does not. This distinction is a top-5 interview probe.',
    },
    {
      id: 'gt-iterate-mutate',
      type: 'mcq',
      prompt: 'What is wrong with `for x in nums: if x < 0: nums.remove(x)`?',
      choices: [
        'Mutating a list while iterating skips elements — filter into a new list instead',
        'remove() is O(1) so nothing',
        'Negative numbers cannot be removed',
        'It raises RuntimeError always',
      ],
      answer: 0,
      explanation:
        'The iterator’s index marches on while elements shift left — adjacent negatives survive. Idiom: nums = [x for x in nums if x >= 0]. (Dicts DO raise RuntimeError for this; lists fail silently.)',
    },
    {
      id: 'gt-try-except-pass',
      type: 'mcq',
      prompt: 'Why is `except Exception: pass` a code-review red flag?',
      choices: [
        'It swallows every error silently — bugs vanish instead of surfacing; catch specific exceptions and at least log',
        'It is a syntax error in Python 3.12',
        'pass is slower than continue',
        'Exceptions cannot be caught broadly',
      ],
      answer: 0,
      explanation:
        'Also catches KeyboardInterrupt-adjacent problems, typos (NameError!), and real failures. The narrow-except principle: catch what you can handle, let the rest crash loudly.',
    },
    {
      id: 'gt-float-eq',
      type: 'mcq',
      prompt: 'Why is `0.1 + 0.2 == 0.3` False?',
      choices: [
        'Binary floats can’t represent 0.1 exactly — compare with math.isclose() or a tolerance',
        'Python rounds incorrectly',
        'The == operator is broken for floats',
        'It is True',
      ],
      answer: 0,
      explanation:
        '0.1+0.2 is 0.30000000000000004. Money → decimal.Decimal; tests → pytest.approx; general → math.isclose. Never == floats.',
    },
    {
      id: 'gt-scope-loop',
      type: 'mcq',
      prompt: 'After `for i in range(3): pass`, what is `i`?',
      choices: [
        '2 — loop variables leak into the enclosing scope',
        'NameError — loops have their own scope',
        '3',
        'None',
      ],
      answer: 0,
      explanation:
        'Unlike most languages, for-loops don’t create a scope in Python (comprehensions do!). The leaked variable enables bugs when reused accidentally.',
    },
    {
      id: 'gt-str-int-concat',
      type: 'fill',
      prompt: 'Fix the classic TypeError:',
      code: 'age = 30\nmsg = "age: " + ____(age)',
      answers: ['str'],
      distractors: ['int', 'repr', 'format'],
      explanation:
        'Python never implicitly coerces str + int. Better yet: f"age: {age}" and the problem disappears.',
    },
    {
      id: 'gt-shadow-builtin',
      type: 'mcq',
      prompt: 'After `list = [1, 2, 3]`, calling `list("abc")` fails. Why?',
      choices: [
        'You shadowed the built-in list with your variable — rename the variable',
        'Strings can no longer be converted',
        'list() only accepts numbers',
        'A restart always fixes it permanently',
      ],
      answer: 0,
      explanation:
        'list, dict, str, sum, id, type — shadowing builtins works until the moment you need the builtin. Linters flag it; interviews plant it.',
    },
    {
      id: 'gt-pdb',
      type: 'fill',
      prompt: 'Drop into the debugger at this exact line (3.7+ builtin):',
      code: 'def process(data):\n    ____()\n    ...',
      answers: ['breakpoint'],
      distractors: ['debug', 'pdb', 'trace'],
      explanation:
        'breakpoint() starts pdb: n=next, s=step into, c=continue, p expr=print, l=list source. Saying "I’d set a breakpoint and inspect" beats "I’d add prints" in interviews.',
    },
    {
      id: 'gt-exception-order',
      type: 'mcq',
      prompt: 'Why is the ValueError branch unreachable?',
      code: 'try:\n    parse(x)\nexcept Exception:\n    handle_generic()\nexcept ValueError:\n    handle_value()',
      choices: [
        'except clauses match top-down — the broad Exception catches everything first; order narrow → broad',
        'ValueError is not an Exception subclass',
        'Only one except is allowed',
        'It is reachable',
      ],
      answer: 0,
      explanation:
        'First matching clause wins. Specific exceptions go first, the broad safety net (if any) last.',
    },
    {
      id: 'gt-name-main',
      type: 'fill',
      prompt: 'Run only when executed directly, not when imported:',
      code: 'if __name__ == "____":\n    main()',
      answers: ['__main__'],
      distractors: ['main', '__init__', '__file__'],
      explanation:
        'On import, __name__ is the module name; only direct execution sets it to "__main__". Missing this guard is why importing someone’s script launches their whole program.',
    },
    {
      id: 'gt-walrus-scope',
      type: 'mcq',
      prompt: 'What does `print(x)` show?',
      code: 'data = [1, 2, 3]\nif (n := len(data)) > 2:\n    x = n * 10\nprint(x)',
      choices: ['30', 'NameError', 'None', '3'],
      answer: 0,
      explanation:
        'n binds in the enclosing scope (walrus has no private scope), the condition passes, x = 30. If the condition failed, print(x) would NameError — conditional assignment leaves gaps.',
    },
    {
      id: 'gt-return-in-loop',
      type: 'mcq',
      prompt: 'What is wrong with this primality check?',
      code: 'for i in range(2, int(n ** 0.5) + 1):\n    if n % i == 0:\n        return False\n    return True',
      choices: [
        'return True sits inside the loop — it answers after testing only the FIRST divisor; dedent it below the loop',
        'The range bound is off by one',
        'return False should come after the loop',
        'Nothing — it works',
      ],
      answer: 0,
      explanation:
        'Early return False on any divisor is correct; return True must wait until EVERY candidate divisor has been checked, so it belongs after the loop at function level. Indentation IS control flow in Python.',
    },
  ],
};
