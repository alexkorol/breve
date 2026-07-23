import type { Deck } from '../types';

export const pyPairs: Deck = {
  id: 'py-pairs',
  title: 'Lists, Dicts & Pairs',
  description: 'The "transform this list of pairs" problem class: drilled to reflex.',
  icon: '🔗',
  color: '#0284c7',
  track: 'Python',
  cards: [
    {
      id: 'pp-restate-habit',
      type: 'flash',
      front: 'THE habit for coding questions under pressure: what do you do before typing any code?',
      back: 'Restate the problem in your own words, then walk one concrete example by hand ("so [1,5] and [3,7] overlap because 3 ≤ 5, giving [1,7]…"). It confirms understanding with the interviewer, surfaces edge cases, buys composure, and hands you the test case you’ll verify against.',
    },
    {
      id: 'pp-dict-pairs',
      type: 'mcq',
      prompt: 'What does `dict([(1, 5), (3, 7)])` produce?',
      choices: ['{1: 5, 3: 7}', '{(1, 5): (3, 7)}', '[{1: 5}, {3: 7}]', 'TypeError'],
      answer: 0,
      explanation:
        'dict() consumes any iterable of (key, value) pairs. Going the other way: list(d.items()) gives the pairs back.',
    },
    {
      id: 'pp-sort-second',
      type: 'fill',
      prompt: 'Sort pairs by their second element:',
      code: 'pairs.sort(key=lambda p: p[____])',
      answers: ['1'],
      distractors: ['0', '2', '-1'],
      explanation:
        'Index 1 is the second element. Sorting with a key is the opening move of half of all pairs problems: including merge intervals (there it’s p[0]).',
    },
    {
      id: 'pp-zip',
      type: 'mcq',
      prompt: 'What does `list(zip([1, 2, 3], [4, 5, 6]))` return?',
      choices: [
        '[(1, 4), (2, 5), (3, 6)]',
        '[1, 4, 2, 5, 3, 6]',
        '[(1, 2, 3), (4, 5, 6)]',
        '[[1, 4], [2, 5], [3, 6]]',
      ],
      answer: 0,
      explanation:
        'zip pairs elements positionally, stopping at the shorter input. It is how you build pairs from parallel lists.',
    },
    {
      id: 'pp-unzip',
      type: 'fill',
      prompt: 'The unzip idiom: split pairs back into two sequences:',
      code: 'starts, ends = zip(____pairs)',
      answers: ['*'],
      distractors: ['**', 'iter, ', 'unpack '],
      explanation:
        'The * unpacks the list so zip receives each pair as a separate argument: zip((1,5), (3,7)) → (1,3), (5,7).',
    },
    {
      id: 'pp-group',
      type: 'mcq',
      prompt: 'Group `[("a", 1), ("b", 2), ("a", 3)]` into `{"a": [1, 3], "b": [2]}`. The idiomatic tool?',
      choices: [
        'defaultdict(list), then d[k].append(v) in a loop',
        'A nested list comprehension that rebuilds the value list for each key in one pass',
        'dict(pairs) directly: duplicate keys merge their values into a list',
        'set() then sorted()',
      ],
      answer: 0,
      explanation:
        'defaultdict(list) removes the "if key not in d" dance. dict(pairs) would silently keep only the LAST value per key: a classic trap worth saying out loud.',
    },
    {
      id: 'pp-counter',
      type: 'fill',
      prompt: 'Count occurrences in one line:',
      code: 'from collections import ____\nfreq = ____(words)',
      answers: ['Counter'],
      distractors: ['Counts', 'defaultdict', 'Tally'],
      explanation:
        'Counter is a dict subclass with .most_common(k): the instant answer to "top k frequent elements".',
    },
    {
      id: 'pp-tuple-unpack-loop',
      type: 'mcq',
      prompt: 'The cleanest way to iterate a list of pairs?',
      choices: [
        'for start, end in pairs:',
        'for p in pairs: start = p[0]; end = p[1]',
        'for i in range(len(pairs)): start = pairs[i][0]',
        'while pairs: start, end = pairs.pop()',
      ],
      answer: 0,
      explanation:
        'Tuple unpacking in the for statement: readable and names the elements. Index juggling under pressure is where off-by-one bugs breed.',
    },
    {
      id: 'pp-sorted-vs-sort',
      type: 'mcq',
      prompt: 'What does this print?',
      code: 'pairs = [(3, 7), (1, 5)]\nresult = pairs.sort()\nprint(result)',
      choices: ['None; .sort() sorts in place and returns None', '[(1, 5), (3, 7)]: .sort() hands back the freshly sorted list', '[(3, 7), (1, 5)]', 'TypeError'],
      answer: 0,
      explanation:
        'list.sort() mutates and returns None; sorted(pairs) returns a new sorted list. Assigning .sort()’s result is a bug that has sunk many live coding rounds.',
    },
    {
      id: 'pp-flatten',
      type: 'fill',
      prompt: 'Flatten a list of pairs into one flat list:',
      code: 'flat = [x for pair in pairs ____ x in pair]',
      answers: ['for'],
      distractors: ['if', 'in', 'and'],
      explanation:
        'Nested comprehension clauses read left to right like nested loops: outer loop first, inner loop second.',
    },
    {
      id: 'pp-dictcomp',
      type: 'mcq',
      prompt: 'Build `{name: score}` keeping only scores above 80, from a list of pairs?',
      choices: [
        '{name: score for name, score in pairs if score > 80}',
        'dict(pairs).filter(lambda s: s > 80)',
        '[name: score for name, score in pairs if score > 80]',
        'dict(pairs, score > 80)',
      ],
      answer: 0,
      explanation:
        'Dict comprehension with unpacking and a condition: one line, no intermediate steps. Square brackets there would be a syntax error (that’s a list).',
    },
    {
      id: 'pp-max-key',
      type: 'fill',
      prompt: 'The pair with the largest second element:',
      code: 'best = max(pairs, ____=lambda p: p[1])',
      answers: ['key'],
      distractors: ['by', 'cmp', 'sort'],
      explanation:
        'max/min/sorted all take the same key= parameter. One mental model, three functions.',
    },
    {
      id: 'pp-toolkit',
      type: 'order',
      prompt: 'A "transform this list of pairs" question appears. Order the mental checklist.',
      items: [
        'Does ORDER matter? Sort with a key first',
        'GROUPING or looking up? defaultdict/dict',
        'AGGREGATING? Counter, sum, max(key=)',
        'Restructuring? zip(*pairs), comprehension',
        'Restate the problem with one worked example, then code',
      ],
      explanation:
        'Screening exercises are almost always some combination of these four moves.',
    },
  ],
};
