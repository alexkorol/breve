import type { Deck } from '../types';

export const behConflictFailure: Deck = {
  id: 'beh-conflict-failure',
  title: 'Conflict, Failure & Pushback',
  description: 'The questions that filter candidates: disagreements, mistakes, and saying no.',
  icon: '🔥',
  color: '#ef4444',
  track: 'Behavioral',
  cards: [
    {
      id: 'bcf-conflict-screen',
      type: 'flash',
      front: '"Tell me about a conflict with a coworker." What is the interviewer actually screening for?',
      back: 'Three screens:\n1) Escalation judgment: did you try to resolve it directly before pulling in a manager?\n2) Empathy: can you state the other person\'s position fairly, the way they would state it?\n3) Resolution ownership: did YOU move it forward, or did it dissolve on its own?\nThe content of the disagreement barely matters; how you behaved inside it is the answer.',
    },
    {
      id: 'bcf-conflict-trap',
      type: 'mcq',
      prompt: 'The most common trap in conflict stories?',
      choices: [
        'Picking a story where the other person was simply wrong and you were right',
        'Picking a conflict that was too small to matter',
        'Admitting the conflict got tense',
        'Choosing a conflict with a manager instead of a peer',
      ],
      answer: 0,
      explanation:
        'A story with a villain proves you can win, not that you can resolve. If the other side had no legitimate point, there was no real conflict to navigate. Pick one where both positions had a case.',
    },
    {
      id: 'bcf-disagree-commit',
      type: 'flash',
      front: 'What does "disagree and commit" look like concretely, after the decision goes against you?',
      back: '1) Voice the disagreement fully before the decision: reasons, plus what evidence would change your mind.\n2) Once decided, execute the chosen path at full effort: no quiet sandbagging, no told-you-so setups.\n3) Represent the decision as ours, not theirs, to the rest of the team.\n4) If new evidence appears, reopen it once, with data, through the decider.\nCommitting means the plan gets your best work even while you think it is second-best.',
    },
    {
      id: 'bcf-escalate-when',
      type: 'mcq',
      prompt: 'You disagree with a senior engineer\'s design call. When is escalating (rather than letting go) the right move?',
      choices: [
        'When the decision is high-cost, hard to reverse, and your concern was heard but not addressed',
        'Whenever you are confident you are right',
        'Never: seniority settles technical debates',
        'Only after the decision has visibly failed',
      ],
      answer: 0,
      explanation:
        'Escalate on irreversibility and blast radius, not on confidence. Reversible, contained decisions are cheap to be wrong about: let those go and revisit with data if reality disagrees.',
    },
    {
      id: 'bcf-failure-anatomy',
      type: 'flash',
      front: '"Tell me about a failure." What must the story contain to score?',
      back: 'Four parts:\n1) A real decision you made that was wrong, with real cost: missed deadline, lost users, rework.\n2) The moment you realized it and what you did in the next 48 hours.\n3) The root cause stated as your behavior, not circumstances.\n4) The specific habit you changed, with evidence it stuck.\nInterviewers grade the ownership and the behavior change, not the size of the crater.',
    },
    {
      id: 'bcf-sanitized-failure',
      type: 'mcq',
      prompt: 'Which failure story scores zero with experienced interviewers?',
      choices: [
        '"I worked so hard I burned out": a strength disguised as a failure, with no wrong decision to own',
        'A project that shipped late because of your estimate',
        'A bug you wrote that caused an outage',
        'A hire you championed who did not work out',
      ],
      answer: 0,
      explanation:
        'Sanitized failures (perfectionism, caring too much) signal either low self-awareness or something being hidden. A scoreable failure contains a decision you would now make differently.',
    },
    {
      id: 'bcf-incident-story',
      type: 'flash',
      front: 'How do you tell a production incident story well?',
      back: '1) Impact first: what broke, for whom, for how long.\n2) Your specific role: what you personally diagnosed, decided, or communicated (not "we" for everything).\n3) Blameless framing: name process gaps, not people.\n4) The postmortem change that stuck: a guardrail, alert, or checklist that exists today because of it.\nA story that ends at "we fixed it" is half a story; the durable change is the point.',
    },
    {
      id: 'bcf-tf-blameless',
      type: 'tf',
      prompt: 'Blameless incident framing means avoiding any mention of what you personally got wrong.',
      answer: false,
      explanation:
        'Blameless means not scapegoating individuals for systemic gaps. Owning your own mistake is still expected: "I merged without checking the flag" plus the process fix is the strongest form of the story.',
    },
    {
      id: 'bcf-harsh-feedback',
      type: 'flash',
      front: 'Tell me about a time you received harsh feedback. What does a strong answer show?',
      back: '1) The feedback stated plainly, uncushioned, as it was delivered.\n2) Your first reaction, honestly (defensiveness is fine to admit).\n3) The test you applied: was it true? You looked for evidence instead of arguing.\n4) The concrete change, and a later moment proving it stuck.\nThe signal is whether feedback changes your behavior or only your mood.',
    },
    {
      id: 'bcf-give-feedback',
      type: 'flash',
      front: 'How do you describe giving hard feedback to a peer?',
      back: '1) Privately and promptly, as behavior plus impact: "when X happened, it cost Y."\n2) No triangulating through the manager first, and no sandwich that buries the message.\n3) You asked for their read; missing context sometimes changes yours.\n4) You followed up later and named the improvement when it came.\nInterviewers listen for whether you treated the peer as an adult or as a problem to route around.',
    },
    {
      id: 'bcf-deadline-push',
      type: 'mcq',
      prompt: 'A stakeholder sets a deadline you believe is unrealistic. Strongest response?',
      choices: [
        'Offer the tradeoff menu: reduced scope by that date, full scope later, or more people, and let them pick',
        'Accept it and quietly plan for the slip',
        'Refuse flatly: bad estimates should not be rewarded',
        'Agree, then cut testing to make the date',
      ],
      answer: 0,
      explanation:
        'A flat no reads as unhelpful; silent acceptance sets everyone up to fail. Naming scope, time, and quality as the movable levers turns a confrontation into a decision the stakeholder owns.',
    },
    {
      id: 'bcf-underperformer',
      type: 'mcq',
      prompt: 'A teammate at your level is underperforming and the slack is landing on you. First move?',
      choices: [
        'Talk to them directly and privately; ask what is going on before diagnosing',
        'Tell your manager first so the problem is documented',
        'Silently absorb the extra work to protect the team',
        'Raise it in retro so the whole team can weigh in',
      ],
      answer: 0,
      explanation:
        'Peer-first respects them and often surfaces a blocker you could not see: unclear priorities, personal issues, a dependency. Escalation is round two, after the direct conversation fails, and you tell them you are escalating.',
    },
    {
      id: 'bcf-wrong-debate',
      type: 'flash',
      front: 'Describe a technical debate you lost, and were wrong. What does the strong version include?',
      back: '1) The position you held and why it seemed right at the time (a reasonable prior, not a lazy one).\n2) The specific evidence that flipped you: a benchmark, an outage, a user metric.\n3) How fast you updated once the evidence landed: publicly, without face-saving hedges.\n4) What it changed about how you argue now, e.g. stating up front what would change your mind.\nUpdating quickly on evidence is the trait being probed; the original wrongness is fine.',
    },
    {
      id: 'bcf-tf-no-conflict',
      type: 'tf',
      prompt: '"We have a great team, we never really disagree" is a safe answer to conflict questions.',
      answer: false,
      explanation:
        'It reads as low self-awareness or conflict avoidance, and both are disqualifying for senior roles. Every functioning team disagrees; the question asks for proof you can do it well.',
    },
    {
      id: 'bcf-red-flags',
      type: 'mcq',
      prompt: 'Which answer pattern gets a conflict or failure story rejected outright?',
      choices: [
        'Badmouthing the other party: "my manager was incompetent, so..."',
        'Admitting the conflict took weeks to resolve',
        'A failure whose cost was real money',
        'Saying you escalated after direct conversation failed',
      ],
      answer: 0,
      explanation:
        'Badmouthing, victim narratives ("politics killed it"), and villain stories predict how you will describe THIS team in two years. A fair, neutral account of the other side is part of what is being assessed.',
    },
    {
      id: 'bcf-order-conflict-arc',
      type: 'order',
      prompt: 'Order the beats of a strong conflict answer.',
      items: [
        'Context: the decision and what was at stake',
        'The other side\'s case, stated fairly',
        'Your case and the real crux',
        'What you did to move it forward',
        'Resolution and the working relationship after',
      ],
      explanation:
        'Stating their case before yours is the empathy signal; ending on the relationship shows the conflict was resolved, not just won.',
    },
    {
      id: 'bcf-order-failure-arc',
      type: 'order',
      prompt: 'Order the beats of a strong failure answer.',
      items: [
        'The call you made and why it seemed right',
        'What went wrong and its real cost',
        'Immediate recovery actions',
        'Root cause, owned as your behavior',
        'The changed habit, with proof it stuck',
      ],
      explanation:
        'Cost, ownership, then change: told in that order, the story answers the interviewer\'s follow-up probes before they are asked.',
    },
  ],
};
