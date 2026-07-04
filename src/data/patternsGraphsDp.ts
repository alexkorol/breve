import type { Deck } from '../types';

export const patternsGraphsDp: Deck = {
  id: 'patterns-graphs-dp',
  title: 'Patterns: Trees, Graphs & DP',
  description: 'Traversals, topological sort, and how to recognize a DP problem.',
  icon: '🌳',
  color: '#84cc16',
  track: 'Coding Interview',
  cards: [
    {
      id: 'gd-level-order',
      type: 'flash',
      front: 'Level-order tree traversal — which algorithm, and what is the template?',
      back: 'BFS with a queue: push the root; while the queue is non-empty, snapshot its length (that’s one level), pop that many nodes, collect values, push their children. The per-level snapshot is what turns plain BFS into "level by level".',
    },
    {
      id: 'gd-inorder',
      type: 'mcq',
      prompt: 'In-order traversal of a binary search tree visits nodes in…',
      choices: [
        'Sorted ascending order',
        'Insertion order',
        'Level order',
        'Random order',
      ],
      answer: 0,
      explanation:
        'Left–node–right on a BST yields sorted output. Interviews lean on this constantly: "validate a BST" and "kth smallest element" are both in-order in disguise.',
    },
    {
      id: 'gd-depth',
      type: 'fill',
      prompt: 'Max depth of a binary tree — the classic recursion:',
      code: 'def depth(node):\n    if not node:\n        return 0\n    return 1 + max(depth(node.left), depth(node.____))',
      answers: ['right'],
      distractors: ['left', 'next', 'parent'],
      explanation:
        'Most tree problems are this shape: base case on None, recurse both sides, combine. Practice saying "recurse left, recurse right, combine" as your opener.',
    },
    {
      id: 'gd-cycle',
      type: 'mcq',
      prompt: 'Detecting a cycle in a *directed* graph — the standard approach?',
      choices: [
        'DFS tracking the current recursion stack (three colors)',
        'Count the edges: a cycle exists if edges ≥ nodes',
        'BFS from every node',
        'Sort the adjacency list',
      ],
      answer: 0,
      explanation:
        'White/gray/black: hitting a gray node (still on the recursion stack) means a back edge — a cycle. Merely revisiting a finished (black) node is fine in directed graphs; that distinction is the interview point.',
    },
    {
      id: 'gd-toposort',
      type: 'flash',
      front: 'Topological sort — when do you need it and what are the two algorithms?',
      back: 'Any "order tasks with prerequisites" problem (course schedule, build order) on a DAG. Kahn’s: repeatedly take nodes with in-degree 0 off a queue, decrementing neighbors — if you can’t process all nodes, there’s a cycle. Or DFS: order by reverse finishing time. Both O(V+E).',
    },
    {
      id: 'gd-islands',
      type: 'mcq',
      prompt: '"Number of islands" in an m×n grid — time complexity of the flood-fill solution?',
      choices: ['O(m·n)', 'O(m·n·log(m·n))', 'O(m²·n²)', 'O(4^(m·n))'],
      answer: 0,
      explanation:
        'Each cell is visited a constant number of times: once by the scan, once by a flood fill (DFS/BFS) that marks it. Grid problems are graph problems — neighbors are the 4 directions.',
    },
    {
      id: 'gd-spot-dp',
      type: 'flash',
      front: 'How do you *recognize* a dynamic programming problem in the wild?',
      back: 'Two properties: overlapping subproblems and optimal substructure. Phrasing tells: "count the ways…", "minimum/maximum cost to reach…", "can you make/partition…", "longest subsequence…". If your brute force is a recursion tree that recomputes the same states, that recursion IS the DP — add a cache.',
    },
    {
      id: 'gd-fib-dp',
      type: 'fill',
      prompt: 'Bottom-up DP, the simplest case:',
      code: 'dp = [0, 1]\nfor i in range(2, n + 1):\n    dp.append(dp[i - 1] + dp[i - ____])',
      answers: ['2'],
      distractors: ['1', 'i', 'n'],
      explanation:
        'Each state depends on the two before it — and since only two are needed, you can drop the array for O(1) space. Mention that optimization unprompted.',
    },
    {
      id: 'gd-stairs',
      type: 'mcq',
      prompt: '"Climbing stairs: 1 or 2 steps at a time, how many ways to reach step n?" is secretly…',
      choices: [
        'Fibonacci — ways(n) = ways(n−1) + ways(n−2)',
        'Binary search',
        'A greedy problem',
        'Quicksort partitioning',
      ],
      answer: 0,
      explanation:
        'The last move came from step n−1 or n−2, so add those counts. Recognizing a problem as a relabeled classic is the highest-leverage interview skill there is.',
    },
    {
      id: 'gd-memo-decorator',
      type: 'fill',
      prompt: 'Turn a plain recursion into top-down DP with one line:',
      code: 'from functools import lru_cache\n\n@____\ndef ways(n):\n    ...',
      answers: ['lru_cache', 'lru_cache()'],
      distractors: ['cache_all', 'memoize', 'staticmethod'],
      explanation:
        'Write the natural recursion, slap on the cache, and the exponential tree collapses to one call per distinct state. (Python 3.9+ also has @functools.cache.)',
    },
    {
      id: 'gd-backtracking',
      type: 'flash',
      front: 'Backtracking — what is it really, and which problems scream for it?',
      back: 'DFS over partial solutions: choose → recurse → un-choose. The undo step is what makes it backtracking. Screams: permutations, subsets, combination sum, N-queens, sudoku, word search. Complexity is exponential by nature — say so upfront, then prune.',
    },
    {
      id: 'gd-bsearch-answer',
      type: 'flash',
      front: 'The "binary search on the answer" pattern — when does it apply?',
      back: 'When you can’t compute the optimum directly but can CHECK a guess quickly, and feasibility is monotonic ("if speed k works, k+1 works"). Binary search the smallest feasible value: Koko eating bananas, ship packages within D days, split array to minimize largest sum. Search space is the answer range, not the array.',
    },
  ],
};
