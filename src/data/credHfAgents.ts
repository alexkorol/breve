import type { Deck } from '../types';

export const credHfAgents: Deck = {
  id: 'cred-hf-agents',
  title: 'HF Agents Course',
  description: 'smolagents, LlamaIndex, LangGraph, and beating 30% on GAIA.',
  icon: '🤗',
  color: '#ff9d00',
  track: 'Credentials',
  cards: [
    {
      id: 'hfa-structure',
      type: 'flash',
      front: 'The Hugging Face Agents Course: structure and what the certificate requires.',
      back: 'Unit 0: onboarding.\nUnit 1: agent fundamentals (earns the fundamentals certificate).\nUnit 2: frameworks; smolagents, LlamaIndex, LangGraph.\nUnit 3: agentic RAG use case.\nUnit 4: final challenge.\nThe completion certificate requires Unit 1, a use-case assignment, and a final agent scoring 30%+ on a GAIA benchmark subset, with a student leaderboard and no deadline.',
    },
    {
      id: 'hfa-react-loop',
      type: 'mcq',
      prompt: 'The core agent cycle taught in Unit 1?',
      choices: [
        'Thought → Action → Observation, repeated until the goal (the ReAct pattern)',
        'Train → Test → Deploy: each run fine-tunes the model on its own trajectory before acting again',
        'Prompt → Response → Done: one completion, with the tools inlined into the system prompt as text',
        'Map → Reduce → Aggregate',
      ],
      answer: 0,
      explanation:
        'The model reasons about what to do, emits an action (tool call), reads the result, and loops. Every framework in Unit 2 is a different way of engineering this same loop.',
    },
    {
      id: 'hfa-gaia',
      type: 'mcq',
      prompt: 'What is GAIA, the final-challenge benchmark?',
      choices: [
        'Real-world assistant tasks needing multi-step reasoning, web browsing, tool use, and file handling: easy for humans, hard for agents',
        'A pure math-proof benchmark: models score near zero because formal verification rejects every natural-language reasoning step they produce',
        'A latency benchmark for inference servers: agents are ranked purely by tokens per second on tool-calling workloads',
        'A dataset of chess puzzles',
      ],
      answer: 0,
      explanation:
        'Questions like "which country had the fewest athletes at the 1928 Olympics per this file": humans score ~92%, unassisted LLMs a small fraction of that. The gap IS the agent: tools close it.',
    },
    {
      id: 'hfa-codeagent',
      type: 'flash',
      front: 'smolagents’ signature idea: the CodeAgent. What is it and why does it work?',
      back: 'Instead of emitting JSON tool calls, the agent writes and executes Python code as its actions. Code composes naturally (loops, conditionals, chaining several tools in one step, variables carrying state), so it needs fewer round trips than one-JSON-call-per-step. The tradeoff to name immediately: executing model-written code demands sandboxing (restricted imports, e2b-style isolation).',
    },
    {
      id: 'hfa-toolcalling-vs-code',
      type: 'mcq',
      prompt: 'smolagents offers ToolCallingAgent and CodeAgent. The difference?',
      choices: [
        'ToolCallingAgent emits JSON tool calls; CodeAgent writes Python snippets that call tools directly',
        'ToolCallingAgent is multi-turn; CodeAgent writes one script up front and runs the whole task single-shot',
        'CodeAgent only works with models fine-tuned on code, so most chat models must use ToolCallingAgent',
        'They are aliases of the same class',
      ],
      answer: 0,
      explanation:
        'Same ReAct loop, different action format. JSON is safer and more portable; code is more expressive per step: pick per task.',
    },
    {
      id: 'hfa-tool-decorator',
      type: 'fill',
      prompt: 'Turn a plain function into a smolagents tool:',
      code: '@____\ndef get_weather(city: str) -> str:\n    """Get current weather for a city."""\n    ...',
      answers: ['tool'],
      distractors: ['agent', 'function_call', 'register'],
      explanation:
        'The @tool decorator reads the signature, type hints, and docstring to build the tool spec the model sees, which is why the docstring quality directly affects whether the agent uses the tool correctly.',
    },
    {
      id: 'hfa-llamaindex',
      type: 'mcq',
      prompt: 'LlamaIndex’s role in the course lineup?',
      choices: [
        'Agents over your data: indexes, query engines, and workflows for retrieval-centric agents',
        'The fastest general web-browsing agent: it crawls and scrapes live sites with no retrieval layer involved',
        'A model-training framework: it fine-tunes embedding models on your documents before indexing them',
        'A JavaScript-only alternative',
      ],
      answer: 0,
      explanation:
        'The mental map: smolagents = lightweight code-first agents, LlamaIndex = data/RAG-centric agents, LangGraph = explicit control flow. Pick by what dominates your problem: actions, data, or flow.',
    },
    {
      id: 'hfa-langgraph-unit',
      type: 'mcq',
      prompt: 'Why does the course teach LangGraph for "production-ready" agents specifically?',
      choices: [
        'Explicit graph control flow: typed state, conditional routing, and checkpointing beat a free-running loop for reliability',
        'It is the only framework of the three that scales past one machine: graph nodes are scheduled across a GPU cluster automatically',
        'LangGraph agents cannot hallucinate: every node output is validated against the typed state schema before it propagates',
        'It requires no code',
      ],
      answer: 0,
      explanation:
        'Determinism where you want it, model freedom where you need it: that’s the argument for graphs over free-running loops.',
    },
    {
      id: 'hfa-agentic-rag',
      type: 'mcq',
      prompt: 'Agentic RAG (Unit 3) differs from plain RAG how?',
      choices: [
        'The agent decides when and what to retrieve: reformulating queries, retrieving multiple times, mixing tools',
        'It uses bigger embedding models so a single retrieval pass returns better chunks',
        'It skips the vector store entirely: the agent reads the raw corpus through a long context window on every question',
        'It only works on structured data',
      ],
      answer: 0,
      explanation:
        'Plain RAG: retrieve once, then answer. Agentic: retrieval becomes a tool the agent calls as needed; multi-hop questions, query rewriting, choosing between search and calculation per step.',
    },
    {
      id: 'hfa-observability',
      type: 'flash',
      front: 'The observability & evaluation bonus unit: what do you instrument on an agent?',
      back: 'Trace every step: each thought, tool call, tool result, and token cost, linked by a run ID (OpenTelemetry-style tooling. Langfuse and friends). Evaluate at two levels: step level (did it pick sensible tools?) and task level (final success rate, cost per solved task, steps per task).',
    },
    {
      id: 'hfa-final-agent',
      type: 'flash',
      front: 'Design an agent that clears 30% on the GAIA subset: the practical architecture.',
      back: 'A capable model driving a ReAct/CodeAgent loop with the tools GAIA demands: web search + page reading, file inspection (CSV/Excel/images), and code execution for math. Add per-step retries and a step cap. Then the classic gotcha: GAIA grades by EXACT MATCH; a final-answer formatting pass ("number only, no commas, no units unless asked") rescues points that reasoning already earned. Most failed submissions fail on formatting, not intelligence.',
    },
    {
      id: 'hfa-fc-finetune',
      type: 'flash',
      front: 'Bonus unit: what actually happens when you fine-tune for function calling?',
      back: 'SFT (often LoRA) on conversations whose assistant turns contain structured tool calls: teaching the model the emit-a-call format natively instead of relying on prompt engineering. Worth doing for smaller local models that ignore tool instructions; pointless for frontier APIs that already do it.',
    },
    {
      id: 'hfa-observation-loop',
      type: 'flash',
      front: 'Why is the Observation step what separates an agent from a one-shot LLM response?',
      back: 'Observation feeds the REAL result of each action back into the next decision, turning generation into a control loop: the agent can react to tool failures, unexpected outputs, environment changes, and whether the goal is actually reached. Without it you have a linear pipeline that cannot correct itself.',
    },
    {
      id: 'hfa-agent-memory',
      type: 'mcq',
      prompt: 'What does agent "working memory" contain, versus plain chat history?',
      choices: [
        'The structured record of the current run: instructions, task, actions, tool calls and outputs, code results, observations, and errors, replayed as messages each step',
        'Only the user and assistant turns',
        'The model’s weights from fine-tuning',
        'A vector store of all past conversations',
      ],
      answer: 0,
      explanation:
        'It is working memory for iterative problem-solving on THIS task, structured around actions and observations: not conversational turns, and not long-term memory across sessions.',
    },
    {
      id: 'hfa-debug-order',
      type: 'mcq',
      prompt: 'Correct order for debugging an agent system that is failing?',
      choices: [
        'Test the model alone, then one tool, then one agent task, then a small batch',
        'Run the full benchmark and read the aggregate score',
        'Add more tools until something works',
        'Switch frameworks first',
      ],
      answer: 0,
      explanation:
        'Isolate the smallest component first: a one-line "model works" generation before any tools, one tool call before the loop, one question before a batch. Then read the EARLIEST meaningful error in the traceback, not the loudest.',
    },
    {
      id: 'hfa-provider-debug',
      type: 'flash',
      front: 'Your agent 500s on its first call. What is the lesson about inference providers?',
      back: 'Model availability and provider routing are EXTERNAL dependencies: providers drop models, auto-routing changes, servers fail with no bug in your code. (Lived example: InferenceClientModel auto-routed to a provider returning 500s; fix was a supported model + provider="auto", verified with an isolated one-line generation first.) Production answer: retries, fallbacks, a swappable model adapter (agent and tools unchanged when HF credits ran out and the backend moved to OpenRouter), monitoring, graceful degradation.',
    },
    {
      id: 'hfa-baseline-first',
      type: 'mcq',
      prompt: 'When should multi-agent orchestration, memory systems, or a heavier framework be added to an agent?',
      choices: [
        'Only after the simple baseline demonstrably hits a limitation that specifically needs them',
        'From the start, to future-proof the design',
        'Whenever the benchmark score plateaus',
        'When the framework releases a new version',
      ],
      answer: 0,
      explanation:
        '"Boring before fancy." Framework selection follows workflow requirements, not popularity: smolagents is the shortest path to a working GAIA baseline; explicit state or orchestration earns its complexity only when the baseline exposes the need.',
    },
    {
      id: 'hfa-failure-analysis',
      type: 'flash',
      front: 'What is more informative than a benchmark score alone, and what do you log per run to get it?',
      back: 'A categorized failure analysis: WHY runs failed (format miss, weak evidence, calculation slip, stopped before verifying) and how each change moved each category. Per run log: question, tools selected, intermediate outputs, errors/retries, final vs expected answer, pass/fail, failure category, cost/latency. The interview story is the failure taxonomy and the fixes, not the number.',
    },
  ],
};
