import type { Deck } from '../types';

export const behSeniorSignals: Deck = {
  id: 'beh-senior-signals',
  title: 'Senior Signals & Scope',
  description: 'What separates a senior answer from a mid-level answer to the exact same question.',
  icon: '🧭',
  color: '#818cf8',
  track: 'Behavioral',
  cards: [
    {
      id: 'bss-scope-ladder',
      type: 'flash',
      front: 'What is the scope ladder, and how do interview levels map onto it?',
      back: 'The ladder: task → project → team → org, ranked by how much changes if you succeed.\nMid: executed a task or project someone else defined.\nSenior: owned a problem, defined the project, and other people changed what they did because of it.\nStaff+: the org changed how it operates.\nInterviewers calibrate your level to the largest scope your stories credibly support, so lead with your widest-scope story.',
    },
    {
      id: 'bss-same-question',
      type: 'mcq',
      prompt: 'A mid-level and a senior candidate tell the same project as their "hardest project" story. What usually separates the senior telling?',
      choices: [
        'Where it starts: the senior owned the problem before it was a defined project, and the impact extends past their own code',
        'More technical depth in the implementation details',
        'A bigger team and a longer timeline',
        'More polished, confident delivery',
      ],
      answer: 0,
      explanation:
        'Depth, headcount, and polish are surface signals. Level is read off scope: who framed the problem, who was affected, and what changed afterward. The same project told as "I was assigned" vs "I noticed and drove" lands a level apart.',
    },
    {
      id: 'bss-scope-close',
      type: 'mcq',
      prompt: 'Which closing line to a behavioral story signals the widest scope?',
      choices: [
        'The template we built became the default for every new service across the org',
        'My code passed review with no major comments',
        'We hit the deadline my manager set',
        'I learned a lot about the framework',
      ],
      answer: 0,
      explanation:
        'Endings are where interviewers read scope. Task-level endings (clean code, deadline met) cap the story at mid. Endings where other teams\' behavior changed are team/org scope, the senior and staff band.',
    },
    {
      id: 'bss-ambiguity-story',
      type: 'flash',
      front: 'How do you structure a "dealt with ambiguity" story so it reads senior?',
      back: 'Start before the requirements existed: a vague charter ("make onboarding better"), not a ticket.\n1. Named the real problem: talked to users and stakeholders, found what actually hurt.\n2. Cut scope: proposed a concrete v1 and wrote down what was explicitly out.\n3. Created checkpoints: shipped something reviewable early to convert opinions into feedback.\n4. Result: what shipped and what open question it settled.\nThe signal is that you manufactured clarity instead of waiting for it.',
    },
    {
      id: 'bss-influence-adoption',
      type: 'mcq',
      prompt: 'You want three other teams to adopt a testing practice you have no authority to mandate. Which story do interviewers rate highest?',
      choices: [
        'Proved it on your own team, published the results, made adoption cheap with templates and docs, and let one early-adopter team pull in the rest',
        'Convinced your director to add it to every team\'s quarterly goals',
        'Presented an all-hands slide deck on why the practice is best',
        'Rewrote the other teams\' tests yourself over a few weekends',
      ],
      answer: 0,
      explanation:
        'Influence without authority = evidence, plus a lowered cost of adoption, plus a willing first follower. Mandates borrow someone else\'s authority, decks are advocacy without adoption, and doing it yourself neither scales nor survives your absence.',
    },
    {
      id: 'bss-tf-mandate',
      type: 'tf',
      prompt: 'Escalating to a VP so your practice gets mandated across teams is a strong influence-without-authority story.',
      answer: false,
      explanation:
        'It answers the question by borrowing authority, the opposite of the skill being probed. Escalation can appear in a story only as a last resort after evidence and alignment failed, framed as raising a decision, not winning a fight.',
    },
    {
      id: 'bss-mentorship-signal',
      type: 'mcq',
      prompt: 'What are interviewers actually listening for in a mentorship story?',
      choices: [
        'Multiplied impact: the person you grew now ships independently, and something you taught spread beyond them',
        'That you are generous with your time and patient with juniors',
        'The number of people you have formally mentored',
        'That you left detailed, thoughtful code review comments',
      ],
      answer: 0,
      explanation:
        'Kindness is table stakes, not a signal. A senior mentorship story ends with a delta: the mentee owns an area, leads the next project, or a practice you taught became how the team works. Measure the mentee\'s trajectory, not your effort.',
    },
    {
      id: 'bss-tf-mentor-time',
      type: 'tf',
      prompt: 'The strength of a mentorship story is roughly proportional to how much time you spent helping.',
      answer: false,
      explanation:
        'Hours invested measure cost, not impact. Two pairing sessions that unblocked someone who then led the next project beat a year of hand-holding. Frame the outcome for the mentee and the team, not your generosity.',
    },
    {
      id: 'bss-boring-tech',
      type: 'mcq',
      prompt: 'You chose Postgres over a trendy new datastore for a new service. Told well, what does that choice signal?',
      choices: [
        'Deliberate judgment: known failure modes and team familiarity were weighed as features, and you can name what would flip the decision',
        'Risk aversion: seniors avoid new technology',
        'You lacked experience with the newer option',
        'Nothing: technology choices are not behavioral signals',
      ],
      answer: 0,
      explanation:
        'The senior version names the tradeoff: what the shiny option offered, why it was not worth its operational unknowns here, and the conditions that would change the answer. "Chose boring, on purpose, for reasons" is judgment; "always choose boring" is dogma.',
    },
    {
      id: 'bss-kill-project',
      type: 'flash',
      front: '"Tell me about a project you killed or argued to stop." Why is this asked, and what does a good answer include?',
      back: 'It probes whether your judgment beats your sunk-cost attachment.\n1. Stakes: what the project was and what you personally had invested in it.\n2. Signal: the data or user evidence that said it would not pay off.\n3. Call: you proposed stopping and said it plainly to the people who funded it.\n4. Salvage: what was reused, learned, or redirected.\nKilling your own work lands harder than killing someone else\'s.',
    },
    {
      id: 'bss-migration-order',
      type: 'order',
      prompt: 'Sequence a safe migration from an old system to a new one.',
      items: [
        'Stand up the new system behind the old interface',
        'Dual-write to old and new',
        'Backfill history and verify the systems agree',
        'Shift reads over gradually, watching for divergence',
        'Retire the old system and remove dual-write',
      ],
      explanation:
        'The senior signal is sequencing for reversibility: at every step you can still fall back to the old system. The big-bang cutover is the mid-level version of this story.',
    },
    {
      id: 'bss-90-days-order',
      type: 'order',
      prompt: 'Order a strong answer to "what would you do in your first 90 days?"',
      items: [
        'Learn the system, the customers, and how decisions get made',
        'Ship something small early to learn the delivery path',
        'Identify the highest-leverage problem nobody owns',
        'Get buy-in on a plan for it',
        'Deliver, and report results against that plan',
      ],
      explanation:
        'Listen → small win → leverage → delivery. The trap answers are "rewrite everything" (arrogance before context) and "just ramp up" (no ownership). Naming buy-in before execution is the senior tell.',
    },
    {
      id: 'bss-competing-priorities',
      type: 'mcq',
      prompt: 'Two stakeholders each insist their feature is your top priority, and there is capacity for one. Best move?',
      choices: [
        'Make the conflict visible: frame the tradeoff with shared criteria, bring a recommendation, and have the person who owns both priorities decide explicitly',
        'Quietly interleave both so neither notices the slip',
        'Do whichever stakeholder is more senior',
        'Escalate to your manager immediately and let them sort it out',
      ],
      answer: 0,
      explanation:
        'Splitting capacity quietly ships neither well and hides the real cost, and rank is not a prioritization framework. Escalating bare ("they both want things") moves the problem upstairs unframed. Do the framing work first, then let the owner of both decide.',
    },
    {
      id: 'bss-leaving-why-us',
      type: 'flash',
      front: 'How do you answer "why are you leaving?" and "why us?" without negativity?',
      back: 'Run toward, not away.\nLeaving: one neutral sentence about what you have finished growing into ("I have taken X as far as this role allows"), then pivot to what you want next. No complaints about management, comp, or coworkers: interviewers project that negativity onto their own future exit interview with you.\nWhy us: name something specific (the product, the scale, the problem space, evidence about the engineering culture) and connect it to the thing you just said you want next. The two answers should snap together.',
    },
    {
      id: 'bss-good-questions',
      type: 'flash',
      front: 'What do strong candidates ask the interviewer at the end?',
      back: 'Questions that show you are already evaluating the work like an insider:\n1. "What separates the best engineers here from the merely good ones?"\n2. "What is the hardest problem the team faces in the next year?"\n3. "How do decisions like X actually get made here?"\n4. "What would I own in the first six months?"\nSkip anything the job posting answers, and save perks for the recruiter. Asking about failure modes and decision-making is itself a level signal.',
    },
    {
      id: 'bss-comp-deflect',
      type: 'flash',
      front: 'A recruiter asks for your salary expectations on the first call. How do you handle it without anchoring low or seeming evasive?',
      back: 'Deflect once, politely and with a reason: "I would rather confirm the fit first; I am confident we can align on comp if we get there. Can you share the band for the role?" Many jurisdictions now require a posted range, so asking for theirs is normal. If pressed a second time, give a researched range with the floor at your true target: two refusals starts to read adversarial. Never volunteer your current salary.',
    },
    {
      id: 'bss-headline-first',
      type: 'flash',
      front: 'What does the structure of your answers signal, independent of their content?',
      back: 'Headline first, detail on request: "We cut deploy time from an hour to five minutes; the interesting part was the rollback design. Want the detail?" A chronological ramble makes the interviewer do the summarizing, which reads mid regardless of the story underneath. Senior communication is bottom-line-up-front, so structure is itself evidence. Have a 30-second headline version of every story with a 3-minute expansion behind it.',
    },
  ],
};
