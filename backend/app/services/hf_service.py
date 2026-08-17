"""
Qwen/Qwen3-8B via HuggingFace Inference API — Primary AI backbone.
Model: https://huggingface.co/Qwen/Qwen3-8B

Qwen3-8B features:
  - Thinking / non-thinking mode switchable per call
  - 8.2B parameters, 32K context natively
  - Expert-level agentic tool-use, coding, math, multilingual
  - Chat template format (uses <|im_start|> tokens)

Usage:
  Set HF_API_KEY in .env — get a free token at huggingface.co/settings/tokens
  Model ID: Qwen/Qwen3-8B

API endpoint used: https://api-inference.huggingface.co/models/Qwen/Qwen3-8B
"""

import os
import re
import json
import httpx
from typing import Optional

HF_API_KEY = os.getenv("HF_API_KEY", "")

# Primary model — Qwen3-8B
QWEN3_8B = "Qwen/Qwen3-8B"

# Fallback for embedding tasks
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

HF_INFERENCE_URL = f"https://api-inference.huggingface.co/models/{QWEN3_8B}"
HF_HEADERS = lambda: {"Authorization": f"Bearer {HF_API_KEY}", "Content-Type": "application/json"}


def _build_qwen_prompt(
    user_message: str,
    system_instruction: str = "You are a helpful academic AI assistant.",
    thinking: bool = False,
) -> str:
    """
    Build the Qwen3 chat template prompt string.
    Qwen3 uses ChatML format:
      <|im_start|>system\\n{system}<|im_end|>\\n
      <|im_start|>user\\n{user}<|im_end|>\\n
      <|im_start|>assistant\\n
    When thinking=False we append /no_think to disable chain-of-thought.
    """
    think_suffix = "" if thinking else " /no_think"
    prompt = (
        f"<|im_start|>system\n{system_instruction}<|im_end|>\n"
        f"<|im_start|>user\n{user_message}{think_suffix}<|im_end|>\n"
        f"<|im_start|>assistant\n"
    )
    return prompt


def _strip_think_tags(text: str) -> str:
    """Remove <think>...</think> block from Qwen3 thinking-mode output."""
    # Strip the thinking block; keep only content after </think>
    cleaned = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()
    return cleaned if cleaned else text.strip()


def qwen_generate(
    prompt: str,
    system_instruction: str = "You are a helpful academic AI assistant.",
    max_tokens: int = 1024,
    temperature: float = 0.7,
    thinking: bool = False,
) -> str:
    """
    Generate text using Qwen/Qwen3-8B via HuggingFace Inference API.

    Args:
        prompt: User message / question.
        system_instruction: System role context.
        max_tokens: Maximum tokens to generate.
        temperature: 0.6 recommended for thinking, 0.7 for non-thinking.
        thinking: If True enables Qwen3 chain-of-thought reasoning mode.

    Returns:
        Generated text string (think tags stripped).
    """
    if not HF_API_KEY:
        return (
            "[Qwen3-8B not configured] Add HF_API_KEY to backend/.env. "
            "Get a free token at https://huggingface.co/settings/tokens"
        )

    full_prompt = _build_qwen_prompt(prompt, system_instruction, thinking=thinking)

    # Qwen3 recommended sampling params
    temp = 0.6 if thinking else temperature
    top_p = 0.95 if thinking else 0.8

    payload = {
        "inputs": full_prompt,
        "parameters": {
            "max_new_tokens": max_tokens,
            "temperature": temp,
            "top_p": top_p,
            "top_k": 20,
            "do_sample": True,
            "return_full_text": False,
            "stop": ["<|im_end|>", "<|endoftext|>"],
        },
    }

    try:
        resp = httpx.post(
            HF_INFERENCE_URL,
            headers=HF_HEADERS(),
            json=payload,
            timeout=60.0,
        )

        if resp.status_code == 200:
            data = resp.json()
            if isinstance(data, list) and data:
                raw = data[0].get("generated_text", "").strip()
                return _strip_think_tags(raw)
            return str(data)

        elif resp.status_code == 503:
            # Model loading (cold start) — return a graceful message
            return (
                "🔄 Qwen3-8B is loading (cold start ~20s). "
                "Please retry in a moment. The model will be ready shortly."
            )

        elif resp.status_code == 401:
            return "[HF Auth Error] Invalid HF_API_KEY. Check your token at huggingface.co/settings/tokens"

        elif resp.status_code == 429:
            return "[HF Rate Limit] Too many requests. Qwen3-8B free tier has rate limits. Retry in 60s."

        else:
            return f"[Qwen3-8B API Error {resp.status_code}]: {resp.text[:300]}"

    except httpx.TimeoutException:
        return "[Qwen3-8B Timeout] The model took too long. Try a shorter prompt or retry."
    except Exception as e:
        return f"[Qwen3-8B Connection Error]: {str(e)}"


