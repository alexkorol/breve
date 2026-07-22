import type { Deck } from '../types';

export const sysScaling: Deck = {
  id: 'sys-scaling',
  title: 'Scaling & Load',
  description: 'What actually happens when traffic grows 10x, and the levers that absorb it.',
  icon: '⚖️',
  color: '#34d399',
  track: 'System Design',
  cards: [
    {
      id: 'sds-lb-algorithms',
      type: 'flash',
      front: 'Round robin vs least connections: how do you pick a load balancing algorithm?',
      back: 'Round robin rotates through servers in order: fine when requests are uniform and servers identical. Least connections sends to the server with the fewest active connections: better when request durations vary, because slow requests pile up connections on one box. Weighted variants of both handle mixed hardware. The follow-up interviewers probe: neither keeps a client on the same server, so cache or session affinity needs sticky sessions or consistent hashing.',
    },
    {
      id: 'sds-consistent-hash',
      type: 'mcq',
      prompt: 'Why route cache traffic with consistent hashing instead of round robin?',
      choices: [
        'Same key always hits the same node, so each key is cached once, not N times',
        'Consistent hashing spreads load more evenly than round robin',
        'It is cheaper to compute per request',
        'It removes the need for cache expiry',
      ],
      answer: 0,
      explanation:
        'Round robin sprays a hot key across every cache node: N copies, N misses to warm, lower hit rate. Hashing the key pins it to one node. The "consistent" part adds the ring, so adding or removing a node remaps only neighboring keys instead of nearly all of them.',
    },
    {
      id: 'sds-l4-vs-l7',
      type: 'mcq',
      prompt: 'A load balancer routes /api/* and /static/* to different server pools. Which layer must it operate at?',
      choices: [
        'L7: path-based routing requires parsing the HTTP request',
        'L4: routing is always a transport-level concern',
        'L3: routing decisions belong to the IP layer',
        'Either: L4 balancers can inspect URLs too',
      ],
      answer: 0,
      explanation:
        'L4 sees only IPs and ports: very fast, protocol-blind, no content decisions. L7 terminates the connection and reads the request, enabling path routing, header-based canaries, and TLS termination, at a higher per-request cost.',
    },
    {
      id: 'sds-health-check',
      type: 'tf',
      prompt: 'If a server accepts TCP connections on its port, the load balancer can safely consider it healthy.',
      answer: false,
      explanation:
        'A process can accept connections while its database connection is dead or its worker threads are wedged. Deep health checks hit an endpoint that exercises critical dependencies. The tradeoff: a too-deep check marks the whole fleet unhealthy when one shared dependency blips.',
    },
    {
      id: 'sds-drain',
      type: 'order',
      prompt: 'Order the steps of taking a server out of rotation without dropping requests (connection draining).',
      items: [
        'Instance is marked draining (or starts failing health checks)',
        'Load balancer stops routing new requests to it',
        'In-flight requests run to completion',
        'Drain timeout expires; remaining connections close',
        'Instance is terminated or updated',
      ],
      explanation:
        'This sequence is why deploys and scale-downs do not drop traffic. Skip the drain step and every deploy becomes a burst of 5xx errors.',
    },
    {
      id: 'sds-shard-strategies',
      type: 'flash',
      front: 'Name the three sharding strategies and the failure mode of each.',
      back: 'Range: split by key ranges (A-M, N-Z). Cheap range scans, but sequential keys (timestamps, auto-increment IDs) hammer one shard.\nHash: hash the key to pick a shard. Even spread, but range queries now fan out to every shard.\nDirectory: a lookup service maps each key to its shard. Fully flexible placement, but the directory is an extra hop and a single point of failure you must protect.',
    },
    {
      id: 'sds-hot-shard',
      type: 'mcq',
      prompt: 'Events are range-sharded by timestamp. What goes wrong as write traffic grows?',
      choices: [
        'All new writes land on the newest shard: one hot shard does all the work',
        'Old shards fill up and start rejecting reads',
        'Range queries stop working across shard boundaries',
        'Nothing: range sharding spreads writes evenly by design',
      ],
      answer: 0,
      explanation:
        'Monotonically increasing keys defeat range sharding for writes: the tail shard takes 100% of inserts while the rest idle. Fix by hashing the key or prefixing with a high-cardinality field (user ID) so writes spread. The same trap hides in auto-increment primary keys.',
    },
    {
      id: 'sds-reshard',
      type: 'mcq',
      prompt: 'You place keys with hash(key) % 4 and grow from 4 to 5 nodes. Roughly how many keys move?',
      choices: [
        'About 80%: nearly every key gets a new modulus result',
        'About 20%: only the share owned by the new node',
        'None: hashing is stable across cluster sizes',
        'Exactly 50%: half re-map on average',
      ],
      answer: 0,
      explanation:
        'Changing N in hash mod N reshuffles almost everything: a cache stampede or a massive data migration. Consistent hashing moves only about 1/N of keys (the arc the new node takes over), which is the whole reason it exists.',
    },
    {
      id: 'sds-replication-models',
      type: 'flash',
      front: 'Leader-follower, multi-leader, leaderless replication: one sentence each, and what each buys you.',
      back: 'Leader-follower: all writes go to one leader, followers replicate; simple and gives read scaling, but the leader caps write throughput and failover is delicate.\nMulti-leader: writes accepted in several regions; low write latency everywhere, but concurrent writes conflict and need resolution rules.\nLeaderless (Dynamo-style): write to W nodes, read from R, with quorum overlap; high availability with no failover step, but the application must tolerate stale or conflicting reads.',
    },
    {
      id: 'sds-replication-lag',
      type: 'mcq',
      prompt: 'A user saves their profile, the page reloads, and the old value appears. Likely cause in a leader-follower setup?',
      choices: [
        'The read hit a lagging follower: replication is asynchronous',
        'The write was silently lost by the leader',
        'The cache and the database deadlocked',
        'The leader rolled the transaction back',
      ],
      answer: 0,
      explanation:
        'Async replication means followers trail the leader, and lag spikes under load. The fix is read-your-writes consistency: route a user\'s reads to the leader briefly after their write, or pin by session. Noting that lag is usually milliseconds but unbounded under load shows operational awareness.',
    },
    {
      id: 'sds-replicas-vs-cache',
      type: 'flash',
      front: 'Reads are overwhelming the database. Read replicas or a cache: how do you choose?',
      back: 'Cache when the workload is hot-key heavy: far cheaper per read, absorbs huge fan-out, and on a hit the database does nothing. Costs: invalidation logic and stale reads.\nReplicas when queries are diverse or need real SQL: full query power and near-fresh data, no invalidation code. Costs: every replica stores the full dataset and applies the full write stream, so replicas scale reads only, never writes.\nCommon answer: cache the hot 1%, replicas for the long tail.',
    },
    {
      id: 'sds-autoscaling',
      type: 'mcq',
      prompt: 'An IO-bound API autoscales on CPU. Latency climbs but no new instances launch. Why?',
      choices: [
        'Threads are blocked waiting on IO, so CPU stays low while requests queue',
        'CPU-based scaling reacts too quickly to spikes',
        'Autoscaling cannot help IO-bound services at all',
        'The load balancer hides the traffic from the autoscaler',
      ],
      answer: 0,
      explanation:
        'Scale on a signal that tracks saturation for your workload: queue depth, in-flight concurrency, or p99 latency for IO-bound services. Wrong-metric autoscaling fails both ways: it also over-scales when CPU spikes for reasons unrelated to traffic.',
    },
    {
      id: 'sds-cdn',
      type: 'mcq',
      prompt: 'What does putting a CDN in front of your origin primarily buy you?',
      choices: [
        'Cacheable responses served from edge locations: origin bandwidth and user latency both drop',
        'Automatic read scaling for the database',
        'Protection against all application-layer attacks',
        'Strong consistency for dynamic content',
      ],
      answer: 0,
      explanation:
        'The CDN serves cached content (images, JS, video, even cacheable API responses) from edges near users, offloading most bandwidth from origin. Side benefits: TLS termination at the edge and some DDoS absorption. Dynamic, personalized responses still hit origin.',
    },
    {
      id: 'sds-cache-control',
      type: 'fill',
      prompt: 'Let the CDN and browsers cache this asset for one day:',
      code: 'Cache-Control: public, ____=86400',
      answers: ['max-age'],
      distractors: ['expires', 'ttl', 'timeout', 'age'],
      explanation:
        'max-age is the number of seconds the response may be reused; public lets shared caches (CDNs) store it. For fingerprinted assets (app.3f9c.js) use a long max-age plus immutable and let the filename change bust the cache.',
    },
    {
      id: 'sds-rate-limit',
      type: 'mcq',
      prompt: 'Token bucket vs window-based rate limiting: what does token bucket handle better?',
      choices: [
        'Short bursts: saved-up tokens let a client briefly exceed the steady rate',
        'Exact fairness between competing clients',
        'Distributed enforcement across many nodes',
        'Blocking sustained overload',
      ],
      answer: 0,
      explanation:
        'Tokens refill at rate r up to capacity b, so an idle client can burst up to b requests. Fixed windows allow 2x bursts at window boundaries; sliding window fixes that with more bookkeeping. The strong answer names the algorithm, its burst behavior, and where the counters live (usually Redis).',
    },
    {
      id: 'sds-load-shedding',
      type: 'flash',
      front: 'What is load shedding, and how does graceful degradation differ?',
      back: 'Load shedding: when overloaded, reject some requests early with a fast, cheap 429/503 instead of slowly failing all of them. Unbounded queues just convert overload into timeouts for everyone.\nGraceful degradation: keep serving everyone, but a cheaper experience: stale cache instead of live data, recommendations off, search without personalization.\nRule of thumb: shed load you cannot serve; degrade features to make the load servable.',
    },
    {
      id: 'sds-conn-pool',
      type: 'tf',
      prompt: 'Doubling your app servers doubles the load your database can handle.',
      answer: false,
      explanation:
        'More app servers means more connections to the same database, and each connection costs the DB memory and scheduling; past a point, extra connections reduce throughput. Connection pooling (in-app pools or a proxy like PgBouncer) caps and reuses connections. The database is still the bottleneck and must be scaled separately.',
    },
    {
      id: 'sds-spof-hunt',
      type: 'order',
      prompt: 'Walk the request path hunting single points of failure, in traffic order.',
      items: [
        'DNS: single provider, single record?',
        'Load balancer: is it itself redundant?',
        'App tier: multiple instances across zones?',
        'Cache: what happens when it dies?',
        'Database: replicated, with tested failover?',
      ],
      explanation:
        'The systematic SPOF sweep: follow one request from client to storage and ask "what if this box dies?" at every hop. Redundancy needs a failover story: a replica nobody has ever failed over to is not redundancy.',
    },
  ],
};
