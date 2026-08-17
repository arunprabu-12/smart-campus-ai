"""
AI service using HuggingFace Inference API (originally Gemini).
Falls back gracefully if HF_API_KEY is missing or the call fails.
"""
import requests
from app.config import settings

def query_gemini(prompt: str, system_instruction: str = None) -> str:
    """
    Generate content via HuggingFace Inference API.
    (Function name kept as query_gemini for backward compatibility).
    """
    if not settings.hf_api_key:
        return (
            "ℹ️ **HuggingFace API key not configured.**\n\n"
            "Add your key to `backend/.env`:\n"
            "```\nHF_API_KEY=your_key_here\n```\n"
        )

    # Use a solid instruction-tuned model available on the free tier
    model = "Qwen/Qwen2.5-72B-Instruct"
    api_url = f"https://api-inference.huggingface.co/models/{model}"
    headers = {"Authorization": f"Bearer {settings.hf_api_key}"}
    
    # Format prompt for the model
    formatted_prompt = ""
    if system_instruction:
        formatted_prompt += f"<|im_start|>system\n{system_instruction}<|im_end|>\n"
    formatted_prompt += f"<|im_start|>user\n{prompt}<|im_end|>\n<|im_start|>assistant\n"

    try:
        response = requests.post(
            api_url,
            headers=headers,
            json={
                "inputs": formatted_prompt,
                "parameters": {
                    "max_new_tokens": 1024,
                    "return_full_text": False,
                    "temperature": 0.7
                }
            }
        )
        
        if response.status_code != 200:
            print(f"[HF API Error] {response.status_code}: {response.text}")
            return f"⚠️ HF API error ({response.status_code}). Check your HF_API_KEY."
            
        result = response.json()
        if isinstance(result, list) and len(result) > 0 and "generated_text" in result[0]:
            return result[0]["generated_text"].strip()
        else:
            return str(result)
            
    except Exception as e:
        print(f"[HF Request Error] {e}")
        return f"⚠️ API Request failed: {e}"

