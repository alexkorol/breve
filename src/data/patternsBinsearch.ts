import type { Deck } from '../types';

export const patternsBinsearch: Deck = {
  id: 'patterns-binsearch',
  title: 'Patterns: Binary Search',
  description: 'The template, the boundary bugs, and the disguised variants.',
  icon: '🎯',
  color: '#2dd4bf',
  track: 'Coding Interview',
  cards: [
    {
      id: 'bs-template',
      type: 'flash',
      front: 'Write the classic binary search template from memory — every character matters.',
      back: 'lo, hi = 0, len(a) - 1; while lo <= hi: mid = (lo + hi) // 2; if a[mid] == target: return mid; elif a[mid] < target: lo = mid + 1; else: hi = mid - 1; return -1. The three bug farms: <= vs < in the loop condition, mid ± 1 (never mid alone — infinite loop), and hi = len-1 vs len must match the condition style.',
    },
    {
      id: 'bs-mid-update',
      type: 'fill',
      prompt: 'The update that prevents the infinite loop:',
      code: 'if a[mid] < target:\n    lo = mid + ____',
      answers: ['1'],
      distractors: ['0', '2', 'mid'],
      explanation:
        'lo = mid (without +1) can loop forever when lo and mid coincide. Excluding mid is safe because you just examined it.',
    },
    {
      id: 'bs-leftmost',
      type: 'mcq',
      prompt: 'Array has duplicates; you need the LEFTMOST occurrence of target. What changes?',
      choices: [
        'On equality keep searching left: record mid, set hi = mid - 1',
        'Return the first mid that matches',
        'Scan linearly after any match',
        'Binary search cannot handle duplicates',
      ],
      answer: 0,
      explanation:
        'Lower-bound search: treat equality as "could be further left". In Python: bisect_left does exactly this — mention it, then code it manually anyway.',
    },
    {
      id: 'bs-bisect',
      type: 'fill',
      prompt: 'The stdlib insertion-point search:',
      code: 'from bisect import bisect_left\nidx = bisect_left(sorted_list, ____)',
      answers: ['target'],
      distractors: ['0', 'mid', 'key'],
      explanation:
        'Returns the leftmost index where target could insert keeping order — equals "count of elements < target". bisect_right counts <=; their difference counts occurrences.',
    },
    {
      id: 'bs-rotated',
      type: 'mcq',
      prompt: 'Search in a rotated sorted array ([4,5,6,7,0,1,2]) — the key insight?',
      choices: [
        'One half is always properly sorted — check which, and whether target lies in its range',
        'Un-rotate first in O(n), then search',
        'Rotated arrays need linear scan',
        'Use two independent binary searches always',
      ],
      answer: 0,
      explanation:
        'If a[lo] <= a[mid], the left half is sorted: target inside its range → go left, else right. Still O(log n), and a top-5 interview classic.',
    },
    {
      id: 'bs-first-true',
      type: 'flash',
      front: 'The "first true" abstraction — the mental model that unifies every binary search variant.',
      back: 'Picture a boolean array FFFF…TTTT (monotonic condition). Binary search finds the first T. Leftmost target = first "a[i] >= target". Koko’s eating speed = first "can finish at speed k". Rotated minimum = first "a[i] <= a[-1]". Reframe any problem as a monotonic predicate and the same template solves all of them.',
    },
    {
      id: 'bs-answer-space',
      type: 'mcq',
      prompt: '"Minimum ship capacity to deliver packages in D days" — where does binary search run?',
      choices: [
        'Over the ANSWER range (max package … total weight), with a feasibility check per guess',
        'Over the package array indices',
        'Over the days',
        'It is a DP problem, not binary search',
      ],
      answer: 0,
      explanation:
        'Binary search on the answer: feasibility is monotonic (if capacity c works, c+1 works). O(n log range). The tell: "minimize the maximum" or "maximize the minimum".',
    },
    {
      id: 'bs-overflow',
      type: 'mcq',
      prompt: 'Why do other languages write `mid = lo + (hi - lo) // 2`, and does Python care?',
      choices: [
        '(lo + hi) can overflow fixed-width ints; Python ints are arbitrary precision so it’s safe — but say why',
        'It rounds differently',
        'It is faster in Python',
        'Python requires that form',
      ],
      answer: 0,
      explanation:
        'Knowing the overflow story (a real historical JDK bug) plus "Python is immune" covers both bases in one sentence.',
    },
    {
      id: 'bs-sqrt',
      type: 'mcq',
      prompt: 'Integer square root of n without math.sqrt — approach?',
      choices: [
        'Binary search the answer in [0, n]: first k where k² > n, minus one',
        'Try every integer up to n',
        'Newton’s method is the only way',
        'Impossible without floats',
      ],
      answer: 0,
      explanation:
        'k² is monotonic — the "first true" frame again. A gentle warmup interviewers use to see if you reach for binary search unprompted.',
    },
    {
      id: 'bs-matrix',
      type: 'mcq',
      prompt: 'Search a sorted m×n matrix (each row sorted, rows in order) in O(log(mn))?',
      choices: [
        'Treat it as one flat sorted array: index i maps to matrix[i // n][i % n]',
        'Binary search each row: O(m log n) is optimal',
        'Start from the top-left corner',
        'Convert to a list first',
      ],
      answer: 0,
      explanation:
        'The divmod mapping makes the 2D structure vanish. (The staircase-from-corner trick solves the OTHER variant, where only rows/columns are sorted independently.)',
    },
    {
      id: 'bs-peak',
      type: 'mcq',
      prompt: 'Find a peak element (bigger than both neighbors) in O(log n) — how can that work on unsorted data?',
      choices: [
        'Walk toward the rising side: if a[mid] < a[mid+1], a peak must exist right of mid',
        'It cannot — unsorted needs O(n)',
        'Sort first',
        'Random probing',
      ],
      answer: 0,
      explanation:
        'Binary search needs monotonic STRUCTURE, not sorted data — the rising direction guarantees a peak exists that way.',
    },
    {
      id: 'bs-sorting-recap',
      type: 'flash',
      front: 'Sorting quick-fire: stable? in-place? when does each matter?',
      back: 'Stable = equal elements keep their order (merge sort, Timsort yes; heapsort, selection no; quicksort typically no). In-place = O(1)-ish extra space (quicksort, heapsort yes; merge sort needs O(n)). Python’s sorted() is Timsort: stable, O(n log n), O(n) on nearly-sorted runs. Stability matters when sorting by key₂ then key₁ to get a two-level sort.',
    },
    {
      id: 'bs-counting',
      type: 'mcq',
      prompt: 'When can you beat O(n log n) sorting?',
      choices: [
        'Small known value range — counting sort O(n + k), e.g. sorting letters or 0-100 scores',
        'Never; n log n is a hard limit for all sorting',
        'With a better pivot in quicksort',
        'By sorting in parallel threads',
      ],
      answer: 0,
      explanation:
        'The n log n bound applies to COMPARISON sorts. Counting/radix/bucket exploit value structure instead. "Sort colors" (Dutch flag) is the interview cameo.',
    },
  ],
};
