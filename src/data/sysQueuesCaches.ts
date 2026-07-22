import type { Deck } from '../types';

export const sysQueuesCaches: Deck = {
  id: 'sys-queues-caches',
  title: 'Queues, Caches & Events',
  description: 'The asynchrony layer: caching patterns, message queues, and the delivery guarantees everyone gets wrong.',
  icon: '📬',
  color: '#fbbf24',
  track: 'System Design',
  cards: [
    {
      id: 'sdq-write-strategies',
      type: 'flash',
      front: 'Cache-aside vs write-through vs write-behind: how does each write path work, and who owns consistency?',
      back: '1) Cache-aside: the app writes the DB, then invalidates the cache; the APP owns consistency, and the next read repopulates on miss.\n2) Write-through: every write goes through the cache to the DB synchronously; the CACHE owns consistency, at the cost of write latency.\n3) Write-behind: the cache acks the write and flushes to the DB later; fastest writes, but a cache crash loses acked data, so nobody owns consistency until the flush lands.',
    },
    {
      id: 'sdq-invalidation-ttl',
      type: 'mcq',
      prompt: 'Why is a plain TTL called the "honest default" for cache invalidation?',
      choices: [
        'It admits staleness up front: you bound how wrong the cache can be, instead of pretending explicit invalidation covers every write path',
        'TTLs make cached data strongly consistent with the database',
        'Explicit invalidation is impossible in distributed systems',
        'TTL exists mainly to limit memory growth',
      ],
      answer: 0,
      explanation:
        'Explicit invalidation must fire on every code path that mutates the data; one missed path means unbounded staleness. TTL caps staleness at a known worst case, and real systems usually combine both.',
    },
    {
      id: 'sdq-lru-vs-lfu',
      type: 'mcq',
      prompt: 'When does LRU eviction lose to LFU?',
      choices: [
        'When a one-off scan touches many cold keys once, flushing the genuinely hot set (scan pollution)',
        'When access patterns shift quickly, since LRU cannot adapt',
        'LFU is always better; LRU survives only because it is simpler',
        'When cached values vary a lot in size',
      ],
      answer: 0,
      explanation:
        'LRU equates "touched just now" with "hot", so a batch scan evicts the real working set. LFU resists scans but clings to formerly-hot keys, which is why production caches use hybrids like TinyLFU or segmented LRU.',
    },
    {
      id: 'sdq-stampede',
      type: 'flash',
      front: 'A hot cache key expires and 2,000 concurrent requests hit the database at once. Name the problem and three mitigations.',
      back: 'Cache stampede (thundering herd).\n1) Locking: one request takes a mutex and recomputes; the rest wait or serve stale.\n2) Request coalescing: collapse concurrent misses for the same key into one backend call.\n3) Jittered TTLs: randomize expiry so hot keys do not expire together.\nStale-while-revalidate is the common production combo: return the old value while a single worker refreshes it.',
    },
    {
      id: 'sdq-ttl-jitter',
      type: 'tf',
      prompt: 'Giving every cache entry the same fixed TTL is safe because expiries are predictable.',
      answer: false,
      explanation:
        'Keys cached together expire together, so a deploy or cold start creates a synchronized wave of misses that stampedes the database. Adding random jitter to each TTL spreads the wave out.',
    },
    {
      id: 'sdq-redis-uses',
      type: 'mcq',
      prompt: 'Beyond caching, which is a canonical Redis use case?',
      choices: [
        'Leaderboards via sorted sets: ZADD to score, ZREVRANGE for top-N, O(log n) per update',
        'System-of-record storage for relational data',
        'Full-text search over documents out of the box',
        'Joins across normalized tables',
      ],
      answer: 0,
      explanation:
        'Redis is a data-structure server: sorted sets for leaderboards and rate limiters, INCR for atomic counters, SET NX EX for distributed locks, lists and streams for lightweight queues. Persistence (RDB/AOF) exists but it is not the system of record.',
    },
    {
      id: 'sdq-redis-lock',
      type: 'fill',
      prompt: 'Acquire a Redis lock only if the key does not already exist, with an auto-expiring safety timeout:',
      code: 'SET lock:report42 <token> ____ EX 30',
      answers: ['NX'],
      distractors: ['XX', 'GET', 'KEEPTTL', 'PX'],
      explanation:
        'NX makes SET succeed only when the key is absent (an atomic acquire); EX 30 guarantees the lock dies if the holder crashes. Release must verify the token before DEL, or you delete someone else\'s lock.',
    },
    {
      id: 'sdq-queue-vs-pubsub',
      type: 'mcq',
      prompt: 'The core semantic difference between a message queue and pub/sub?',
      choices: [
        'Queue: each message goes to exactly one worker (competing consumers). Pub/sub: every subscriber gets its own copy',
        'Queues are durable, pub/sub never is',
        'Pub/sub is faster because it skips acknowledgments',
        'Queues push to consumers, pub/sub makes consumers poll',
      ],
      answer: 0,
      explanation:
        'Queues distribute work; pub/sub broadcasts facts. Kafka blurs the line: within one consumer group you get queue semantics, across groups you get pub/sub.',
    },
    {
      id: 'sdq-exactly-once',
      type: 'flash',
      front: 'An interviewer asks for "exactly-once delivery". Why is it a myth, and what does exactly-once processing actually require?',
      back: 'Delivery cannot be exactly-once: if an ack is lost, the broker cannot know whether the consumer processed the message, so it must redeliver (at-least-once) or drop (at-most-once). It is the Two Generals problem in disguise.\nExactly-once PROCESSING is achievable at the application layer:\n1) At-least-once delivery underneath.\n2) Idempotent handlers, so a repeat has no extra effect.\n3) Dedup: track processed message ids, or use natural idempotency keys.',
    },
    {
      id: 'sdq-idempotency',
      type: 'mcq',
      prompt: 'A payment worker may receive the same "charge card" message twice. The correct fix?',
      choices: [
        'Attach an idempotency key; the handler records completed keys so the second attempt becomes a no-op',
        'Switch the queue to exactly-once delivery mode',
        'Have the producer wait for the consumer to finish before sending the next message',
        'Lower the redelivery timeout so duplicates arrive sooner',
      ],
      answer: 0,
      explanation:
        'Duplicates are a fact of at-least-once systems, so correctness must live in the handler. An idempotency key plus a processed-keys table, checked and written in the same transaction as the charge, is the standard answer.',
    },
    {
      id: 'sdq-delivery-tradeoff',
      type: 'mcq',
      prompt: 'When is at-most-once delivery the right choice over at-least-once?',
      choices: [
        'When a lost message is cheaper than a duplicate and staleness heals itself, like metrics or presence pings',
        'For payments, where duplicates are unacceptable',
        'Never; at-least-once strictly dominates',
        'Whenever the consumer is already idempotent',
      ],
      answer: 0,
      explanation:
        'At-least-once trades duplicates for no loss; at-most-once trades loss for no duplicates. Telemetry, live location, and heartbeats tolerate loss fine. Payments want at-least-once PLUS idempotency, and an idempotent consumer is exactly why you would keep at-least-once, not drop it.',
    },
    {
      id: 'sdq-dlq',
      type: 'mcq',
      prompt: 'What problem does a dead letter queue solve?',
      choices: [
        'A poison message that fails every retry would block or churn the queue forever; after N attempts it is parked for inspection',
        'It keeps a backup copy of every message for disaster recovery',
        'It stores messages for consumers that are offline',
        'It reorders failed messages back into sequence',
      ],
      answer: 0,
      explanation:
        'Move-after-N-failures keeps the main queue flowing and preserves the evidence. A DLQ needs an owner: alert on depth, diagnose, then redrive or discard. An unmonitored DLQ is just slow data loss.',
    },
    {
      id: 'sdq-backpressure',
      type: 'flash',
      front: 'Why should queues be bounded, and what is backpressure?',
      back: 'An unbounded queue does not absorb overload, it hides it: latency grows until memory dies, turning "some requests rejected" into "everything down". A bounded queue forces an explicit policy when full:\n1) Block the producer: backpressure, slowing the source to the consumer\'s pace.\n2) Shed load: reject with a fast error.\n3) Degrade: sample, batch, or serve stale.\nBackpressure is that fullness signal propagating upstream so producers slow down instead of piling up work.',
    },
    {
      id: 'sdq-async-vs-sync',
      type: 'flash',
      front: 'Event-driven architecture vs request/response: when does async actually win, and what does it cost?',
      back: 'Async wins when: the caller does not need the result to respond (emails, thumbnails), producers spike beyond consumer capacity (the queue is a buffer), or many consumers care about one fact (decoupling).\nIt costs: no immediate error path back to the caller, eventual consistency, and debugging turns from one stack trace into correlating events across services. If the user is waiting on the answer, request/response is usually the honest design.',
    },
    {
      id: 'sdq-outbox',
      type: 'order',
      prompt: 'Reliable publish with the outbox pattern: order the steps.',
      items: [
        'Write the business row and an event row in one transaction',
        'Commit; the event is now durable with the data',
        'A relay polls the outbox table (or tails the WAL)',
        'The relay publishes the event to the broker',
        'Mark the outbox row sent after the broker acks',
      ],
      explanation:
        'The pattern exists because "commit DB, then publish" can crash in between and silently drop the event. One local transaction plus an async relay gives at-least-once publish, so consumers still need dedup.',
    },
    {
      id: 'sdq-kafka-model',
      type: 'flash',
      front: 'Give the Kafka mental model in four ideas: storage, parallelism, consumption, ordering.',
      back: '1) Storage: a topic is an append-only log; messages are not deleted on read, retention is by time or size, so consumers can replay.\n2) Parallelism: topics split into partitions; a message key hashes to a partition.\n3) Consumption: consumers track their own offsets; within a consumer group each partition goes to one consumer, so partition count caps parallelism.\n4) Ordering: guaranteed only within a partition, so choose the key (user id, order id) to match the ordering you need.',
    },
    {
      id: 'sdq-kafka-ordering',
      type: 'tf',
      prompt: 'Kafka guarantees message ordering across an entire topic.',
      answer: false,
      explanation:
        'Ordering holds only within a single partition. Events with the same key hash to the same partition, so per-user or per-order ordering works; global ordering would require one partition, which kills parallelism.',
    },
    {
      id: 'sdq-feed-fanout',
      type: 'order',
      prompt: 'News feed with fan-out on write: order the pipeline.',
      items: [
        'Author posts; the service persists the post once',
        'Fetch the author\'s follower list',
        'Push the post id into each follower\'s feed cache',
        'A follower opens the app and reads a precomputed feed',
      ],
      explanation:
        'Fan-out on write buys O(1) reads by paying at post time; a celebrity with 50M followers makes that write explode. Real feeds go hybrid: fan-out on write for normal users, fan-out on read (merge at request time) for celebrity posts.',
    },
  ],
};
