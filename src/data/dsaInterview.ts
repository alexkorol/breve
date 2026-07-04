import type { Deck } from '../types';

export const dsaInterview: Deck = {
  id: 'dsa-interview',
  title: 'DS&A Interview',
  description: 'Big-O, data structures, and the patterns behind LeetCode.',
  icon: '📊',
  color: '#f59e0b',
  track: 'Coding Interview',
  cards: [
    {
      id: 'dsa-binsearch',
      type: 'mcq',
      prompt: 'Time complexity of binary search on a sorted array?',
      choices: ['O(log n)', 'O(n)', 'O(n log n)', 'O(1)'],
      answer: 0,
      explanation: 'Each comparison halves the search space: log₂(n) steps worst case.',
    },
    {
      id: 'dsa-hashmap',
      type: 'mcq',
      prompt: 'Average-case lookup in a hash map?',
      choices: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      answer: 0,
      explanation:
        'Hashing jumps straight to the bucket. Worst case degrades to O(n) with pathological collisions — worth mentioning in interviews.',
    },
    {
      id: 'dsa-heap',
      type: 'flash',
      front: 'When do you reach for a heap, and what are its key complexities?',
      back: 'Whenever you repeatedly need the min/max of a changing collection: top-k elements, merge k sorted lists, Dijkstra, median-of-stream. Peek O(1), push and pop O(log n), build-heap O(n). In Python: heapq (min-heap; negate values for a max-heap).',
    },
    {
      id: 'dsa-stack',
      type: 'mcq',
      prompt: 'Which data structure gives LIFO (last in, first out) behavior?',
      choices: ['Stack', 'Queue', 'Heap', 'Linked list'],
      answer: 0,
      explanation:
        'Stacks power undo, DFS, call frames, and matched-brackets problems. Queues are FIFO — BFS territory.',
    },
    {
      id: 'dsa-twopointer',
      type: 'fill',
      prompt: 'Set up two pointers at the ends of a sequence:',
      code: 'left, right = 0, ____(s) - 1\nwhile left < right:\n    ...',
      answers: ['len'],
      distractors: ['size', 'count', 'range'],
      explanation:
        'The two-pointer pattern: palindrome checks, pair-sum in sorted arrays, container-with-most-water.',
    },
    {
      id: 'dsa-bfs-dfs',
      type: 'flash',
      front: 'BFS vs DFS — when do you pick each?',
      back: 'BFS (queue) explores level by level: shortest path in unweighted graphs, "minimum steps" problems. DFS (stack/recursion) dives deep: connectivity, cycle detection, topological sort, backtracking. Both are O(V + E).',
    },
    {
      id: 'dsa-quicksort',
      type: 'mcq',
      prompt: 'Average-case time complexity of quicksort?',
      choices: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
      answer: 0,
      explanation:
        'Average O(n log n); worst case O(n²) on adversarial pivots (already-sorted input with naive pivot choice). Randomized pivots make the worst case vanishingly unlikely.',
    },
    {
      id: 'dsa-ll-insert',
      type: 'mcq',
      prompt: 'Inserting at the front of each structure costs…',
      choices: [
        'Linked list O(1), array O(n)',
        'Linked list O(n), array O(1)',
        'Both O(1)',
        'Both O(n)',
      ],
      answer: 0,
      explanation:
        'A linked list just rewires the head pointer; an array must shift every element right. The mirror tradeoff: arrays index in O(1), lists in O(n).',
    },
    {
      id: 'dsa-sliding',
      type: 'flash',
      front: 'What is the sliding window pattern, and what problem phrasing hints at it?',
      back: 'Maintain a window [left, right] over a sequence, expanding right and shrinking left while tracking state — O(n) instead of O(n²) for nested loops. Hints: "longest/shortest substring/subarray that…", "maximum sum of k consecutive…".',
    },
    {
      id: 'dsa-swap',
      type: 'fill',
      prompt: 'Swap two variables the Pythonic way:',
      code: 'a, b = ____, a',
      answers: ['b'],
      distractors: ['a', 'temp', 'swap'],
      explanation: 'Tuple packing/unpacking — no temp variable needed.',
    },
    {
      id: 'dsa-stable',
      type: 'mcq',
      prompt: 'Which sorting algorithm is stable (preserves the order of equal elements)?',
      choices: ['Merge sort', 'Heapsort', 'Quicksort (in-place)', 'Selection sort'],
      answer: 0,
      explanation:
        "Merge sort is stable and O(n log n) guaranteed — which is why Python's sorted() uses Timsort, a merge-sort hybrid.",
    },
    {
      id: 'dsa-memo',
      type: 'flash',
      front: 'Memoization vs tabulation in dynamic programming?',
      back: 'Memoization: top-down recursion with a cache — write the natural recurrence, cache results (@lru_cache). Tabulation: bottom-up, fill a table from base cases — no recursion depth limits and often lets you drop to O(1) space by keeping only the last row.',
    },
  ],
};
