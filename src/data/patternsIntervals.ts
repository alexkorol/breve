import type { Deck } from '../types';

export const patternsIntervals: Deck = {
  id: 'patterns-intervals',
  title: 'Patterns: Intervals & Arrays',
  description: 'Merge intervals, meeting rooms, sweep line: cold, until they click.',
  icon: '🧩',
  color: '#f97316',
  track: 'Coding Interview',
  cards: [
    {
      id: 'iv-recipe',
      type: 'flash',
      front: 'The merge-intervals recipe: say the two steps out loud.',
      back: '1) Sort intervals by start. 2) Walk them keeping a `merged` list: if the current start ≤ the end of the last merged interval, they overlap; extend that end to `max(both ends)`; otherwise append the current interval as-is. Sorting dominates: O(n log n).',
    },
    {
      id: 'iv-first-step',
      type: 'mcq',
      prompt: 'First move in almost every interval problem?',
      choices: [
        'Sort the intervals (usually by start)',
        'Build a hash map of starts to ends',
        'Binary search for overlaps',
        'Convert to a linked list',
      ],
      answer: 0,
      explanation:
        'Sorting makes overlaps adjacent: after it, each interval can only overlap the one merged before it. Without sorting, [8,10] might sit between [1,5] and [3,7].',
    },
    {
      id: 'iv-overlap-cond',
      type: 'mcq',
      prompt:
        'After sorting by start, the current interval `[s, e]` overlaps the last merged interval `[ls, le]` exactly when…',
      choices: ['s <= le', 'e <= le', 's < ls', 'e - s < le - ls'],
      answer: 0,
      explanation:
        "Since sorting guarantees s >= ls, the only question is whether the current interval starts before the previous one ends. That's the whole overlap test.",
    },
    {
      id: 'iv-worked-example',
      type: 'mcq',
      prompt: 'Merge the overlapping intervals:',
      code: '[[1, 5], [3, 7], [8, 10], [9, 12]]',
      choices: [
        '[[1, 7], [8, 12]]',
        '[[1, 12]]',
        '[[1, 5], [3, 7], [8, 12]]',
        '[[1, 7], [8, 10], [9, 12]]',
      ],
      answer: 0,
      explanation:
        '[3,7] starts at 3 ≤ 5, so it merges with [1,5] into [1,7]. [8,10] starts at 8 > 7: new group. [9,12] starts at 9 ≤ 10, merging into [8,12].',
    },
    {
      id: 'iv-merge-step',
      type: 'fill',
      prompt: 'The merge step, never just overwrite the end:',
      code: 'if s <= merged[-1][1]:\n    merged[-1][1] = ____(merged[-1][1], e)',
      answers: ['max'],
      distractors: ['min', 'sum', 'e'],
      explanation:
        'max() handles containment: merging [1,10] with [2,3] must keep end 10. Overwriting with e would shrink the interval: the classic bug.',
    },
    {
      id: 'iv-append-step',
      type: 'fill',
      prompt: 'Complete the full merge-intervals loop:',
      code: 'intervals.sort(key=lambda iv: iv[0])\nmerged = [intervals[0]]\nfor s, e in intervals[1:]:\n    if s <= merged[-1][1]:\n        merged[-1][1] = max(merged[-1][1], e)\n    else:\n        merged.____([s, e])',
      answers: ['append'],
      distractors: ['add', 'insert', 'extend'],
      explanation:
        'No overlap means this interval starts a new group. This 7-liner is the entire LeetCode 56 solution.',
    },
    {
      id: 'iv-touching',
      type: 'mcq',
      prompt: 'Do `[1, 5]` and `[5, 8]` merge?',
      choices: [
        'Yes: s <= le treats touching endpoints as overlap, giving [1, 8]',
        'No: they only share a single point',
        'Only if the intervals are open',
        'It causes an infinite loop',
      ],
      answer: 0,
      explanation:
        'With the standard s <= le condition, touching intervals merge. (If a problem wants strict overlap, it will say so, then use s < le.)',
    },
    {
      id: 'iv-complexity',
      type: 'mcq',
      prompt: 'Time complexity of merge intervals?',
      choices: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'],
      answer: 0,
      explanation:
        'The sort costs O(n log n); the merge walk is O(n). Say both parts in the interview: it shows you know where the cost comes from.',
    },
    {
      id: 'iv-why-sort',
      type: 'flash',
      front: 'Interviewer asks: "Why do you sort first? What breaks without it?"',
      back: 'The merge walk only compares each interval to the last merged one. That is valid only if overlapping intervals are adjacent, which sorting by start guarantees. Unsorted input like [[8,10],[1,12]] would append [1,12] as a separate group even though it swallows [8,10].',
    },
    {
      id: 'iv-variants',
      type: 'flash',
      front: 'Name the classic interval-problem variants (there are four).',
      back: 'Merge Intervals (combine overlaps), Insert Interval (splice one into a sorted list: three phases: before/merge/after, O(n) with no sort), Meeting Rooms I (can attend all? check adjacent overlaps), Meeting Rooms II / Non-overlapping Intervals (min rooms / min removals: heap of end times or sweep line).',
    },
    {
      id: 'iv-meeting-rooms',
      type: 'mcq',
      prompt: 'Minimum conference rooms for meetings `[[0, 30], [5, 10], [15, 20]]`?',
      choices: ['2', '1', '3', '0'],
      answer: 0,
      explanation:
        '[0,30] overlaps both others, but [5,10] and [15,20] don’t overlap each other: they can share the second room. Min-heap of end times: pop when the next meeting starts after the earliest end.',
    },
    {
      id: 'iv-sweep',
      type: 'flash',
      front: 'The sweep-line trick for "max simultaneous intervals": how does it work?',
      back: 'Turn every interval into two events: (start, +1) and (end, −1). Sort events, walk them keeping a running sum; its maximum is the peak overlap (= rooms needed). Sorting ends before starts at the same time handles back-to-back meetings.',
    },
    {
      id: 'iv-sort-by-end',
      type: 'fill',
      prompt:
        'For "keep the max number of non-overlapping intervals" (activity selection), sort greedily by end time:',
      code: 'intervals.sort(key=lambda iv: iv[____])',
      answers: ['1'],
      distractors: ['0', 'len', 'end'],
      explanation:
        'Finishing earliest leaves the most room for what follows. Sort-by-start is for merging; sort-by-end is for greedy selection: knowing which is which is the pattern.',
    },
  ],
};
