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
        'Train → Test → Deploy',
        'Prompt → Response → Done',
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
        'A pure math-proof benchmark',
        'A latency benchmark for inference servers',
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
        'ToolCallingAgent is multi-turn, CodeAgent is single-shot',
        'CodeAgent only works with GPT models',
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
        'The fastest general web-browsing agent',
        'A model-training framework',
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
        'It is the only framework with GPU support',
        'LangGraph agents cannot hallucinate',
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
        'It uses bigger embedding models',
        'It skips the vector store',
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
  ],
};
