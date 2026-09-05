import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()


SYSTEM_PROMPT = """
You are NutriSaathi AI, a food and nutrition assistant.

Your job is to explain food products, ingredients, nutrition information,
dietary suitability, and NutriSaathi's analysis in simple language.

Important rules:
1. Use the provided NutriSaathi analysis as the source of truth.
2. Never override or contradict an allergy concern or dietary conflict
   identified by NutriSaathi.
3. Do not diagnose medical conditions or prescribe treatment.
4. Do not claim that a food is medically safe or unsafe.
5. Explain why NutriSaathi produced a particular result.
6. If product context is provided, answer specifically about that product.
7. If information is missing, say that you don't have enough information.
8. Keep answers concise, friendly, and easy for a normal Indian user to understand.
"""


def chat_with_groq(message, context=None):
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise ValueError("GROQ_API_KEY is not configured")

    client = Groq(api_key=api_key)

    context_text = ""

    if context:
        context_text = f"""
Here is the NutriSaathi analysis context:

{context}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": context_text + "\nUser question:\n" + message
            }
        ],
        temperature=0.3,
        max_tokens=500
    )

    return response.choices[0].message.content