import type { Deck } from '../types';

export const jsAsync: Deck = {
  id: 'js-async',
  title: 'Async JS & the Event Loop',
  description: 'The event loop, promises, and the output-prediction questions interviewers love.',
  icon: '🔁',
  color: '#38bdf8',
  track: 'JavaScript & TypeScript',
  cards: [
    {
      id: 'jsa-event-loop',
      type: 'flash',
      front: 'Explain the event loop: what are the pieces, and what is the one rule about microtasks?',
      back: 'One thread runs the call stack. When the stack empties, the event loop pulls queued work: the microtask queue (promise reactions, queueMicrotask) and the task queue (setTimeout, I/O, UI events). The rule: after every task, the microtask queue drains COMPLETELY, including microtasks queued by other microtasks, before the next task or a render. That is why a .then always beats a setTimeout 0.',
    },
    {
      id: 'jsa-order-classic',
      type: 'mcq',
      prompt: 'What is the output order?',
      code: "console.log('a');\nsetTimeout(() => console.log('b'), 0);\nPromise.resolve().then(() => console.log('c'));\nconsole.log('d');",
      choices: ['a, d, c, b', 'a, b, c, d', 'a, d, b, c', 'a, c, d, b'],
      answer: 0,
      explanation:
        'Synchronous code runs to completion first (a, d). Then microtasks beat tasks: the .then callback (c) runs before the setTimeout callback (b), even at 0 ms, because the microtask queue drains before the next task.',
    },
    {
      id: 'jsa-order-await',
      type: 'order',
      prompt: 'Arrange the console output in the order it appears.',
      code: "console.log('C');\nasync function main() {\n  console.log('A');\n  await null;\n  console.log('B');\n}\nmain();\nPromise.resolve().then(() => console.log('E'));\nconsole.log('F');\nsetTimeout(() => console.log('D'), 0);",
      items: [
        "'C' (sync, top level)",
        "'A' (sync: main runs until its first await)",
        "'F' (sync, top level)",
        "'B' (microtask: await resumes, queued first)",
        "'E' (microtask: the .then)",
        "'D' (task: the timeout)",
      ],
      explanation:
        'main() executes synchronously until the first await, which suspends it and queues its continuation as a microtask, ahead of the .then registered afterward. Sync code finishes (C, A, F), microtasks drain in queue order (B, E), then the timeout task runs (D).',
    },
    {
      id: 'jsa-tick-order',
      type: 'order',
      prompt: 'Arrange one full turn of the browser event loop.',
      items: [
        'Take the oldest task off the task queue',
        'Run it to completion on the call stack',
        'Drain the microtask queue entirely',
        'Give the browser a chance to render',
        'Move on to the next task',
      ],
      explanation:
        'Run-to-completion: nothing preempts a running task. Microtasks that keep queueing microtasks can starve rendering, and one long task freezes the page. This model is the backbone answer for any "why is the UI janky" question.',
    },
    {
      id: 'jsa-states-await',
      type: 'flash',
      front: 'Name the three promise states, and explain what `await` actually does.',
      back: 'States: pending, fulfilled, rejected. A promise settles exactly once and never changes again. `await p` suspends the async function, returns control to the caller immediately, and schedules the rest of the function as a microtask for when p settles: the fulfillment value becomes the expression\'s result, a rejection is rethrown as an exception. An async function always returns a promise. await never blocks the thread; only that function pauses.',
    },
    {
      id: 'jsa-then-return',
      type: 'mcq',
      prompt: 'What does this log?',
      code: "Promise.resolve(1)\n  .then((x) => x + 1)\n  .then((x) => { console.log(x); })\n  .then((x) => console.log(x));",
      choices: [
        '2 then undefined: the second .then never returns a value',
        '2 then 2: the value carries through the chain',
        '2 then 3: each .then increments',
        '1 then 2',
      ],
      answer: 0,
      explanation:
        'Every .then returns a NEW promise resolved with its callback\'s return value; a braced body with no return resolves to undefined. Returning a promise inside .then makes the chain wait for it. The forgotten return is the classic silent chaining bug.',
    },
    {
      id: 'jsa-chain-errors',
      type: 'mcq',
      prompt: 'What does this log?',
      code: "Promise.reject(new Error('boom'))\n  .then(() => console.log('a'))\n  .catch((e) => console.log('b'))\n  .then(() => console.log('c'));",
      choices: [
        "'b' then 'c': catch handles the error, and its normal return fulfills the next link",
        "'b' only: a chain stops after being caught",
        "'a', 'b', then 'c': every handler runs",
        "Uncaught error: .catch only handles throws inside .then callbacks",
      ],
      answer: 0,
      explanation:
        'A rejection skips .then fulfillment handlers until it meets a rejection handler. A .catch that returns normally fulfills its promise (with undefined here), so the chain resumes. Rethrow inside .catch when the chain should stay rejected.',
    },
    {
      id: 'jsa-forgotten-await',
      type: 'mcq',
      prompt: 'fetchData() returns a promise that rejects. Does the catch block run?',
      code: "async function load() {\n  try {\n    return fetchData(); // rejects later\n  } catch (e) {\n    console.log('caught');\n  }\n}",
      choices: [
        'No: without await, the try block exits before the rejection happens, so the caller gets a rejected promise',
        'Yes: try/catch catches any error from code it wraps',
        'Yes: return and return await behave identically',
        'No, and the rejection is silently swallowed forever',
      ],
      answer: 0,
      explanation:
        'try/catch only sees exceptions thrown while the block is still on the stack. Returning a bare promise hands it to the caller unawaited; it rejects later, outside the try. Fix: `return await fetchData()`. This is the one place where return await genuinely matters.',
    },
    {
      id: 'jsa-unhandled',
      type: 'tf',
      prompt: 'A promise rejection with no .catch handler is silently swallowed.',
      answer: false,
      explanation:
        'Browsers fire the unhandledrejection event and log a console error; Node crashes the process by default since v15. The fixes: end every chain with .catch, wrap await in try/catch, and remember that .then(onOk, onFail) does not catch errors thrown inside onOk.',
    },
    {
      id: 'jsa-combinators',
      type: 'flash',
      front: 'Promise.all vs allSettled vs race vs any: what does each do when something fails?',
      back: 'Promise.all: fulfills with an array of values; rejects fast on the FIRST rejection.\nPromise.allSettled: never rejects; fulfills with {status, value or reason} for every input.\nPromise.race: settles as soon as ANY input settles, fulfilled or rejected.\nPromise.any: fulfills on the first fulfillment; rejects only if ALL reject, with an AggregateError.\nPick by failure semantics: all for all-or-nothing, allSettled for independent work, race for timeouts, any for redundant sources.',
    },
    {
      id: 'jsa-all-fail',
      type: 'mcq',
      prompt: 'Promise.all([a, b, c]) and b rejects first. What happens?',
      choices: [
        'It rejects immediately with b\'s reason; a and c keep running but their results are dropped',
        'It waits for all three, then rejects with an array of errors',
        'It fulfills with the two successful values',
        'a and c are cancelled automatically',
      ],
      answer: 0,
      explanation:
        'Fail-fast: the first rejection settles the combined promise, and a settled promise cannot change. Nothing is cancelled: JS promises are not cancellable, so a and c run to completion anyway. Need every outcome? Use allSettled.',
    },
    {
      id: 'jsa-serial-loop',
      type: 'mcq',
      prompt: 'Three URLs, each taking about 300 ms. Roughly how long does this take, and why?',
      code: "const results = [];\nfor (const url of urls) {\n  const res = await fetch(url);\n  results.push(await res.json());\n}",
      choices: [
        'About 900 ms: each await pauses the loop, so the requests run one after another',
        'About 300 ms: fetch calls are async, so they overlap automatically',
        'About 300 ms: the event loop parallelizes awaits',
        'About 900 ms: JavaScript allows only one open connection',
      ],
      answer: 0,
      explanation:
        'await in a loop serializes: request n+1 does not start until request n finishes. Start everything first, then await: `await Promise.all(urls.map(async (u) => (await fetch(u)).json()))` finishes in about one round trip. Keep the loop form only when ordering or rate limits demand it.',
    },
    {
      id: 'jsa-callbacks',
      type: 'flash',
      front: 'Interviewer: "Why did promises replace plain callbacks?" What are the concrete problems?',
      back: '1. Pyramid of doom: each sequential async step nests one level deeper, and error handling must be duplicated at every level.\n2. Inversion of control: you hand your callback to someone else\'s code, which might call it never, twice, or synchronously.\n3. No composition: there is no built-in way to say "when all of these finish".\nPromises fix each: flat .then chains with a single .catch, a guaranteed one-time asynchronous settlement, and combinators like Promise.all.',
    },
    {
      id: 'jsa-timeout-zero',
      type: 'tf',
      prompt: 'setTimeout(fn, 0) runs fn immediately, right after the current line.',
      answer: false,
      explanation:
        'It queues a task that runs only after the current script AND the entire microtask queue finish. Browsers also clamp nested timers (about 4 ms once nesting passes 5 levels) and throttle background tabs to 1000 ms or more. Treat the delay as "at least", never "exactly".',
    },
    {
      id: 'jsa-abort',
      type: 'fill',
      prompt: 'Cancel an in-flight fetch:',
      code: "const c = new AbortController();\nfetch(url, { signal: c.signal });\nc.____(); // fetch rejects with an AbortError",
      answers: ['abort'],
      distractors: ['cancel', 'stop', 'reject', 'close'],
      explanation:
        'AbortController is the standard cancellation primitive: pass its signal into fetch (or addEventListener), call abort() to reject the pending promise with an AbortError. Promises themselves are not cancellable; the controller cancels the operation, not the promise.',
    },
    {
      id: 'jsa-fetch-ok',
      type: 'mcq',
      prompt: 'A fetch call gets an HTTP 500 back. What does the fetch promise do?',
      choices: [
        'Fulfills normally: fetch rejects only on network failure, so you must check response.ok yourself',
        'Rejects with an HTTPError containing the status',
        'Rejects with the response body as the reason',
        'Fulfills, but response.json() rejects because of the status',
      ],
      answer: 0,
      explanation:
        'fetch rejects only when no response arrives at all: DNS failure, offline, CORS block, abort. Any HTTP status fulfills, so the standard guard is `if (!res.ok) throw new Error(res.status)`. response.ok is true for statuses 200-299.',
    },
    {
      id: 'jsa-json-await',
      type: 'fill',
      prompt: 'Reading the body is a second async step:',
      code: "const res = await fetch(url);\nconst data = ____ res.json();",
      answers: ['await'],
      distractors: ['return', 'yield', 'JSON.parse'],
      explanation:
        'fetch resolves as soon as headers arrive; the body may still be streaming in, so res.json() returns a promise too. Forgetting the second await hands you a pending promise instead of data, usually surfacing as "x is undefined" one line later.',
    },
    {
      id: 'jsa-node-loop',
      type: 'flash',
      front: 'How does the Node.js event loop differ from the browser\'s, at interview depth?',
      back: 'Node\'s loop runs libuv phases: timers, pending callbacks, poll (I/O), check (setImmediate), close. Between callbacks it drains process.nextTick first, then promise microtasks.\n1. process.nextTick runs before promise microtasks.\n2. setImmediate runs in the check phase; inside an I/O callback it fires before setTimeout 0.\n3. No render step: browsers interleave painting, Node interleaves I/O phases.\nMicrotask semantics (drain fully between callbacks) have matched the browser since Node 11.',
    },
  ],
};
