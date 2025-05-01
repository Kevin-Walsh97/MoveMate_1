from fastapi import FastAPI, Request
from pydantic import BaseModel
import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

class UserMessage(BaseModel):
    message: str
    session_id: str

conversation_memory = {}

SYSTEM_PROMPT = """
You are a friendly assistant that helps users plan their upcoming move.
Your goal is to ask smart follow-up questions to understand the user's needs:
- Where they’re moving from and to
- When they’re moving
- What items they’re moving (bed, desk, boxes, etc.)
- Whether they need movers, a truck, or storage
- Their budget
- If they’d like to finance the move
Summarize their needs and match them to appropriate services at the end.
"""

@app.post("/chat")
async def chat(user_input: UserMessage):
    session_id = user_input.session_id
    user_msg = user_input.message

    if session_id not in conversation_memory:
        conversation_memory[session_id] = [
            {"role": "system", "content": SYSTEM_PROMPT},
        ]

    conversation_memory[session_id].append({"role": "user", "content": user_msg})

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=conversation_memory[session_id],
        temperature=0.7
    )

    bot_reply = response['choices'][0]['message']['content']
    conversation_memory[session_id].append({"role": "assistant", "content": bot_reply})

    return {"reply": bot_reply}
