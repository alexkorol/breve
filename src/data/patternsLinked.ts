import type { Deck } from '../types';

export const patternsLinked: Deck = {
  id: 'patterns-linked',
  title: 'Patterns: Lists, Stacks, Queues',
  description: 'Pointer surgery, monotonic stacks, and the fast/slow trick.',
  icon: '⛓️',
  color: '#94a3b8',
  track: 'Coding Interview',
  cards: [
    {
      id: 'lk-reverse',
      type: 'flash',
      front: 'Reverse a linked list: recite the loop, name the pointers.',
      back: 'prev = None; curr = head; while curr: nxt = curr.next; curr.next = prev; prev = curr; curr = nxt; return prev. Three pointers, four assignments per step, save nxt BEFORE rewiring.',
    },
    {
      id: 'lk-reverse-order',
      type: 'mcq',
      prompt: 'In the reversal loop, why must `nxt = curr.next` come first?',
      choices: [
        'Rewiring curr.next = prev first would lose the rest of the list forever',
        'It is a style convention',
        'Python evaluates right to left',
        'It avoids a TypeError',
      ],
      answer: 0,
      explanation:
        'The rest of the list is reachable only through curr.next: save the lifeline before cutting it.',
    },
    {
      id: 'lk-fast-slow',
      type: 'mcq',
      prompt: 'Find the middle of a linked list in one pass?',
      choices: [
        'Fast/slow pointers: fast moves 2, slow moves 1; when fast ends, slow is at the middle',
        'Count nodes, then walk n/2: one pass is impossible',
        'Recursion to the end and back',
        'Convert to an array first',
      ],
      answer: 0,
      explanation:
        'The tortoise-and-hare frame also powers cycle detection and kth-from-end. One pattern, three problems.',
    },
    {
      id: 'lk-cycle',
      type: 'mcq',
      prompt: 'Detect a cycle in O(1) space?',
      choices: [
        'Floyd’s: fast/slow pointers; if they ever meet, there’s a cycle',
        'Store visited nodes in a set (that’s O(n) space)',
        'Impossible in O(1) space',
        'Check if length exceeds 10,000',
      ],
      answer: 0,
      explanation:
        'In a cycle the fast pointer gains one node per step on the slow one: collision guaranteed. The set version is the right first answer; Floyd’s is the follow-up they want.',
    },
    {
      id: 'lk-dummy',
      type: 'fill',
      prompt: 'The trick that deletes head-of-list edge cases:',
      code: 'dummy = ListNode(0, head)\nprev, curr = ____, head\n# ... surgery ...\nreturn dummy.next',
      answers: ['dummy'],
      distractors: ['head', 'None', 'curr'],
      explanation:
        'A dummy node before the head means "delete the first node" is no longer special: prev always exists. Reach for it whenever the head might change.',
    },
    {
      id: 'lk-merge-two',
      type: 'mcq',
      prompt: 'Merging two sorted linked lists: the standard shape?',
      choices: [
        'Dummy head + tail pointer; repeatedly attach the smaller head; splice the leftover at the end',
        'Convert both to arrays, sort, rebuild',
        'Recursively swap every pair',
        'Interleave alternating nodes',
      ],
      answer: 0,
      explanation:
        'O(n+m), no allocation beyond the dummy. Also the merge step of merge sort and the k-lists version just adds a heap of heads.',
    },
    {
      id: 'lk-valid-parens',
      type: 'fill',
      prompt: 'Matched brackets: the canonical stack problem:',
      code: 'pairs = {")": "(", "]": "[", "}": "{"}\nfor ch in s:\n    if ch in pairs:\n        if not stack or stack.____() != pairs[ch]:\n            return False\n    else:\n        stack.append(ch)',
      answers: ['pop'],
      distractors: ['peek', 'top', 'remove'],
      explanation:
        'Openers push, closers must pop their matching opener. Don’t forget the ending check: return not stack (leftover openers = invalid).',
    },
    {
      id: 'lk-monotonic',
      type: 'flash',
      front: 'The monotonic stack pattern: what problems scream for it, and how does it work?',
      back: '"Next greater element", "daily temperatures", "largest rectangle in histogram". Keep a stack of indices whose values are decreasing; when a bigger value arrives, pop everything smaller: the new value is their answer. Each index pushes and pops at most once: O(n) for what looks like an O(n²) problem.',
    },
    {
      id: 'lk-deque',
      type: 'mcq',
      prompt: 'Why is `collections.deque` the queue, and a plain list not?',
      choices: [
        'deque pops from the left in O(1); list.pop(0) shifts everything. O(n)',
        'Lists cannot pop from the front at all',
        'deque is sorted automatically',
        'deque holds more elements',
      ],
      answer: 0,
      explanation:
        'BFS with list.pop(0) silently turns O(V+E) into O(V²). popleft()/appendleft() are the deque verbs to know cold.',
    },
    {
      id: 'lk-stack-queue-uses',
      type: 'mcq',
      prompt: 'Which pairing is right?',
      choices: [
        'Stack → DFS, undo, matched brackets; Queue → BFS, level order, task scheduling',
        'Stack → BFS; Queue → DFS',
        'Both are interchangeable everywhere',
        'Queues are only for multithreading',
      ],
      answer: 0,
      explanation:
        'LIFO dives deep (most recent first), FIFO spreads wide (oldest first). The data structure IS the traversal order.',
    },
    {
      id: 'lk-min-stack',
      type: 'mcq',
      prompt: 'Design a stack with O(1) getMin(): the trick?',
      choices: [
        'A parallel stack of "min so far" values, pushed and popped in lockstep',
        'Scan the stack on each getMin call',
        'Keep the stack sorted',
        'Store min in a variable and rescan on pop',
      ],
      answer: 0,
      explanation:
        'Each element remembers the min at its moment; popping restores the previous min automatically. The rescan-on-pop "optimization" is the trap: it degrades to O(n).',
    },
    {
      id: 'lk-lru',
      type: 'flash',
      front: 'Design an LRU cache: the two structures and why both are needed.',
      back: 'Hash map (key → node) for O(1) lookup + doubly linked list for O(1) recency reordering: move-to-front on access, evict from the tail when full. The map alone can’t track order; the list alone can’t look up. In Python, OrderedDict (or dict + move_to_end) does both: say the from-scratch design first, then mention the shortcut.',
    },
    {
      id: 'lk-array-vs-list',
      type: 'mcq',
      prompt: 'When does a linked list actually beat a Python list?',
      choices: [
        'Frequent insertions/deletions at known positions mid-sequence (given a node reference). O(1) rewiring vs O(n) shifting',
        'Random access by index',
        'Iteration speed',
        'Memory usage per element',
      ],
      answer: 0,
      explanation:
        'Honest framing: arrays win most real workloads (cache locality, O(1) indexing); linked lists win interview problems and LRU internals. Saying that tradeoff plainly reads as experience.',
    },
  ],
};
