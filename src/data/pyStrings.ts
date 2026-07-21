import type { Deck } from '../types';

export const pyStrings: Deck = {
  id: 'py-strings',
  title: 'Strings & Regex',
  description: 'String methods, f-strings, and just enough regex to be dangerous.',
  icon: '🔤',
  color: '#38bdf8',
  track: 'Python',
  cards: [
    {
      id: 'st-split-join',
      type: 'fill',
      prompt: 'Words back into a sentence:',
      code: 'sentence = " ".____(words)',
      answers: ['join'],
      distractors: ['concat', 'merge', 'append'],
      explanation:
        'join is a method on the SEPARATOR string, not the list: the inversion everyone forgets. "a b c".split() goes the other way.',
    },
    {
      id: 'st-immutable',
      type: 'mcq',
      prompt: 'What does `s[0] = "X"` do to a string?',
      choices: ['Raises TypeError; strings are immutable', 'Replaces the first character', 'Prepends X', 'Returns a new string'],
      answer: 0,
      explanation:
        'Build a new string instead: "X" + s[1:]. Immutability is also why repeated += in a loop is O(n²): collect parts in a list and join once.',
    },
    {
      id: 'st-concat-loop',
      type: 'mcq',
      prompt: 'Building a long string from 10,000 pieces: the right way?',
      choices: [
        'Append pieces to a list, then "".join(parts) once',
        's += piece in a loop is equally fast',
        'Use recursion',
        'Write to a file and read it back',
      ],
      answer: 0,
      explanation:
        'Each += copies the whole string so far (O(n²) total). join allocates once. A classic "senior eyes" code-review catch.',
    },
    {
      id: 'st-fstring',
      type: 'fill',
      prompt: 'Format a float to two decimals inline:',
      code: 'print(f"total: {amount:____}")',
      answers: ['.2f'],
      distractors: ['2f', 'f2', '%.2'],
      explanation:
        'Format specs live after the colon: {x:.2f}, {n:,} for thousands separators, {s:>10} to right-align in 10 chars.',
    },
    {
      id: 'st-strip',
      type: 'mcq',
      prompt: 'What does `"  hi there  ".strip()` return?',
      choices: ['"hi there"', '"hithere"', '"hi there  "', '"  hi there"'],
      answer: 0,
      explanation:
        'strip trims both ends only: interior whitespace stays. lstrip/rstrip do one side; strip("xy") trims those characters, not the substring "xy".',
    },
    {
      id: 'st-startswith',
      type: 'mcq',
      prompt: 'Cleanest way to check a filename ends with .csv or .tsv?',
      choices: [
        'name.endswith((".csv", ".tsv"))',
        'name[-4:] == ".csv" or name[-4:] == ".tsv"',
        'A regex is required',
        'name.contains(".csv")',
      ],
      answer: 0,
      explanation:
        'startswith/endswith accept a tuple of options: little-known and instantly cleaner than slicing arithmetic.',
    },
    {
      id: 'st-isdigit',
      type: 'mcq',
      prompt: 'Which check is True for the string `"42"` but False for `"4.2"`?',
      choices: ['"42".isdigit()', 'isinstance("42", int)', '"42".isnumeric() but not "4.2".isdigit()… both are the same here', 'len("42") == 2'],
      answer: 0,
      explanation:
        'isdigit is True only for pure digit characters: the decimal point fails it. For "is this parseable as a float", use try/except float().',
    },
    {
      id: 'st-ord-chr',
      type: 'fill',
      prompt: 'Letter arithmetic for cipher/anagram problems:',
      code: "index = ____('c') - ____('a')   # 2",
      answers: ['ord'],
      distractors: ['chr', 'ascii', 'int'],
      explanation:
        'ord: char → code point; chr: code point → char. ord(c) - ord("a") maps letters to 0–25: the backbone of counting-sort string tricks.',
    },
    {
      id: 'st-anagram',
      type: 'mcq',
      prompt: 'Fastest interview-ready anagram check for two words?',
      choices: [
        'Counter(a) == Counter(b)',
        'sorted(a) == sorted(b) is asymptotically better',
        'a == b[::-1]',
        'set(a) == set(b)',
      ],
      answer: 0,
      explanation:
        'Counter is O(n) vs sorted’s O(n log n); set() drops duplicate counts ("aab" vs "abb" would wrongly pass). Mention both Counter and sorted to show range.',
    },
    {
      id: 'st-re-search-match',
      type: 'mcq',
      prompt: '`re.match` vs `re.search`?',
      choices: [
        'match anchors at the start of the string; search finds the pattern anywhere',
        'match is case-insensitive',
        'search returns all matches',
        'They are identical',
      ],
      answer: 0,
      explanation:
        'And re.findall returns every non-overlapping match as a list. Most "regex doesn’t work" bugs are match-used-where-search-was-meant.',
    },
    {
      id: 'st-re-findall',
      type: 'fill',
      prompt: 'Pull all numbers out of messy text:',
      code: 'nums = re.____(r"\\d+", text)',
      answers: ['findall'],
      distractors: ['search', 'extract', 'matchall'],
      explanation:
        'Returns a list of strings (map int over them). \\d+ = one or more digits; add -? for negatives, (?:\\.\\d+)? for decimals.',
    },
    {
      id: 'st-re-groups',
      type: 'mcq',
      prompt: 'In `re.search(r"(\\w+)@(\\w+)", "bob@corp")`, what does `.group(1)` return?',
      choices: ['"bob"', '"corp"', '"bob@corp"', 'A tuple of both'],
      answer: 0,
      explanation:
        'Parentheses capture groups, numbered from 1; group(0) is the whole match; .groups() gives the tuple. Named groups (?P<user>\\w+) read better in real code.',
    },
    {
      id: 'st-re-greedy',
      type: 'mcq',
      prompt: 'Why does `r"<.*>"` match all of `"<a><b>"` instead of just `"<a>"`?',
      choices: [
        '* is greedy: it takes the longest match; use .*? for non-greedy',
        'The regex engine reads right to left',
        'Angle brackets are special characters',
        'It is a Python bug',
      ],
      answer: 0,
      explanation:
        'Greedy quantifiers grab maximally, then backtrack. Appending ? makes them lazy: the single most useful regex fix in practice.',
    },
    {
      id: 'st-re-sub',
      type: 'fill',
      prompt: 'Collapse runs of whitespace to single spaces:',
      code: 'clean = re.____(r"\\s+", " ", text)',
      answers: ['sub'],
      distractors: ['replace', 'swap', 'fill'],
      explanation:
        're.sub(pattern, replacement, text): the regex str.replace. The replacement can be a function for computed substitutions.',
    },
    {
      id: 'st-palindrome',
      type: 'mcq',
      prompt: 'Clean a string to letters-only lowercase for a palindrome check?',
      choices: [
        '"".join(c.lower() for c in s if c.isalnum())',
        's.lower().strip()',
        's.replace(" ", "")',
        'set(s.lower())',
      ],
      answer: 0,
      explanation:
        'Filter + normalize in one comprehension, then compare to its [::-1]. strip only touches the ends; replace misses punctuation.',
    },
    {
      id: 'st-multiline',
      type: 'mcq',
      prompt: 'What is `"a,b".split(",")` vs `"a,,b".split(",")`?',
      choices: [
        "['a', 'b'] vs ['a', '', 'b']: empty fields are preserved",
        'Both give [\'a\', \'b\']',
        'The second raises ValueError',
        "['a,b'] vs ['a', 'b']",
      ],
      answer: 0,
      explanation:
        'split(sep) keeps empty strings between adjacent separators: matters when parsing CSV-ish input by hand. Bare split() (no arg) collapses whitespace runs instead.',
    },
  ],
};
