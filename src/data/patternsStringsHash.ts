import type { Deck } from '../types';

export const patternsStringsHash: Deck = {
  id: 'patterns-strings-hash',
  title: 'Patterns: Strings & Hashing',
  description: 'Two Sum energy: hash maps as the universal O(n) cheat code.',
  icon: '#️⃣',
  color: '#fb7185',
  track: 'Coding Interview',
  cards: [
    {
      id: 'sh-two-sum',
      type: 'flash',
      front: 'Two Sum in O(n): narrate the insight, then the code.',
      back: 'For each number, the question is "have I already SEEN its complement (target − x)?": a set/dict answers that in O(1). seen = {}; for i, x in enumerate(nums): if target - x in seen: return [seen[target - x], i]; seen[x] = i. One pass, store value → index. The generalized lesson: hash maps turn "find a matching partner" from O(n²) to O(n).',
    },
    {
      id: 'sh-complement',
      type: 'fill',
      prompt: 'The Two Sum lookup:',
      code: 'for i, x in enumerate(nums):\n    if target - x ____ seen:\n        return [seen[target - x], i]\n    seen[x] = i',
      answers: ['in'],
      distractors: ['==', 'not in', '>='],
      explanation:
        'Membership check BEFORE inserting x: inserting first would let x match itself when target = 2x.',
    },
    {
      id: 'sh-group-anagrams',
      type: 'mcq',
      prompt: 'Group anagrams together: what is the hash key?',
      choices: [
        'The sorted word (or a 26-count tuple): all anagrams share it',
        'The first letter',
        'The word length combined with its first and last letters, unique per anagram set',
        'Python’s built-in hash of the word: anagrams collide since they share characters',
      ],
      answer: 0,
      explanation:
        'Canonical-form-as-key is the deep pattern: design a key that collides exactly for things you want grouped. tuple(counts) beats sorted() at O(n) vs O(n log n) per word.',
    },
    {
      id: 'sh-first-unique',
      type: 'mcq',
      prompt: 'First non-repeating character in a string: the two-pass shape?',
      choices: [
        'Counter the string, then rescan for the first char with count 1',
        'Nested loops comparing every pair',
        'Sort the string, then return the first char whose neighbors differ',
        'Push chars on a stack, popping when a repeat arrives; the bottom is the answer',
      ],
      answer: 0,
      explanation:
        'Count then rescan: two O(n) passes beat one clever pass. The rescan preserves original order, which the Counter alone loses.',
    },
    {
      id: 'sh-longest-substr',
      type: 'flash',
      front: 'Longest substring without repeating characters: the sliding window + set dance.',
      back: 'Window [left, right] with a set of chars inside. Advance right each step; while s[right] is already in the set, remove s[left] and advance left. Track max window size. Each char enters and leaves the window at most once. O(n). This is THE canonical sliding-window-with-state problem.',
    },
    {
      id: 'sh-window-counts',
      type: 'mcq',
      prompt: 'Find all anagrams of pattern p in string s: the efficient frame?',
      choices: [
        'Fixed-size sliding window with a running char count, updated incrementally per slide',
        'Recount the full window at every position: the O(len(p)) cost per slide is already optimal',
        'Generate all permutations of p and search each',
        'Sort every window and compare it against sorted(p)',
      ],
      answer: 0,
      explanation:
        'Add the entering char, remove the leaving one. O(1) per slide instead of O(len(p)). Permutation generation is the exponential trap answer.',
    },
    {
      id: 'sh-defaultdict-int',
      type: 'fill',
      prompt: 'Counting with zero boilerplate:',
      code: 'from collections import defaultdict\ncounts = defaultdict(____)\nfor ch in s:\n    counts[ch] += 1',
      answers: ['int'],
      distractors: ['0', 'list', 'dict'],
      explanation:
        'defaultdict(int) makes missing keys start at 0. The factory is the TYPE (int → 0, list → [], set → set()), not a value.',
    },
    {
      id: 'sh-subarray-sum',
      type: 'flash',
      front: 'Count subarrays summing to k: the prefix-sum + hash map trick (hard until it isn’t).',
      back: 'Running prefix sum P; a subarray ending here sums to k exactly when some earlier prefix equals P − k. Keep a Counter of prefix sums seen: ans += seen[P - k]; seen[P] += 1. Seed seen[0] = 1 for subarrays starting at index 0. O(n) for a problem that looks O(n²), and the same skeleton solves "subarray divisible by k".',
    },
    {
      id: 'sh-set-ops',
      type: 'mcq',
      prompt: 'Elements common to two lists, each listed once?',
      choices: [
        'set(a) & set(b)',
        '[x for x in a if x in b]: already optimal',
        'sorted(a) == sorted(b)',
        'zip(a, b)',
      ],
      answer: 0,
      explanation:
        'Set operators: & intersection, | union, - difference, ^ symmetric difference. The list-comp version hides an O(n·m) membership scan: make b a set at minimum.',
    },
    {
      id: 'sh-longest-consecutive',
      type: 'mcq',
      prompt: 'Longest consecutive run (e.g. [100,4,200,1,3,2] → 4) in O(n): the key move?',
      choices: [
        'Put all in a set; only start counting from numbers where n-1 is absent (run starts)',
        'Sort first and scan adjacent pairs for runs: O(n log n) is provably optimal here',
        'Put all in a set and count upward from every number: membership checks are O(1) anyway',
        'Use a sliding window',
      ],
      answer: 0,
      explanation:
        'The start-detection check means each number is visited O(1) times total. Counting from EVERY number silently degrades to O(n²) on long runs: the trap inside the trick.',
    },
    {
      id: 'sh-hashable',
      type: 'mcq',
      prompt: 'Why does `{[1, 2]: "x"}` raise TypeError?',
      choices: [
        'Lists are mutable, hence unhashable: use a tuple key instead',
        'Dict keys must be strings or numbers: container keys are never allowed',
        'Two-element keys are not allowed: dict keys must be scalar values',
        'It works fine',
      ],
      answer: 0,
      explanation:
        'Hashes must be stable, so mutable containers refuse. Corollary you’ll actually hit: sets of coordinates must be sets of TUPLES.',
    },
    {
      id: 'sh-str-hash-design',
      type: 'flash',
      front: '"How does a hash map actually work?": the 60-second whiteboard answer.',
      back: 'The path: hash(key) → integer → modulo bucket count → bucket index.\nCollisions: chaining (a list per bucket) or open addressing (probe next slots; CPython dicts do this).\nGrowth: when the load factor climbs, resize into a new array and rehash everything (the amortized cost).\nGood hash = uniform spread. Bonus point: Python randomizes string hashes per process to block collision-DoS attacks.',
    },
  ],
};
