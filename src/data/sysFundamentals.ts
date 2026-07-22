import type { Deck } from '../types';

export const sysFundamentals: Deck = {
  id: 'sys-fundamentals',
  title: 'System Design Fundamentals',
  description: 'How to open a design interview and the vocabulary every answer needs.',
  icon: '🏗️',
  color: '#60a5fa',
  track: 'System Design',
  cards: [
    {
      id: 'sdf-first-five',
      type: 'flash',
      front: 'How do you spend the first five minutes of a system design interview?',
      back: '1) Functional requirements: what the system does; pick the 2-3 core features.\n2) Non-functional requirements: scale, latency targets, availability, consistency needs.\n3) Numbers: DAU, read/write ratio, data size per item.\n4) Confirm scope out loud: "I will focus on X and Y, skipping Z."\nInterviewers grade the questions as much as the boxes; designing before scoping is the classic way to fail the round.',
    },
    {
      id: 'sdf-func-vs-nonfunc',
      type: 'mcq',
      prompt: 'Which of these is a NON-functional requirement?',
      choices: [
        '99.9% availability with p99 latency under 200 ms',
        'Users can follow other users',
        'Posts support image attachments',
        'Admins can delete any post',
      ],
      answer: 0,
      explanation:
        'Functional = what the system does (features). Non-functional = how well it does it (scale, latency, availability, durability, consistency). Ask for both before drawing anything; the non-functional side is what actually shapes the architecture.',
    },
    {
      id: 'sdf-read-write-ratio',
      type: 'mcq',
      prompt: 'Why ask for the read/write ratio before designing anything?',
      choices: [
        'It decides the architecture: read-heavy favors caching and replicas, write-heavy favors queues and partitioning',
        'It determines which programming language to use',
        'It is only needed to price the hardware',
        'It only matters for SQL databases',
      ],
      answer: 0,
      explanation:
        'Most consumer systems are read-heavy (100:1 is common), which is why "cache it and add read replicas" is so often the right first move. Write-heavy systems (metrics ingestion, chat) push toward queues and sharding instead.',
    },
    {
      id: 'sdf-qps-formula',
      type: 'fill',
      prompt: 'Back-of-envelope QPS from daily actives:',
      code: 'avg_qps = dau * actions_per_day / ____\npeak_qps = 2-3x avg_qps',
      answers: ['86400'],
      distractors: ['3600', '1440', '1000000'],
      explanation:
        '86,400 seconds per day; round to 100k for mental math. 10M DAU x 10 actions is about 1,200 avg QPS, and you assume peak is 2-3x average unless told otherwise.',
    },
    {
      id: 'sdf-storage-math',
      type: 'mcq',
      prompt: '1 million new 1 KB records per day. Roughly how much storage over 5 years?',
      choices: [
        '~2 TB: 1 GB/day, times 365, times 5, rounded up',
        '~20 GB',
        '~200 TB',
        '~2 PB',
      ],
      answer: 0,
      explanation:
        'Chain the units: 1M x 1 KB = 1 GB/day; x365 is ~365 GB/year; x5 is ~1.8 TB. Round aggressively and narrate the rounding; the method is the point, not the precision.',
    },
    {
      id: 'sdf-latency-numbers',
      type: 'flash',
      front: 'Which latency numbers are worth memorizing, and what are they?',
      back: 'Powers of ten:\n1) Memory reference: ~100 ns.\n2) SSD random read: ~100 us (1,000x memory).\n3) Round trip within one datacenter: ~0.5 ms.\n4) Cross-region round trip: ~50-150 ms (crossing an ocean, ~100 ms).\nThe ratios justify designs: an in-memory cache beats disk by 1,000x, and any chatty cross-region protocol is dead on arrival.',
    },
    {
      id: 'sdf-latency-ladder',
      type: 'order',
      prompt: 'Order from fastest to slowest.',
      items: [
        'Main memory reference',
        'SSD random read',
        'Same-datacenter round trip',
        'Cross-region round trip',
      ],
      explanation:
        'Roughly 100 ns, 100 us, 500 us, 100 ms. Each jump is exactly what a cache layer or a region-local replica is buying you.',
    },
    {
      id: 'sdf-cap-statement',
      type: 'flash',
      front: 'State the CAP theorem precisely, the way an interviewer wants to hear it.',
      back: 'During a network partition, a distributed system must choose between consistency (every read sees the latest write) and availability (every request gets a response). Partition tolerance is not a choice: networks fail, so any distributed system must tolerate partitions. The real question is behavior WHILE partitioned: refuse some requests (CP) or serve possibly-stale data (AP).',
    },
    {
      id: 'sdf-cap-ca',
      type: 'tf',
      prompt: 'A distributed system can pick CA from the CAP theorem and simply opt out of partition tolerance.',
      answer: false,
      explanation:
        'Partitions are a fact of networks, not an option. "CA" only describes a single-node system. The honest framing: when a partition happens, do you sacrifice consistency to stay available, or availability to stay consistent?',
    },
    {
      id: 'sdf-strong-vs-eventual',
      type: 'flash',
      front: 'Strong vs eventual consistency: define both and name the cost of each.',
      back: 'Strong: every read returns the latest write, as if one copy existed. Cost: coordination on every write, higher latency, reduced availability under partitions.\nEventual: replicas converge once writes stop; reads may be stale in between. Cost: the application must tolerate staleness and resolve conflicts.\nDefault mapping: eventual for feeds, likes, counters; strong for money, inventory, and auth.',
    },
    {
      id: 'sdf-read-your-writes',
      type: 'mcq',
      prompt: 'A user updates their profile photo, refreshes, and briefly sees the old photo. What is happening, and what guarantee fixes it?',
      choices: [
        'A stale read from a lagging replica; read-your-writes consistency (route the user\'s own reads to the primary) fixes it',
        'Strong consistency working as intended',
        'A CAP violation with no possible fix',
        'Purely browser caching, so no server-side fix exists',
      ],
      answer: 0,
      explanation:
        'The write hit the primary but the read hit a replica that had not caught up. Read-your-writes is the targeted fix: serve a user\'s own data from the primary or a caught-up replica, without paying for strong consistency everywhere.',
    },
    {
      id: 'sdf-latency-vs-throughput',
      type: 'tf',
      prompt: 'Latency and throughput are the same property viewed two ways: improving one always improves the other.',
      answer: false,
      explanation:
        'Latency is time per request; throughput is requests per unit time. Batching raises throughput while worsening per-request latency, and adding servers raises throughput without making any single request faster. Say which one the requirement actually constrains.',
    },
    {
      id: 'sdf-sli-slo-sla',
      type: 'flash',
      front: 'SLI vs SLO vs SLA: what does each one mean?',
      back: 'SLI (indicator): the measurement, e.g. the fraction of requests served under 200 ms.\nSLO (objective): the internal target for that measurement, e.g. 99.9% over 30 days.\nSLA (agreement): the external contract, with penalties, built on top of SLOs.\nSet internal SLOs tighter than the SLA so your own alarm fires before the contract is breached.',
    },
    {
      id: 'sdf-scaling-tradeoff',
      type: 'mcq',
      prompt: 'Vertical vs horizontal scaling: the core tradeoff?',
      choices: [
        'Vertical is simple but hits a hardware ceiling and stays one failure domain; horizontal scales further but buys distributed-systems problems',
        'Horizontal is strictly better at any size',
        'Vertical is always the cheaper option',
        'They are interchangeable, so the choice never matters',
      ],
      answer: 0,
      explanation:
        'The mature answer names the cost of going horizontal: with many nodes you now own load balancing, data distribution, and consistency. Scaling up first is often correct until the ceiling or the single-point-of-failure risk forces scaling out.',
    },
    {
      id: 'sdf-load-balancer',
      type: 'mcq',
      prompt: 'What does a load balancer actually contribute to the design?',
      choices: [
        'Spreads requests across servers, health-checks them, and routes around dead instances, so a fleet looks like one endpoint',
        'Caches responses so servers do less work',
        'Stores session state for the servers behind it',
        'Makes each individual request complete faster',
      ],
      answer: 0,
      explanation:
        'Distribution plus failure detection: it is what makes horizontal scaling and rolling deploys work. It does not speed up a single request, and it pays off most when servers are stateless so any request can go to any instance.',
    },
    {
      id: 'sdf-stateless',
      type: 'flash',
      front: 'Stateless vs stateful services: what is the difference, and why does stateless scale better?',
      back: 'Stateless: no session data lives on the server; state moves to the client (tokens) or a shared store (Redis, database), so any instance can serve any request.\nStateful: requests must reach the instance holding their state (sticky sessions, open chat connections).\nStateless scales by just adding instances behind a load balancer, and losing a node loses nothing. Stateful means routing, replication, and failover for the state itself.',
    },
    {
      id: 'sdf-idempotency',
      type: 'flash',
      front: 'What is idempotency, and why do retries require it?',
      back: 'An operation is idempotent when doing it twice has the same effect as doing it once. A timeout never tells the client whether the operation happened, so every sane client retries; without idempotency, retries mean double charges and duplicate orders.\nStandard fix: the client sends an idempotency key, the server stores the key with the result, and repeats return the stored result instead of re-executing.',
    },
    {
      id: 'sdf-whiteboard-flow',
      type: 'order',
      prompt: 'The standard order of a 45-minute design interview.',
      items: [
        'Clarify functional and non-functional requirements',
        'Estimate scale: QPS, storage, read/write ratio',
        'Sketch the API',
        'Draw the high-level boxes',
        'Deep-dive the hot paths',
        'Address bottlenecks and failure modes',
      ],
      explanation:
        'Requirements before estimates, estimates before boxes: the numbers decide the architecture. Jumping straight to boxes is the classic junior mistake.',
    },
  ],
};
