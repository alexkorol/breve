import type { Deck } from '../types';

export const sysCaseDrills: Deck = {
  id: 'sys-case-drills',
  title: 'Design Case Drills',
  description: 'The classic prompts, drilled: the approach, the key decision, and the follow-up trap for each.',
  icon: '📐',
  color: '#a78bfa',
  track: 'System Design',
  cards: [
    {
      id: 'sdc-shortener-open',
      type: 'order',
      prompt: 'Order the model opening for "Design a URL shortener."',
      items: [
        'Clarify scale: writes/sec, read:write ratio, code length',
        'API: POST long URL returns a code; GET code redirects',
        'Storage: one table mapping code to long URL, codes generated deliberately',
        'Read path: cache hot code-to-URL mappings in Redis',
      ],
      explanation:
        'Naming the read-heavy skew (often 100:1) early justifies the cache and frames every later choice.',
    },
    {
      id: 'sdc-shortener-keygen',
      type: 'mcq',
      prompt: 'Best way to generate short codes at scale?',
      choices: [
        'Pre-allocated counter ranges (or a key service) per app server, encoded base62',
        'MD5 the long URL and keep the first 7 characters, so the same URL always maps to the same code',
        'One global auto-increment counter queried on every request, since it guarantees unique sequential codes',
        'Random 7-char strings with no collision check; the keyspace is too large for collisions to matter',
      ],
      answer: 0,
      explanation:
        'Truncated hashes collide and force retry logic; a single global counter is a bottleneck and a single point of failure; unchecked randoms collide eventually. Batched ranges give collision-free codes with no per-request coordination. Volunteer the capacity math: 62 characters, so 62^7 is about 3.5 trillion codes.',
    },
    {
      id: 'sdc-shortener-redirect',
      type: 'tf',
      prompt: 'For the redirect response, HTTP 301 is the safe default: browsers cache it, so your servers see less repeat traffic.',
      answer: false,
      explanation:
        'The trap: a cached 301 means repeat visitors never hit your server again, so click analytics silently undercount. If click data matters (it usually does for a shortener), return 302 so every hit reaches you; choose 301 only when minimizing load beats measurement. Interviewers ask this to see whether you connect an HTTP detail to a business requirement.',
    },
    {
      id: 'sdc-ratelimit-open',
      type: 'flash',
      front: '"Design a rate limiter." Model opening: where does it live and what state does it keep?',
      back: '1) Placement: middleware at the API gateway, in front of the services; rejected requests get 429 plus a Retry-After header.\n2) Algorithm: token bucket (permits short bursts) or sliding window; name one and its tradeoff.\n3) State: in Redis, keyed per client: current token count plus last-refill timestamp. Refill lazily when a request arrives; no background timers.\n4) Limits (per endpoint, per tier) live in config, not code, so rules change without deploys.',
    },
    {
      id: 'sdc-ratelimit-race',
      type: 'mcq',
      prompt: 'Two gateway nodes both read a Redis counter at 9 of 10, both allow the request, both write back 10. Standard fix?',
      choices: [
        'Make check-and-update one atomic Redis operation: a Lua script, or INCR with EXPIRE',
        'Wrap every request in a distributed lock so only one gateway node can touch the counter at a time',
        'Give each gateway node its own local counter to eliminate the shared-state race entirely',
        'Lower the configured limit to leave headroom for the occasional double-grant',
      ],
      answer: 0,
      explanation:
        'Read-then-write across nodes is a race; the fix is pushing the entire decision into a single atomic operation on the shared store. Locks work but tax every request with extra round trips; per-node counters let n nodes each grant the full limit.',
    },
    {
      id: 'sdc-feed-approach',
      type: 'order',
      prompt: 'Order the approach for "Design a news feed."',
      items: [
        'Clarify scale and the read:write skew',
        'Data model: users, follows, posts',
        'Choose fan-out: on write, on read, or hybrid',
        'Cache each user\'s feed as a list of post ids',
        'Paginate with cursors, not offsets',
      ],
      explanation:
        'The fan-out choice is the heart of this question; everything before it is setup and everything after is delivery.',
    },
    {
      id: 'sdc-feed-celebrity',
      type: 'mcq',
      prompt: 'Fan-out on write precomputes every feed, but one post from a 50M-follower account means 50M list writes. Standard answer?',
      choices: [
        'Hybrid: push for normal accounts, pull for high-follower accounts, merge the two at read time',
        'Switch everyone to fan-out on read, since computing feeds at request time removes the write amplification entirely',
        'Shard the follower list and fan out to all 50M anyway; enough parallel workers make the write cost invisible',
        'Cap how many followers an account can have',
      ],
      answer: 0,
      explanation:
        'Pure push melts on celebrities; pure pull makes every feed load expensive for everyone. The hybrid keeps cheap precomputed feeds for the common case and merges the few celebrity sources per read. Name it: this is the celebrity problem, and interviewers wait for the term.',
    },
    {
      id: 'sdc-chat-open',
      type: 'flash',
      front: '"Design a chat system." Why WebSockets over polling, and what is the message path?',
      back: 'Polling asks "anything new?" on a timer: wasted requests and seconds of latency. WebSockets hold one persistent duplex connection, so the server pushes the instant a message lands.\nPath: sender → chat server → message store, then push to the recipient via whichever server holds their connection. If offline: queue for later delivery and fire a push notification.\nThe piece candidates forget: a connection registry mapping user to server node, so any server can route to the right socket.',
    },
    {
      id: 'sdc-chat-ordering',
      type: 'mcq',
      prompt: 'How do you guarantee message order within a conversation?',
      choices: [
        'Per-conversation monotonic sequence numbers assigned by the server',
        'Trust client timestamps, which record the moment each user actually hit send',
        'Trust server wall-clock timestamps, since NTP keeps nodes within a few milliseconds of each other',
        'Deliver in arrival order; TCP already guarantees ordering',
      ],
      answer: 0,
      explanation:
        'Client clocks skew badly; server clocks skew across nodes too. A per-conversation counter gives a total order and lets a client detect a gap and re-fetch the missing message. TCP orders one connection, not two different senders.',
    },
    {
      id: 'sdc-chat-presence',
      type: 'flash',
      front: 'In a chat system, how do online presence and delivery receipts actually work?',
      back: 'Presence: clients heartbeat every ~30s; offline means the last heartbeat is older than the timeout. Debounce brief disconnects before broadcasting a status change, and broadcast to contacts only, never globally.\nReceipts: three states per message: sent (server stored it), delivered (recipient device acked receipt), read (recipient opened the conversation). Each state is just an ack event flowing back over the same socket.',
    },
    {
      id: 'sdc-notify-pipeline',
      type: 'order',
      prompt: 'Order the pipeline for "Design a notification system."',
      items: [
        'Ingest events from services through a queue',
        'Dedup and collapse repeated events',
        'Apply user preferences and rate caps',
        'Fan out to providers (APNs, FCM, email)',
        'Retry failures with backoff; record final status',
      ],
      explanation:
        'Preference and cap checks must come before provider fan-out: filtering after sending is not filtering. The queue up front absorbs bursts so providers see a smooth rate.',
    },
    {
      id: 'sdc-notify-retry',
      type: 'tf',
      prompt: 'When a push provider like APNs returns an error, the sender should retry immediately in a loop until the send succeeds.',
      answer: false,
      explanation:
        'Immediate retries hammer a provider that is already struggling and can double-send on ambiguous failures. Use exponential backoff with jitter, cap the attempts, then park the message in a dead-letter queue for inspection. Pair retries with an idempotency key per notification so a replay cannot notify twice.',
    },
    {
      id: 'sdc-crawler-open',
      type: 'order',
      prompt: 'Order the data flow of one crawl cycle in a web crawler.',
      items: [
        'URL frontier: the prioritized queue hands out the next URL',
        'Fetcher pool: a worker downloads the page',
        'Parser: extracts links from the page',
        'Dedup: seen-URL filter plus content fingerprints',
        'Surviving new URLs re-enter the frontier',
      ],
      explanation:
        'The frontier is the heart of the design. Politeness lives there too: honor robots.txt, rate-limit per domain, and give each host its own sub-queue.',
    },
    {
      id: 'sdc-crawler-dedup',
      type: 'mcq',
      prompt: 'A crawler needs dedup at two distinct levels. Which pair?',
      choices: [
        'Normalized seen-URLs (Bloom filter) plus content fingerprints (e.g. SimHash)',
        'Seen URLs plus seen domains, marking a whole domain as done once its pages have been fetched',
        'Exact content checksums only; refetching URLs is fine because the fetch is cheap compared to parsing',
        'A distributed lock held per URL',
      ],
      answer: 0,
      explanation:
        'URL dedup stops re-fetching, but the same content lives at many URLs (mirrors, tracking parameters), so you also fingerprint pages. A Bloom filter holds billions of URLs in little memory with no false negatives; a rare false positive just skips one URL. Exact checksums miss near-duplicates; SimHash catches them.',
    },
    {
      id: 'sdc-typeahead-decision',
      type: 'mcq',
      prompt: 'Typeahead must return suggestions within ~100ms per keystroke. The key decision?',
      choices: [
        'Serve precomputed top-k lists per prefix; rebuild them offline from query logs',
        'Walk a trie and rank every completion at query time, so results always reflect live frequencies',
        'SQL LIKE \'prefix%\' with ORDER BY frequency, which a B-tree index on the column makes fast enough',
        'Query the main search index directly per keystroke',
      ],
      answer: 0,
      explanation:
        'Collecting and ranking completions live means walking a subtree and sorting on every keystroke: too slow at scale. Store the top 5-10 per prefix (in the trie node or a prefix-to-list table) so each query is one lookup. Freshness becomes a batch job, rebuilt hourly or daily, which is acceptable for suggestions.',
    },
    {
      id: 'sdc-typeahead-topk',
      type: 'tf',
      prompt: 'Storing the top-k completions inside every trie prefix node duplicates too much data to be practical.',
      answer: false,
      explanation:
        'That duplication is the design: memory is spent deliberately so a keystroke costs one node lookup instead of a subtree walk plus sort. k stays small (5-10 entries), and the copies are rebuilt wholesale during the offline refresh, so consistency never has to be managed per write.',
    },
    {
      id: 'sdc-ids-snowflake',
      type: 'fill',
      prompt: 'Complete the Snowflake 64-bit id layout:',
      code: 'id = 1 sign bit + 41 bits timestamp\n   + 10 bits machine + ____ bits sequence',
      answers: ['12'],
      distractors: ['8', '16', '10', '32'],
      explanation:
        '12 sequence bits allow 4096 ids per machine per millisecond. The timestamp living in the high bits is what makes ids roughly sortable by creation time, the property that keeps database indexes appending instead of splitting.',
    },
    {
      id: 'sdc-ids-tradeoff',
      type: 'mcq',
      prompt: 'UUIDv4 vs Snowflake-style ids: what does Snowflake actually buy you?',
      choices: [
        'Time-ordered 64-bit ids that index well; the cost is machine-id assignment and trusting clocks',
        'Stronger randomness guarantees, since the timestamp bits add entropy a UUID does not have',
        'A lower collision probability than UUIDs, whose 122 random bits still collide at high write rates',
        'The same zero-coordination property as UUIDs',
      ],
      answer: 0,
      explanation:
        'Random UUIDs need zero coordination but are 128 bits and scatter inserts across a B-tree, causing page splits. Snowflake ids are half the size and roughly time-sorted, but you must assign machine ids and handle clock rollback. Stating that tradeoff in one sentence is the whole answer.',
    },
  ],
};
