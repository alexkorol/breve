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
      front: 'Level-order tree traversal, which algorithm, and what is the template?',
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
      prompt: 'Max depth of a binary tree: the classic recursion:',
      code: 'def depth(node):\n    if not node:\n        return 0\n    return 1 + max(depth(node.left), depth(node.____))',
      answers: ['right'],
      distractors: ['left', 'next', 'parent'],
      explanation:
        'Most tree problems are this shape: base case on None, recurse both sides, combine.',
    },
    {
      id: 'gd-cycle',
      type: 'mcq',
      prompt: 'Detecting a cycle in a *directed* graph: the standard approach?',
      choices: [
        'DFS tracking the current recursion stack (three colors)',
        'Count the edges: a cycle exists if edges ≥ nodes',
        'BFS from every node',
        'Sort the adjacency list',
      ],
      answer: 0,
      explanation:
        'White/gray/black: hitting a gray node (still on the recursion stack) means a back edge; a cycle. Merely revisiting a finished (black) node is fine in directed graphs; that distinction is the interview point.',
    },
    {
      id: 'gd-toposort',
      type: 'flash',
      front: 'Topological sort, when do you need it and what are the two algorithms?',
      back: 'Any "order tasks with prerequisites" problem (course schedule, build order) on a DAG. Kahn’s: repeatedly take nodes with in-degree 0 off a queue, decrementing neighbors; if you can’t process all nodes, there’s a cycle. Or DFS: order by reverse finishing time. Both O(V+E).',
    },
    {
      id: 'gd-islands',
      type: 'mcq',
      prompt: '"Number of islands" in an m×n grid: time complexity of the flood-fill solution?',
      choices: ['O(m·n)', 'O(m·n·log(m·n))', 'O(m²·n²)', 'O(4^(m·n))'],
      answer: 0,
      explanation:
        'Each cell is visited a constant number of times: once by the scan, once by a flood fill (DFS/BFS) that marks it. Grid problems are graph problems: neighbors are the 4 directions.',
    },
    {
      id: 'gd-spot-dp',
      type: 'flash',
      front: 'How do you *recognize* a dynamic programming problem in the wild?',
      back: 'Two properties: overlapping subproblems and optimal substructure. Phrasing tells: "count the ways…", "minimum/maximum cost to reach…", "can you make/partition…", "longest subsequence…". If your brute force is a recursion tree that recomputes the same states, that recursion IS the DP: add a cache.',
    },
    {
      id: 'gd-fib-dp',
      type: 'fill',
      prompt: 'Bottom-up DP, the simplest case:',
      code: 'dp = [0, 1]\nfor i in range(2, n + 1):\n    dp.append(dp[i - 1] + dp[i - ____])',
      answers: ['2'],
      distractors: ['1', 'i', 'n'],
      explanation:
        'Each state depends on the two before it, and since only two are needed, you can drop the array for O(1) space.',
    },
    {
      id: 'gd-stairs',
      type: 'mcq',
      prompt: '"Climbing stairs: 1 or 2 steps at a time, how many ways to reach step n?" is secretly…',
      choices: [
        'Fibonacci: ways(n) = ways(n−1) + ways(n−2)',
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
      front: 'Backtracking: what is it really, and which problems scream for it?',
      back: 'DFS over partial solutions: choose → recurse → un-choose. The undo step is what makes it backtracking. Screams: permutations, subsets, combination sum, N-queens, sudoku, word search. Complexity is exponential by nature: say so upfront, then prune.',
    },
    {
      id: 'gd-bsearch-answer',
      type: 'flash',
      front: 'The "binary search on the answer" pattern, when does it apply?',
      back: 'When you can’t compute the optimum directly but can CHECK a guess quickly, and feasibility is monotonic ("if speed k works, k+1 works"). Binary search the smallest feasible value: Koko eating bananas, ship packages within D days, split array to minimize largest sum. Search space is the answer range, not the array.',
    },
    {
      id: 'gd-bfs-vs-dfs',
      type: 'flash',
      front: 'BFS or DFS: how do you pick in an interview?',
      back: 'BFS when the problem says shortest path in an unweighted graph or "minimum number of steps" (word ladder, grid shortest path): the first time BFS reaches a node is via a fewest-edges path. DFS when you must explore or enumerate everything: connectivity, cycle detection, backtracking over candidate solutions. Both are O(V+E); the memory shapes differ (BFS holds a whole frontier, DFS holds one path).',
    },
    {
      id: 'gd-union-find',
      type: 'flash',
      front: 'Union-find (disjoint set): how does it work, and when do you reach for it instead of DFS?',
      back: 'Two arrays: parent and rank (or size). find() walks to the root and compresses the path; union() links roots by rank. Amortized near O(1) per operation (inverse Ackermann). It wins when edges arrive incrementally or connectivity is queried many times: components as edges stream in, redundant connection, accounts merge, cycle check inside Kruskal. For one-shot connectivity on a static graph, a plain DFS is just as good.',
    },
    {
      id: 'gd-dijkstra-negative',
      type: 'mcq',
      prompt: "Why does Dijkstra's algorithm fail on graphs with negative edge weights?",
      choices: [
        'It finalizes a node when popped from the min-heap, assuming its distance can never improve; a negative edge later can break that assumption',
        'The priority queue cannot store negative keys',
        'It only terminates on acyclic graphs',
        'Negative weights overflow the distance array',
      ],
      answer: 0,
      explanation:
        'Dijkstra is greedy: the closest unvisited node is popped and locked in, which is only safe if no future edge can shorten its path. A negative edge can. The standard follow-up: Bellman-Ford runs O(V·E), tolerates negative edges, and detects negative cycles.',
    },
    {
      id: 'gd-knapsack-1d',
      type: 'mcq',
      prompt: '0/1 knapsack compressed to a 1D array: which direction do you iterate capacity, and why?',
      choices: [
        'High to low, so dp[c - w] still holds the previous item-row value and the item is not counted twice',
        'Low to high, so smaller capacities are computed first',
        'Either direction gives the same result',
        'Low to high, but only when weights are sorted',
      ],
      answer: 0,
      explanation:
        'The update is dp[c] = max(dp[c], dp[c - w] + v). Iterating capacity downward means dp[c - w] was written on the previous item\'s pass, so each item is used at most once. Iterating upward lets the item feed its own row: that is exactly unbounded knapsack, which is why interviewers ask.',
    },
    {
      id: 'gd-lcs-fill',
      type: 'fill',
      prompt: 'Longest common subsequence: the recurrence when characters match:',
      code: 'if a[i - 1] == b[j - 1]:\n    dp[i][j] = ____ + 1\nelse:\n    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])',
      answers: ['dp[i - 1][j - 1]'],
      distractors: ['dp[i][j]', 'dp[i - 1][j]', 'dp[i][j - 1]'],
      explanation:
        'A match extends the best LCS of both prefixes shortened by one: the diagonal cell. On a mismatch, drop a character from one string or the other and take the max. The table is O(m·n), and since each row only reads the row above, space compresses to O(n).',
    },
    {
      id: 'gd-grid-dp-edges',
      type: 'tf',
      prompt: 'In grid DP such as min path sum, the first row and first column can both be initialized to 0.',
      answer: false,
      explanation:
        'Edge cells have only one way in, so the first row accumulates left to right and the first column top to bottom (for unique paths they are all 1). Wrong edge initialization is the classic grid DP bug; 0 is only correct with a padded table whose border is a neutral value.',
    },
    {
      id: 'gd-memo-vs-tab',
      type: 'flash',
      front: 'Memoization vs tabulation: how do you choose, and what are the tradeoffs?',
      back: 'Memoization (top-down): the natural recursion plus a cache.\n1. Easier to derive: it mirrors the brute force.\n2. Only touches reachable states.\n3. Risk: recursion depth can blow the stack, plus per-call overhead.\nTabulation (bottom-up): fill a table in dependency order.\n1. No stack limit and tight loops.\n2. Enables space tricks like keeping only the previous row.\n3. Cost: you must work out the iteration order, and you may compute states the answer never uses.',
    },
  ],
};
