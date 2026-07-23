import type { Deck } from '../types';

export const fastapiServing: Deck = {
  id: 'fastapi-serving',
  title: 'FastAPI & Serving',
  description: 'The API layer of an AI backend: validation, async, streaming, serving.',
  icon: '🚀',
  color: '#059669',
  track: 'AI Engineering',
  cards: [
    {
      id: 'fa-one-breath',
      type: 'flash',
      front: 'Describe FastAPI in one breath, and why AI backends pick it.',
      back: 'A modern async Python web framework built on ASGI. You declare types on endpoint parameters and Pydantic validates requests automatically; the same declarations generate interactive OpenAPI docs for free. Async-first, so one worker overlaps many slow LLM/database calls, which is exactly the workload of an AI backend.',
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
        'Both are path parameters, since every typed argument of the endpoint maps into the route',
        'item_id is query because it is typed; q is path because it has a default',
        'FastAPI decides per request at runtime, based on where the client actually sends each value',
      ],
      answer: 0,
      explanation:
        'Appears in the route string → path param. Doesn’t → query param. Both get validated and coerced from their type hints: /items/abc returns a 422 automatically.',
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
      front: '`async def` vs `def` endpoints: the answer that shows production experience.',
      back: 'async def runs on the event loop: great for awaiting LLM APIs and databases, but one blocking call (requests.get, time.sleep, heavy CPU) freezes EVERY request on that worker. Plain def is safer for blocking code. FastAPI runs it in a threadpool. The classic prod bug: async def with a sync HTTP client inside. Fix: httpx.AsyncClient, or drop the async.',
    },
    {
      id: 'fa-depends',
      type: 'mcq',
      prompt: 'What is `Depends()` for?',
      code: 'def get_db():\n    ...\n\n@app.get("/users")\ndef users(db=Depends(get_db)):\n    ...',
      choices: [
        'Dependency injection: shared per-request logic (DB session, auth) declared once, resolved automatically',
        'Lazy imports: modules named in Depends are only loaded when the endpoint is first hit, cutting cold-start time',
        'Marking a parameter as optional, so FastAPI skips validation when the client omits it',
        'Declaring package requirements so FastAPI can verify installed versions at startup',
      ],
      answer: 0,
      explanation:
        'Dependencies can yield (setup/teardown), nest, and be overridden in tests: the idiomatic answer to "how do you handle auth/DB connections across endpoints?"',
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
        'module:variable; the FastAPI() instance named app inside main.py. In production: multiple workers (uvicorn --workers 4 or gunicorn with uvicorn workers) behind a reverse proxy.',
    },
    {
      id: 'fa-streaming',
      type: 'flash',
      front: 'How do you stream an LLM answer through FastAPI, and why bother?',
      back: 'Return a StreamingResponse wrapping an async generator that yields chunks as the LLM produces them (SSE: media type text/event-stream; is the standard for chat UIs). Why: time-to-first-token becomes ~1s instead of the full 20s generation; the single biggest perceived-latency win in an LLM product.',
    },
    {
      id: 'fa-background',
      type: 'mcq',
      prompt: 'Log analytics after responding, without delaying the response?',
      choices: [
        'BackgroundTasks: schedule the function to run after the response is sent',
        'A second /analytics endpoint the client fires after it receives the response',
        'await asyncio.sleep(0) before returning, which yields the loop so logging runs in parallel',
        'Threading inside the endpoint with no cleanup',
      ],
      answer: 0,
      explanation:
        'Add background_tasks: BackgroundTasks to the signature and .add_task(fn, args). For heavy or reliable-delivery work, graduate to a real queue (Celery/Redis).',
    },
    {
      id: 'fa-docs',
      type: 'mcq',
      prompt: 'Where do the interactive API docs come from?',
      choices: [
        'Generated automatically from type hints and Pydantic models at /docs',
        'You write an OpenAPI YAML spec by hand and point FastAPI at it in the constructor',
        'A paid FastAPI add-on',
        'Only if you add docstrings to every endpoint; the docs are rendered from those docstrings alone',
      ],
      answer: 0,
      explanation:
        'Swagger UI at /docs, ReDoc at /redoc, schema at /openapi.json: free because the types are declared. This is a big part of "why FastAPI over Flask" answers.',
    },
    {
      id: 'fa-rag-layer',
      type: 'flash',
      front: 'Interview: "Walk me through the API layer of your RAG app."',
      back: 'POST /query takes a Pydantic model (question, top_k, filters); an auth dependency validates the caller.\nThe handler: embed the question → retrieve top-k chunks → build the prompt → call the LLM with a timeout and one retry → stream the answer with citations via SSE.\nAround it: GET /health for the load balancer, structured logs with a request ID per query, and 503 with a friendly message when the LLM provider is down.',
    },
    {
      id: 'fa-response-model',
      type: 'mcq',
      prompt: 'Why set `response_model` on an endpoint that already returns a Pydantic object?',
      code: '@app.post("/users", response_model=UserOut)\ndef create_user(user: UserIn):\n    return db_create(user)  # has hashed_password',
      choices: [
        'It filters the output to only the declared fields, so internal ones like hashed_password never leave the API',
        'It speeds up serialization: FastAPI skips response validation entirely because the return type is declared up front',
        'It only affects the OpenAPI schema at /docs; at runtime the returned object is serialized as-is',
        'It converts the response to XML when the client asks',
      ],
      answer: 0,
      explanation:
        'response_model validates AND filters output: return a rich internal object, clients only see UserOut fields. It also drives the docs schema. The classic security question it answers: "how do you avoid leaking DB fields?"',
    },
    {
      id: 'fa-field-validator',
      type: 'fill',
      prompt: 'Custom validation in Pydantic v2:',
      code: 'class Query(BaseModel):\n    question: str\n\n    @____("question")\n    @classmethod\n    def not_blank(cls, v: str) -> str:\n        if not v.strip():\n            raise ValueError("blank")\n        return v',
      answers: ['field_validator'],
      distractors: ['validator', 'validate_field', 'check_field'],
      explanation:
        'Pydantic v2 renamed @validator to @field_validator (and root validators to @model_validator). Raise ValueError to reject; FastAPI turns it into a field-level 422 automatically.',
    },
    {
      id: 'fa-cors',
      type: 'mcq',
      prompt: 'Your React frontend on localhost:5173 calls the API on localhost:8000 and the browser blocks it. Fix?',
      choices: [
        'Add CORSMiddleware with allow_origins listing the frontend origin',
        'Return status 200 instead of 201',
        'Switch the endpoint from POST to GET, since browsers only enforce cross-origin rules on POST',
        'Have the frontend send an Authorization header so the browser treats the request as trusted',
      ],
      answer: 0,
      explanation:
        'Cross-origin browser requests need CORS headers from the server: app.add_middleware(CORSMiddleware, allow_origins=[...], allow_methods, allow_headers). allow_origins=["*"] cannot be combined with credentials; list real origins in production.',
    },
    {
      id: 'fa-yield-dependency',
      type: 'order',
      prompt: 'Order the lifecycle of a yield dependency (def get_db(): db = Session(); yield db; db.close()):',
      items: [
        'Request arrives; FastAPI resolves the dependency',
        'Code before yield runs (open the DB session)',
        'The yielded value is injected and the endpoint runs',
        'The response is sent to the client',
        'Code after yield runs (close the session)',
      ],
      explanation:
        'yield splits the dependency into setup and teardown; teardown runs even if the endpoint raised. Wrap the yield in try/finally for guaranteed cleanup. This is the idiomatic per-request resource pattern.',
    },
    {
      id: 'fa-testclient',
      type: 'flash',
      front: 'How do you test FastAPI endpoints, including ones that hit a real database or LLM?',
      back: 'TestClient(app) (httpx under the hood) calls the app in-process, no server: client.post("/ask", json={...}) then assert on status and body.\nFor external resources, swap the dependency: app.dependency_overrides[get_db] = fake_db, so the endpoint code runs unchanged against a fake.\nThis pairing is the reason to route resources through Depends instead of importing globals: globals need monkeypatching, dependencies are swappable by design.\nClear overrides after each test (fixture teardown) so tests stay independent.',
    },
    {
      id: 'fa-scaling',
      type: 'flash',
      front: 'One uvicorn process is maxed out. Threads, workers, or more machines?',
      back: 'Not threads: the GIL means Python threads only help blocking I/O, and async already covers I/O concurrency inside one process.\nFirst: uvicorn --workers N (roughly CPU cores): separate processes, so they sidestep the GIL and use all cores.\nThen scale out: more instances behind a load balancer; works because API workers are stateless (state lives in the DB/cache).\nCaveat: per-process memory is duplicated, so heavy in-process models multiply RAM; that pushes model inference into its own service.',
    },
    {
      id: 'fa-timeouts',
      type: 'tf',
      prompt: 'FastAPI applies a request timeout by default, so a hung LLM call will eventually return a 504 on its own.',
      answer: false,
      explanation:
        'Neither FastAPI nor uvicorn imposes a per-request timeout; a hung await hangs forever. Enforce timeouts yourself: httpx.AsyncClient(timeout=...) or asyncio.timeout() around downstream calls, plus a proxy/load balancer timeout as the backstop.',
    },
  ],
};
