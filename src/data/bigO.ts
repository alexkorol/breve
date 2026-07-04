import type { Deck } from '../types';

export const bigO: Deck = {
  id: 'big-o',
  title: 'Big-O & Complexity',
  description: 'Read complexity off code at a glance — and say it before being asked.',
  icon: '📈',
  color: '#facc15',
  track: 'Coding Interview',
  cards: [
    {
      id: 'bo-definition',
      type: 'flash',
      front: 'What does Big-O actually describe — the one-sentence version plus the two rules?',
      back: 'The growth rate of work as input size grows, ignoring constants and lower-order terms. Rules: drop constants (O(2n) → O(n)) and keep only the dominant term (O(n² + n) → O(n²)). It bounds scaling behavior, not wall-clock speed — an O(n) pass over 10 items can lose to O(n²) on 3.',
    },
    {
      id: 'bo-nested-loops',
      type: 'mcq',
      prompt: 'Complexity of two nested loops over the same n-element list?',
      choices: ['O(n²)', 'O(2n)', 'O(n log n)', 'O(n)'],
      answer: 0,
      explanation:
        'n iterations × n iterations. But nested loops over DIFFERENT collections are O(n·m) — collapsing them to n² is a common sloppy answer.',
    },
    {
      id: 'bo-sequential',
      type: 'mcq',
      prompt: 'A loop over n items, THEN another separate loop over n items?',
      choices: ['O(n) — sequential work adds: O(n + n) = O(2n) = O(n)', 'O(n²)', 'O(n log n)', 'O(2ⁿ)'],
      answer: 0,
      explanation:
        'Sequential = add, nested = multiply. Mixing these up is the most common Big-O error in live interviews.',
    },
    {
      id: 'bo-halving',
      type: 'mcq',
      prompt: 'A loop that halves the problem each iteration (while n > 1: n //= 2)?',
      choices: ['O(log n)', 'O(n/2)', 'O(√n)', 'O(1)'],
      answer: 0,
      explanation:
        'Halving until 1 takes log₂(n) steps. Pattern-match: halving → log n, and "sort then scan" → n log n.',
    },
    {
      id: 'bo-in-list-set',
      type: 'mcq',
      prompt: '`x in my_list` vs `x in my_set`?',
      choices: [
        'O(n) for the list scan, O(1) average for the set hash lookup',
        'Both O(1)',
        'Both O(n)',
        'O(log n) for both',
      ],
      answer: 0,
      explanation:
        'The single most impactful micro-decision in interview code: membership checks inside a loop turn O(n) into O(n²) with a list, stay O(n) with a set.',
    },
    {
      id: 'bo-list-ops',
      type: 'mcq',
      prompt: 'Which Python list operation is O(n), not O(1)?',
      choices: [
        'list.insert(0, x) — everything shifts right',
        'list.append(x)',
        'list[i] indexing',
        'list.pop() from the end',
      ],
      answer: 0,
      explanation:
        'Front insertion/removal shifts the whole array; append/pop at the tail are amortized O(1). Need cheap ends? collections.deque gives O(1) at both.',
    },
    {
      id: 'bo-sort-cost',
      type: 'fill',
      prompt: 'State the sort cost unprompted:',
      code: '# "First I sort — that is O(n ____ n) —\n#  then a linear merge pass, O(n)."',
      answers: ['log'],
      distractors: ['*', '+', '^'],
      explanation:
        'Timsort is O(n log n) worst case (O(n) on nearly-sorted data). Announcing the cost as you use it is free interview credit.',
    },
    {
      id: 'bo-space',
      type: 'mcq',
      prompt: 'Space complexity of `seen = set()` filled while scanning n items?',
      choices: [
        'O(n) — up to every element stored',
        'O(1) — sets are constant size',
        'O(log n)',
        'O(n²)',
      ],
      answer: 0,
      explanation:
        'Always state space alongside time. The classic tradeoff sentence: "O(n) extra space buys the time down from O(n²) to O(n)."',
    },
    {
      id: 'bo-recursion-tree',
      type: 'mcq',
      prompt: 'Naive recursive fib(n) — two recursive calls, no cache?',
      choices: ['O(2ⁿ)', 'O(n²)', 'O(n log n)', 'O(n)'],
      answer: 0,
      explanation:
        'Each call spawns two: a binary tree of depth n. Memoize → one call per distinct state → O(n). That before/after is the whole DP sales pitch.',
    },
    {
      id: 'bo-amortized',
      type: 'flash',
      front: 'Why is list.append O(1) "amortized" when resizing copies the array?',
      back: 'The array over-allocates by a growth factor; occasional O(n) copies happen so rarely that total cost over n appends is O(n) — O(1) per append averaged. Same logic behind dict/set resizing and why hash inserts stay O(1) average. "Amortized" = expensive events diluted across many cheap ones.',
    },
    {
      id: 'bo-hash-worst',
      type: 'mcq',
      prompt: 'Hash map lookup: average O(1), but worst case?',
      choices: [
        'O(n) — pathological collisions chain every key in one bucket',
        'O(log n) always',
        'O(1) unconditionally',
        'O(n log n)',
      ],
      answer: 0,
      explanation:
        'Saying "average O(1), worst O(n) under adversarial collisions" is the difference between memorized and understood.',
    },
    {
      id: 'bo-string-concat',
      type: 'mcq',
      prompt: 'Building an n-char string via `s += ch` in a loop?',
      choices: [
        'O(n²) — each += copies the whole prefix; join a list for O(n)',
        'O(n) — strings append in place',
        'O(n log n)',
        'O(1) per operation always',
      ],
      answer: 0,
      explanation:
        'Immutable strings copy on every concat: 1+2+…+n ≈ n²/2. The list-and-join idiom is the fix — and a great unprompted remark.',
    },
    {
      id: 'bo-graph',
      type: 'fill',
      prompt: 'BFS/DFS complexity on a graph:',
      code: 'time = O(V + ____)',
      answers: ['E'],
      distractors: ['V', 'N', 'V*E'],
      explanation:
        'Each vertex dequeued once, each edge examined once. For grids: V = rows·cols, E ≈ 4V, so O(rows·cols).',
    },
    {
      id: 'bo-say-it',
      type: 'flash',
      front: 'The interview script for complexity — when and how do you bring it up?',
      back: 'Three moments: 1) Before coding — "brute force is O(n²); I think sorting gets us O(n log n), let me try that." 2) While coding — flag costs as you incur them ("this set makes lookups O(1)"). 3) After — "time O(n log n) from the sort, space O(n) for the merged list." Never wait to be asked; volunteering it is the seniority signal.',
    },
  ],
};
