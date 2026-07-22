import type { Deck } from '../types';

export const sysStorage: Deck = {
  id: 'sys-storage',
  title: 'Storage & Databases',
  description: 'Choosing and defending a datastore: the decision interviewers always drill into.',
  icon: '🗄️',
  color: '#f472b6',
  track: 'System Design',
  cards: [
    {
      id: 'sdb-sql-vs-nosql',
      type: 'flash',
      front: 'Interviewer asks "SQL or NoSQL for this system?" What is the framework for answering?',
      back: 'Turn it into a requirements question, never a preference:\n1) Relational when you need joins across entities, multi-row transactions, ad-hoc queries, or database-enforced constraints.\n2) NoSQL when you need horizontal scale-out past one node, a flexible or evolving schema, or one known access pattern you can shape the data around.\nThe strong answer names the specific requirement that forces the choice.',
    },
    {
      id: 'sdb-postgres-default',
      type: 'mcq',
      prompt: 'New product, unclear future query patterns, moderate traffic. Best default datastore?',
      choices: [
        'Postgres: ACID, joins, ad-hoc SQL, and it scales further than most products ever need',
        'Cassandra, to be ready for future scale',
        'MongoDB, because the schema might change',
        'DynamoDB, to avoid managing servers',
      ],
      answer: 0,
      explanation:
        'Choosing NoSQL early locks you into fixed access patterns before you know them; relational schemas and queries stay flexible. Postgres also covers JSONB documents and full-text search. Reach for a specialized store only when a measured requirement (write volume, scale-out, latency) rules it out.',
    },
    {
      id: 'sdb-store-families',
      type: 'flash',
      front: 'Name the four main NoSQL store families and one canonical use case each.',
      back: '1) Document (MongoDB): product catalog where each item has different attributes, read and written as one JSON blob.\n2) Key-value (Redis, DynamoDB): session store or cache, single-key lookup by user id.\n3) Wide-column (Cassandra): time-series and event feeds, huge write volume partitioned by key and sorted within the partition.\n4) Graph (Neo4j): friend-of-friend social queries, where traversals replace multi-level self-joins.',
    },
    {
      id: 'sdb-btree-index',
      type: 'flash',
      front: 'What does a B-tree index actually buy you, and what does it cost on writes?',
      back: 'Buys: O(log n) lookup on the indexed column, plus fast range scans and ORDER BY, instead of a full table scan. Costs: every INSERT, UPDATE, and DELETE must also update each index, and indexes consume storage and cache. A table with five indexes pays roughly five extra writes per row change.',
    },
    {
      id: 'sdb-covering-index',
      type: 'fill',
      prompt: 'A covering index answers the query from the index alone, with no table lookup. Complete the Postgres syntax:',
      code: 'CREATE INDEX idx_users_name\n  ON users (last_name) ____ (email);',
      answers: ['INCLUDE'],
      distractors: ['COVERING', 'STORING', 'CONTAINS', 'WITH'],
      explanation:
        'INCLUDE stores email in the index leaf without making it part of the search key. SELECT email WHERE last_name = ? becomes an index-only scan that never touches the table heap.',
    },
    {
      id: 'sdb-index-everything',
      type: 'tf',
      prompt: 'Since indexes speed up reads, indexing every column is a safe default.',
      answer: false,
      explanation:
        'Each index taxes every write, competes for cache, and most will never be used by the planner. Index what query patterns need: selective columns in WHERE, JOIN, and ORDER BY. Find candidates from the slow-query log, then add deliberately.',
    },
    {
      id: 'sdb-n-plus-one',
      type: 'mcq',
      prompt: 'A page loads 50 orders, then queries the user for each order in a loop: 51 queries total. The name and the fix?',
      choices: [
        'N+1 query problem: batch with a JOIN or one IN (...) query for all user ids',
        'Connection starvation: raise the pool size',
        'Missing index: add one on orders.user_id',
        'Slow network: put a cache in front',
      ],
      answer: 0,
      explanation:
        'Each query is fast; the 51 round trips are the cost. ORMs cause this silently through lazy loading, which is why interviewers probe it. Eager loading, a JOIN, or a batched IN query turns 51 round trips into 1 or 2.',
    },
    {
      id: 'sdb-acid-base',
      type: 'flash',
      front: 'Define ACID and BASE precisely, not just as "SQL vs NoSQL".',
      back: 'ACID:\n1) Atomicity: a transaction applies fully or not at all.\n2) Consistency: constraints hold before and after commit.\n3) Isolation: concurrent transactions behave as if run in some order.\n4) Durability: committed data survives crashes.\nBASE: Basically Available, Soft state, Eventually consistent: the system stays up and replicas converge later. They are ends of a spectrum, and many NoSQL stores now offer per-request tunable consistency.',
    },
    {
      id: 'sdb-read-anomalies',
      type: 'flash',
      front: 'Define the three read anomalies isolation levels are built around: dirty, non-repeatable, and phantom reads.',
      back: '1) Dirty read: seeing another transaction\'s uncommitted write, which may later roll back.\n2) Non-repeatable read: re-reading the same row inside one transaction and getting a different value because another transaction committed in between.\n3) Phantom read: re-running the same query and getting new rows that now match the predicate.\nEach stricter isolation level eliminates the next anomaly on this list.',
    },
    {
      id: 'sdb-read-committed',
      type: 'mcq',
      prompt: 'Under read committed (the Postgres default), which anomalies can still occur?',
      choices: [
        'Non-repeatable and phantom reads, but never dirty reads',
        'Dirty reads only',
        'None: read committed prevents all three',
        'All three',
      ],
      answer: 0,
      explanation:
        'Read committed only guarantees each statement sees committed data, so two reads in one transaction can disagree. Serializable removes all anomalies by making the outcome match some serial order, at the price of serialization failures the application must retry.',
    },
    {
      id: 'sdb-locking',
      type: 'mcq',
      prompt: 'Two users may edit the same record, but conflicts are rare. Optimistic or pessimistic locking?',
      choices: [
        'Optimistic: version column, compare-and-bump at write time, retry on conflict',
        'Pessimistic: hold SELECT ... FOR UPDATE while the user edits',
        'Pessimistic: lock the whole table during edits',
        'Neither: last write wins is acceptable',
      ],
      answer: 0,
      explanation:
        'Optimistic locking costs nothing until a conflict actually happens, so it wins when contention is low. Pessimistic locks earn their blocking overhead when conflicts are frequent or a retry is unacceptable, like seat reservation or inventory decrements.',
    },
    {
      id: 'sdb-wal',
      type: 'flash',
      front: 'What is a write-ahead log, and why does it let a database survive a crash mid-write?',
      back: 'Every change is appended to a sequential log and fsynced BEFORE data pages are modified. On restart the database replays the log from the last checkpoint: committed transactions are redone, uncommitted ones rolled back. Durability lives in the log, so data pages can be flushed lazily and efficiently. The same log stream also feeds replication and change data capture.',
    },
    {
      id: 'sdb-lsm-write-path',
      type: 'order',
      prompt: 'Order the write path of an LSM-tree storage engine (Cassandra, RocksDB).',
      items: [
        'Append the write to the WAL',
        'Insert into the in-memory memtable',
        'Memtable fills; flush to disk as an immutable SSTable',
        'Compaction merges SSTables in the background',
      ],
      explanation:
        'Every disk write is sequential (log appends and SSTable flushes), which is why LSM engines absorb heavy write loads. Reads pay instead: a lookup may check the memtable plus several SSTables, mitigated by Bloom filters.',
    },
    {
      id: 'sdb-lsm-vs-btree',
      type: 'mcq',
      prompt: 'Ingesting a heavy stream of sensor events; reads are rare. B-tree or LSM engine?',
      choices: [
        'LSM: sequential appends and batched flushes beat in-place page updates for write throughput',
        'B-tree: mature and read-optimized',
        'LSM, because its reads are faster',
        'B-tree, because LSM engines cannot do range scans',
      ],
      answer: 0,
      explanation:
        'B-trees update pages in place with random I/O and page splits; LSM turns writes into sequential I/O at the cost of read amplification and background compaction. Rule of thumb: write-heavy → LSM, read-heavy lookups → B-tree.',
    },
    {
      id: 'sdb-blob-storage',
      type: 'tf',
      prompt: 'User-uploaded videos should be stored as blobs in the main database so they stay transactional with their metadata.',
      answer: false,
      explanation:
        'Large blobs bloat the database, its backups, cache, and replication stream for zero query benefit. Standard design: file in object storage (S3), URL or key plus metadata in the database, downloads served via CDN or presigned URLs.',
    },
    {
      id: 'sdb-expand-contract',
      type: 'order',
      prompt: 'Rename a column with zero downtime: order the expand-and-contract steps.',
      items: [
        'Add the new column alongside the old (expand)',
        'Deploy code that writes both, reads old',
        'Backfill existing rows into the new column',
        'Switch reads to the new column',
        'Stop writing the old column, then drop it (contract)',
      ],
      explanation:
        'Every step is backward compatible, so old and new code can run at the same time and any step can be rolled back. An in-place rename locks the table and breaks whichever code version is not deployed yet.',
    },
    {
      id: 'sdb-denormalization',
      type: 'mcq',
      prompt: 'A dashboard join across five tables is slow, so you consider storing a precomputed denormalized copy. The real tradeoff?',
      choices: [
        'Faster reads, but every write must now update multiple copies consistently, risking drift',
        'More disk usage, which is the main cost',
        'None: normalization is only an academic concern',
        'Slower reads in exchange for simpler writes',
      ],
      answer: 0,
      explanation:
        'Denormalization trades write complexity and consistency risk for read speed. Say how the copies stay in sync (same transaction, triggers, or an async projection with lag) and what happens when they drift. Disk is cheap; drift is not.',
    },
    {
      id: 'sdb-delete-strategies',
      type: 'flash',
      front: 'Soft delete vs hard delete vs TTL: when do you use each?',
      back: '1) Soft delete: set deleted_at instead of removing the row. Preserves audit history and undo, but every query must filter it and unique constraints need care.\n2) Hard delete: the row is gone. Required for privacy erasure requests; simplest when history has no value.\n3) TTL: the store expires rows automatically after a set lifetime (Redis, DynamoDB, Cassandra). Ideal for sessions, caches, and retention policies with no cleanup jobs.',
    },
  ],
};
