import type { Deck } from '../types';

export const behStarMethod: Deck = {
  id: 'beh-star-method',
  title: 'STAR Stories That Land',
  description: 'Structure answers that sound like evidence, not anecdotes.',
  icon: '⭐',
  color: '#f59e0b',
  track: 'Behavioral',
  cards: [
    {
      id: 'bst-structure',
      type: 'flash',
      front: 'What is the STAR structure, and how should a 90-second answer split across it?',
      back: 'Situation, Task, Action, Result.\n1) Situation + Task: 15-20 seconds combined, just enough context to follow.\n2) Action: 50-60 seconds, the core of the answer.\n3) Result: 10-15 seconds, quantified.\nWeak answers invert this: long setup, thin action. Interviewers grade the Action; everything else is framing.',
    },
    {
      id: 'bst-i-not-we',
      type: 'flash',
      front: 'Why must the Action section say "I" rather than "we", and how do you credit the team without vanishing?',
      back: 'The interviewer is hiring you, not your team; "we shipped it" gives them nothing to evaluate. State what you personally decided, built, or argued for. Credit teammates by scoping ownership ("a teammate owned the migration; I owned the rollback plan"): naming who did what reads as honest, while wall-to-wall "we" reads as either no agency or something to hide.',
    },
    {
      id: 'bst-question-behind',
      type: 'flash',
      front: '"Tell me about a challenge you faced." What is the question behind the question, and how does it change the story you pick?',
      back: 'It screens for how you behave under difficulty: whether you diagnose, act, and own the outcome, or drift and blame. Pick a story where the difficulty was real, your response was deliberate, and you can name what you did that a passive person would not have. A story where the problem resolved itself, or someone else fixed it, answers the surface question and fails the real one.',
    },
    {
      id: 'bst-no-metric',
      type: 'flash',
      front: 'Your project has no clean metric. How do you still quantify the Result?',
      back: 'Quantify the surroundings of the outcome:\n1) Scope: users, requests, team size, systems touched.\n2) Time: deadline hit, weeks saved, incident duration cut.\n3) Before/after: manual steps removed, escalations that stopped.\n4) Adoption: who used it, who asked for it next.\nA rough honest number ("roughly halved review time") beats a vague adjective ("much faster").',
    },
    {
      id: 'bst-differently',
      type: 'flash',
      front: '"What would you do differently?" What does a strong answer look like, and what is the trap?',
      back: 'The trap is the humblebrag ("I would have succeeded even faster") or "nothing": both signal you cannot self-assess. A strong answer names one real decision you would change, why the alternative is better, and evidence you have since acted on the lesson. The question tests whether you learn from your own stories; a concrete revision is the only credible proof.',
    },
    {
      id: 'bst-weakness',
      type: 'flash',
      front: 'How do you answer "what is your biggest weakness" honestly without sinking yourself?',
      back: 'Formula: real weakness, concrete cost, mitigation already in place.\n1) Real: something that has actually bitten you (over-scoping, avoiding conflict, weak delegation).\n2) Cost: one sentence on when it hurt.\n3) Mitigation: the system you now use, not a vow to try harder.\nA strength in disguise ("I care too much") signals you dodged the question, and the dodge is itself the negative signal.',
    },
    {
      id: 'bst-length',
      type: 'flash',
      front: 'How long should a behavioral answer run, and how do you handle depth?',
      back: 'First pass: about 90 seconds, the full STAR arc at headline level. Then stop and let the interviewer steer; they will drill into the part they care about. Five minutes of front-loaded detail buries what they wanted and blocks the follow-ups where you look best. If the interviewer keeps trying to interject, you are past budget.',
    },
    {
      id: 'bst-rambling',
      type: 'mcq',
      prompt: 'A candidate spends two minutes on the company, the org chart, and the project history before reaching what they did. The failure?',
      choices: [
        'Inverted timing: Situation should be one or two sentences; the Action is what gets graded',
        'Not enough context: interviewers need the full background to judge the action',
        'None, if the story is complex; complex stories earn longer setups',
        'They should skip the Situation entirely and open with the Action',
      ],
      answer: 0,
      explanation:
        'Give the minimum context that makes the Action legible; the interviewer will ask if they need more. A long setup spends the answer budget on the one section that earns no credit.',
    },
    {
      id: 'bst-no-result',
      type: 'mcq',
      prompt: 'A story ends with "...so I refactored the pipeline and moved on to the next project." What is missing?',
      choices: [
        'The Result: without an outcome the story is an anecdote, not evidence the action worked',
        'Nothing: the action speaks for itself',
        'More technical detail about the refactor',
        'A line about how the team felt about the work',
      ],
      answer: 0,
      explanation:
        'Every story ends with what changed, ideally quantified. An action without a measured outcome could just as easily have failed; the Result is what converts effort into a claim.',
    },
    {
      id: 'bst-no-agency',
      type: 'mcq',
      prompt: 'A candidate tells a dramatic outage story, but every action was taken by the on-call senior while they watched. The problem?',
      choices: [
        'No personal agency: being present for a crisis proves nothing; pick a story where you acted',
        'Outage stories are too negative for interviews',
        'The story needs more technical depth about the outage',
        'They should retell it with themselves performing the actions',
      ],
      answer: 0,
      explanation:
        'Choose a different story rather than inflate your role. Interviewers probe follow-ups precisely to find the boundary of what you actually did, and an inflated story collapses under one "what did YOU decide" question.',
    },
    {
      id: 'bst-blame',
      type: 'mcq',
      prompt: 'In a conflict story, the candidate explains at length how a teammate\'s sloppy work caused the problem. How does this land?',
      choices: [
        'Badly: blame previews how you will talk about their team; keep the other party neutral, focus on your handling',
        'Well: it accurately establishes the Situation',
        'Well, as long as the teammate really was at fault',
        'Neutrally: interviewers only listen to the Action anyway',
      ],
      answer: 0,
      explanation:
        'Conflict questions test how you manage disagreement, not who was right. Describe the other side charitably ("we disagreed on rollout risk") and spend the time on how you resolved it.',
    },
    {
      id: 'bst-fake-weakness',
      type: 'mcq',
      prompt: '"My biggest weakness is that I\'m a perfectionist." Why does this answer fail?',
      choices: [
        'It is a strength in disguise, so it signals evasion; the question tests self-awareness and honesty',
        'Perfectionism is too common; a rarer weakness would work better',
        'It only fails if the role does not value quality',
        'It does not fail: it shows high standards while staying safe',
      ],
      answer: 0,
      explanation:
        'Interviewers have heard it hundreds of times and read it as a dodge. A real weakness plus a working mitigation demonstrates the exact self-awareness the question probes.',
    },
    {
      id: 'bst-strong-result',
      type: 'mcq',
      prompt: 'Which Result statement is strongest?',
      choices: [
        '"Deploy time dropped from 45 minutes to 8, and two other teams adopted the script"',
        '"The project was a big success and leadership was very happy"',
        '"We shipped on time"',
        '"It significantly improved developer productivity"',
      ],
      answer: 0,
      explanation:
        'Specific numbers plus third-party adoption is verifiable evidence; "success" and "significantly" are claims the listener must take on faith. Adoption by others is often the strongest metric when you lack a clean one.',
    },
    {
      id: 'bst-tf-length',
      type: 'tf',
      prompt: 'A thorough behavioral answer should run four to five minutes so no important detail is missed.',
      answer: false,
      explanation:
        'Target about 90 seconds for the first pass, then expand where the interviewer drills. A long monologue buries the relevant part and removes the interviewer\'s ability to steer, which itself reads as poor communication.',
    },
    {
      id: 'bst-tf-skip-result',
      type: 'tf',
      prompt: 'If a project produced no measurable outcome, it is better to end the story after the Action than to force a number.',
      answer: false,
      explanation:
        'Never end without a Result. When no clean metric exists, quantify scope, time saved, before/after workflow, or adoption; an honest approximate number still turns the story into evidence.',
    },
    {
      id: 'bst-order-star',
      type: 'order',
      prompt: 'Arrange a 90-second STAR answer in order.',
      items: [
        'Situation: one or two sentences of context',
        'Task: your specific responsibility, one sentence',
        'Action: what you personally did, most of the time',
        'Result: the quantified outcome',
        'Lesson: one line on what you changed after',
      ],
      explanation:
        'S and T are framing, A is the graded section, R is the proof. The optional lesson line sets up the "what would you do differently" follow-up on your own terms.',
    },
    {
      id: 'bst-order-matrix',
      type: 'order',
      prompt: 'Arrange the steps for building a behavioral story matrix.',
      items: [
        'List your 6-8 strongest recent stories',
        'Set columns: conflict, failure, leadership, ambiguity, deadline, disagreement',
        'Map each story to every dimension it covers',
        'Find new stories for any empty column',
        'Draft each as STAR with a quantified Result',
        'Rehearse each to a 90-second first pass',
      ],
      explanation:
        'One good story usually covers two or three dimensions, so 6-8 stories cover the standard question space. With the matrix filled, no question forces improvisation.',
    },
  ],
};
