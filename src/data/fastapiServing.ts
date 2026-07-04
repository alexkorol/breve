import type { Deck } from '../types';

export const fastapiServing: Deck = {
  id: 'fastapi-serving',
  title: 'FastAPI & Serving',
  description: 'Own the API layer of your projects — the questions you got partial credit on.',
  icon: '🚀',
  color: '#059669',
  track: 'AI Engineering',
  cards: [
    {
      id: 'fa-one-breath',
      type: 'flash',
      front: 'Describe FastAPI in one breath (and why your project used it).',
      back: 'A modern async Python web framework built on ASGI. You declare types on endpoint parameters and Pydantic validates requests automatically; the same declarations generate interactive OpenAPI docs for free. Async-first, so one worker overlaps many slow LLM/database calls — which is exactly the workload of an AI backend.',
    },
    {
      id: 'fa-decorator',
      type: 'fill',
      prompt: 'Declare a read endpoint:',
      code: '@app.____("/items/{item_id}")\ndef read_item(item_id: int):\n    ...',
      answers: ['get'],
      distractors: ['route', 'fetch', 'read'],
      explanation:
        'HTTP method as the decorator name: @app.get, @app.post, @app.put, @app.delete. The {item_id} in the path becomes a validated function argument.',
    },
    {
      id: 'fa-path-vs-query',
      type: 'mcq',
      prompt: 'In this endpoint, which is a path parameter and which is a query parameter?',
      code: '@app.get("/items/{item_id}")\ndef read(item_id: int, q: str | None = None):\n    ...',
      choices: [
        'item_id is path (in the route); q is query (?q=...)',
        'Both are path parameters',
        'item_id is query; q is path',
        'FastAPI decides at runtime per request',
      ],
      answer: 0,
      explanation:
        'Appears in the route string → path param. Doesn’t → query param. Both get validated and coerced from their type hints — /items/abc returns a 422 automatically.',
    },
    {
      id: 'fa-pydantic-body',
      type: 'fill',
      prompt: 'A validated JSON request body:',
      code: 'class Query(____):\n    question: str\n    top_k: int = 5\n\n@app.post("/ask")\ndef ask(query: Query):\n    ...',
      answers: ['BaseModel'],
      distractors: ['BaseSchema', 'Model', 'dataclass'],
      explanation:
        'Pydantic BaseModel parameters are parsed from the JSON body; invalid payloads get an automatic 422 with field-level errors. This IS FastAPI’s core trick.',
    },
    {
      id: 'fa-async-vs-sync',
      type: 'flash',
      front: '`async def` vs `def` endpoints — the answer that shows production experience.',
      back: 'async def runs on the event loop: great for awaiting LLM APIs and databases, but one blocking call (requests.get, time.sleep, heavy CPU) freezes EVERY request on that worker. Plain def is safer for blocking code — FastAPI runs it in a threadpool. The classic prod bug: async def with a sync HTTP client inside. Fix: httpx.AsyncClient, or drop the async.',
    },
    {
      id: 'fa-depends',
      type: 'mcq',
      prompt: 'What is `Depends()` for?',
      code: 'def get_db():\n    ...\n\n@app.get("/users")\ndef users(db=Depends(get_db)):\n    ...',
      choices: [
        'Dependency injection — shared per-request logic (DB session, auth) declared once, resolved automatically',
        'Lazy imports to speed startup',
        'Marking optional parameters',
        'Declaring package requirements',
      ],
      answer: 0,
      explanation:
        'Dependencies can yield (setup/teardown), nest, and be overridden in tests — the idiomatic answer to "how do you handle auth/DB connections across endpoints?"',
    },
    {
      id: 'fa-status-codes',
      type: 'mcq',
      prompt: 'A POST that creates a resource should return…',
      choices: ['201 Created', '200 OK', '204 No Content', '302 Found'],
      answer: 0,
      explanation:
        '@app.post("/items", status_code=201). Also ready: 422 = validation failure (FastAPI’s automatic one), 401/403 = authn/authz, 429 = rate limited, 503 = downstream (LLM) unavailable.',
    },
    {
      id: 'fa-uvicorn',
      type: 'fill',
      prompt: 'Run the app locally:',
      code: 'uvicorn main:____ --reload',
      answers: ['app'],
      distractors: ['run', 'server', 'main'],
      explanation:
        'module:variable — the FastAPI() instance named app inside main.py. In production: multiple workers (uvicorn --workers 4 or gunicorn with uvicorn workers) behind a reverse proxy.',
    },
    {
      id: 'fa-streaming',
      type: 'flash',
      front: 'How do you stream an LLM answer through FastAPI, and why bother?',
      back: 'Return a StreamingResponse wrapping an async generator that yields chunks as the LLM produces them (SSE — media type text/event-stream — is the standard for chat UIs). Why: time-to-first-token becomes ~1s instead of the full 20s generation — the single biggest perceived-latency win in an LLM product.',
    },
    {
      id: 'fa-background',
      type: 'mcq',
      prompt: 'Log analytics after responding, without delaying the response?',
      choices: [
        'BackgroundTasks — schedule the function to run after the response is sent',
        'A second endpoint the client must also call',
        'time.sleep(0) before returning',
        'Threading inside the endpoint with no cleanup',
      ],
      answer: 0,
      explanation:
        'Add background_tasks: BackgroundTasks to the signature and .add_task(fn, args). For heavy or reliable-delivery work, graduate to a real queue (Celery/Redis) — say that boundary.',
    },
    {
      id: 'fa-docs',
      type: 'mcq',
      prompt: 'Where do the interactive API docs come from?',
      choices: [
        'Generated automatically from type hints and Pydantic models at /docs',
        'You write OpenAPI YAML by hand',
        'A paid FastAPI add-on',
        'Only if you add docstrings to every function',
      ],
      answer: 0,
      explanation:
        'Swagger UI at /docs, ReDoc at /redoc, schema at /openapi.json — free because the types are declared. This is a big part of "why FastAPI over Flask" answers.',
    },
    {
      id: 'fa-rag-layer',
      type: 'flash',
      front: 'Interview: "Walk me through the API layer of your RAG app."',
      back: 'POST /query takes a Pydantic model (question, top_k, filters). An auth dependency validates the caller. Handler: embed the question → retrieve top-k chunks → build the prompt → call the LLM with a timeout and one retry → stream the answer with citations via SSE. Plus GET /health for the load balancer, structured logs with a request ID per query, and 503 with a friendly message when the LLM provider is down. Practice saying this in under 60 seconds.',
    },
  ],
};
