"""
Shared execution helpers for MERIDIAN's LangGraph agent nodes.

Every agent node in the pipeline is wrapped with `with_retries` so failures
(e.g. a flaky OpenAI call, a malformed case record) are retried with backoff
and logged, instead of silently crashing the whole pipeline run.
"""
import functools
import logging
import time
from typing import Any, Callable, Dict

logger = logging.getLogger("meridian.agents")


def make_log_entry(agent: str, status: str, message: str, extra: Dict[str, Any] = None) -> Dict[str, Any]:
    entry = {
        "agent": agent,
        "timestamp": time.strftime("%H:%M:%S"),
        "status": status,
        "message": message,
    }
    if extra:
        entry["extra"] = extra
    return entry


def with_retries(agent_name: str, max_attempts: int = 3, backoff_seconds: float = 0.25):
    """
    Decorator for LangGraph node functions. Retries the wrapped node on
    exception, logging each attempt. On final failure, raises so the graph
    execution surfaces the error rather than silently continuing with bad
    state (a partially-failed pipeline should not report a false "completed").
    """

    def decorator(fn: Callable[[Dict[str, Any]], Dict[str, Any]]):
        @functools.wraps(fn)
        def wrapper(state: Dict[str, Any]) -> Dict[str, Any]:
            last_error = None
            for attempt in range(1, max_attempts + 1):
                try:
                    logger.info("[%s] attempt %d/%d starting", agent_name, attempt, max_attempts)
                    result = fn(state)
                    logger.info("[%s] attempt %d/%d succeeded", agent_name, attempt, max_attempts)
                    return result
                except Exception as exc:  # noqa: BLE001 - intentionally broad, this is a retry boundary
                    last_error = exc
                    logger.warning(
                        "[%s] attempt %d/%d failed: %s", agent_name, attempt, max_attempts, exc
                    )
                    if attempt < max_attempts:
                        time.sleep(backoff_seconds * attempt)
            logger.error("[%s] all %d attempts failed", agent_name, max_attempts)
            raise RuntimeError(f"Agent '{agent_name}' failed after {max_attempts} attempts: {last_error}")

        return wrapper

    return decorator
