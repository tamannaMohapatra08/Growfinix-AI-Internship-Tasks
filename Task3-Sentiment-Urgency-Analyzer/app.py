import json
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


def load_environment() -> None:
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if os.path.isfile(env_path):
        with open(env_path, encoding="utf-8") as env_file:
            for line in env_file:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, value = line.split("=", 1)
                    os.environ.setdefault(key.strip(), value.strip().strip("\"'"))


def main() -> None:
    load_environment()
    token = os.getenv("HF_TOKEN")
    if not token:
        raise SystemExit(
            "HF_TOKEN is missing. Add your Hugging Face token to the .env file."
        )

    text = input("Enter customer feedback: ").strip()
    if not text:
        raise SystemExit("Customer feedback cannot be empty.")

    prompt = f"""
Analyze the following customer feedback.

Return ONLY valid JSON.

The JSON must contain:
- sentiment: Positive, Negative, or Neutral
- urgency: High, Medium, or Low
- complaint: short explanation of the main complaint or praise

Customer feedback:
{text}
"""

    payload = json.dumps(
        {
            "model": "Qwen/Qwen2.5-7B-Instruct",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 200,
        }
    ).encode("utf-8")
    request = Request(
        "https://router.huggingface.co/v1/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=60) as response:
            response_data = json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        details = error.read().decode("utf-8", errors="replace").strip()
        message = f"Hugging Face returned HTTP {error.code} {error.reason}."
        if details:
            message += f"\nDetails: {details}"
        raise SystemExit(message) from error
    except URLError as error:
        raise SystemExit(f"Could not connect to Hugging Face: {error.reason}") from error

    try:
        result = response_data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as error:
        raise SystemExit(
            f"Hugging Face returned an unexpected response: {response_data}"
        ) from error

    print("\n===== AI ANALYSIS =====")
    print(result)


if __name__ == "__main__":
    main()