def qwen_embed(text: str) -> Optional[list]:
    """Get text embeddings via HuggingFace sentence-transformers."""
    if not HF_API_KEY:
        return None
    try:
        resp = httpx.post(
            f"https://api-inference.huggingface.co/models/{EMBEDDING_MODEL}",
            headers=HF_HEADERS(),
            json={"inputs": text},
            timeout=20.0,
        )
        return resp.json() if resp.status_code == 200 else None
    except Exception:
        return None


# ─────────────────────────────────────────────────────────
# High-level academic helpers (used by learning_agent, test_agent)
# ─────────────────────────────────────────────────────────

def generate_study_content(topic: str, level: str = "undergraduate") -> str:
    """
    Generate structured study notes for a topic using Qwen3-8B.
    Used by learning_agent as primary AI content generator.
    """
    prompt = f"""Generate a concise, well-structured study note for a {level} student on: "{topic}".

Structure your response as:
## Introduction
(2-3 sentences)

## Key Concepts
(bullet points)

## Definitions / Formulas
(if applicable)

## Quick Summary
(1-2 sentences)

Keep it under 350 words. Make it exam-focused and precise."""

    return qwen_generate(
        prompt=prompt,
        system_instruction=(
            "You are an expert academic tutor for engineering and science students. "
            "Generate concise, accurate, exam-focused study notes."
        ),
        max_tokens=600,
        thinking=False,
    )


def generate_quiz_question(topic: str, difficulty: str = "medium") -> dict:
    """
    Generate a single MCQ quiz question using Qwen3-8B.
    Returns a dict with question, options, correct_answer, explanation.
    """
    prompt = f"""Create one multiple-choice question (MCQ) about "{topic}" at {difficulty} difficulty level.

Output ONLY valid JSON in this exact format (no markdown, no extra text):
{{
  "question": "the question text here",
  "options": ["A. option one", "B. option two", "C. option three", "D. option four"],
  "correct_answer": "A. option one",
  "explanation": "brief explanation of why this is correct"
}}"""

    result = qwen_generate(
        prompt=prompt,
        system_instruction="You are a quiz generator. Output only valid JSON. No markdown code blocks.",
        max_tokens=300,
        temperature=0.5,
        thinking=False,
    )

    # Parse JSON from result
    try:
        json_match = re.search(r"\{[\s\S]*\}", result)
        if json_match:
            return json.loads(json_match.group())
    except Exception:
        pass

    # Fallback question
    return {
        "question": f"What is the fundamental concept of {topic}?",
        "options": [
            "A. It is a core computational method",
            "B. It is unrelated to the field",
            "C. It only applies to advanced scenarios",
            "D. It was developed in the 19th century",
        ],
        "correct_answer": "A. It is a core computational method",
        "explanation": f"Generated by Qwen3-8B fallback for topic: {topic}",
    }


def answer_academic_question(question: str, context: str = "") -> str:
    """
    Answer a general academic / advisor question using Qwen3-8B with thinking mode.
    Used as a fallback when Gemini quota is exceeded.
    """
    ctx_block = f"\nContext:\n{context}\n" if context else ""
    prompt = f"{ctx_block}\nStudent question: {question}"

    return qwen_generate(
        prompt=prompt,
        system_instruction=(
            "You are an expert academic AI advisor for engineering students. "
            "Answer questions about courses, exams, regulations, and study strategies accurately. "
            "Be concise and helpful."
        ),
        max_tokens=800,
        thinking=True,  # Use Qwen3's reasoning for academic advice
    )


def generate_attendance_advice(student_name: str, low_courses: list) -> str:
    """Generate personalized attendance improvement advice using Qwen3-8B."""
    course_list = "\n".join(
        [f"- {c['course_name']}: {c['percentage']:.1f}% (need {c.get('required_classes_to_clear', 0)} more)"]
        for c in low_courses
    )
    prompt = f"""Student: {student_name}
Low attendance courses:
{course_list}
Minimum required: 75%

Write a brief (3-4 sentences) encouraging but urgent alert message that:
1. States the exact attendance problem
2. Warns about exam debarment risk
3. Gives one actionable tip to recover attendance"""

    return qwen_generate(
        prompt=prompt,
        system_instruction=(
            "You are a friendly but firm academic counselor. "
            "Send attendance alerts that motivate students to attend classes."
        ),
        max_tokens=200,
        thinking=False,
    )
