# Multi-Agent Architecture Patch

Drop these files into your existing `ai-academic-platform/` project,
overwriting the paths listed below. This upgrades the AI Academic Advisor
from a single RAG chatbot into a Manager AI + 4 specialized agents.

## New files
- `backend/app/agents/__init__.py`
- `backend/app/agents/manager.py` — the orchestrator; routes queries by
  intent and drives the automatic event workflow (`on_event()`)
- `backend/app/agents/rag_tool.py` — shared retrieval, now callable by any
  agent instead of being locked inside one chatbot
- `backend/app/agents/student_course_agent.py`
- `backend/app/agents/learning_agent.py`
- `backend/app/agents/test_agent.py`
- `backend/app/agents/planner_agent.py`
- `backend/app/models/agent_log.py` — new `agent_logs` table so you can show
  which agent handled each query (useful for project evaluation)

## Changed files (overwrite these)
- `backend/app/models/__init__.py` — now imports `AgentLog`
- `backend/app/routers/advisor.py` — calls `agents.manager.handle_query()`
  instead of the old `rag.graph.run_advisor_graph()`. Response shape is
  unchanged, so `frontend/src/components/ChatWindow.jsx` needs no edits.
- `backend/app/routers/tests.py` — added a comment showing exactly where to
  call `agents.manager.on_event("test_completed", ...)` once real scoring
  is implemented
- `database/schema.sql` — added the `agent_logs` table definition
- `backend/app/rag/graph.py` — marked DEPRECATED (not deleted, kept for
  reference). Safe to delete once you've confirmed the new agents work.

## What's still stubbed (same TODO style as the rest of the project)
- `manager.py::classify_intent()` — currently keyword matching; the TODO
  says to replace with a real LLM/Gemini call or a LangGraph node
- Every specialized agent's `handle()` — real logic (test generation,
  scoring, video recommendation calls, plan building) still needs writing
- `manager.py::on_event()` — the automatic workflow (unit completed → auto
  test → weak topic → revision plan → retest) is wired structurally but
  the actual trigger points in other routers aren't calling it yet, except
  for the one comment added in `routers/tests.py`

## Migration steps
1. Copy the new `agents/` folder and `models/agent_log.py` into your
   `backend/app/` directory.
2. Overwrite `models/__init__.py`, `routers/advisor.py`, `routers/tests.py`,
   `rag/graph.py`, and `database/schema.sql` with the versions here.
3. If you're using Alembic, generate a new migration for the `agent_logs`
   table. If you're still on `Base.metadata.create_all()`, it'll pick up
   the new table automatically on next backend restart.
4. Restart the backend and re-test `POST /advisor/ask` — the response
   shape is unchanged, so your frontend should work without modification.
