#!/usr/bin/env python3
"""
CRETA MEDIA — Google Gemini Direct Connector
Connects Gemini AI models directly to CRETA MEDIA 3D Virtual Studio, Dubbing pipeline & WhatsApp.
"""

import os
import sys
import json
import urllib.request
import urllib.error

CRETA_BASE_URL = os.environ.get("CRETA_API_URL", "http://localhost:3000")

def load_gemini_tools():
    tools_path = os.path.join(os.path.dirname(__file__), "gemini-tools.json")
    if os.path.exists(tools_path):
        with open(tools_path, "r", encoding="utf-8") as f:
            return json.load(f).get("functionDeclarations", [])
    return []

def call_creta_api(endpoint, method="GET", payload=None):
    url = f"{CRETA_BASE_URL}{endpoint}"
    data = json.dumps(payload).encode("utf-8") if payload else None
    headers = {"Content-Type": "application/json"}
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return {"error": str(e)}

def execute_gemini_tool(tool_name, args):
    print(f"\n⚡ Gemini executing tool: {tool_name} with args: {args}")
    if tool_name == "creta_get_departments":
        return call_creta_api("/api/v1/departments", "GET")
    elif tool_name == "creta_navigate_department":
        return call_creta_api("/api/v1/departments/navigate", "POST", args)
    elif tool_name == "creta_send_whatsapp":
        return call_creta_api("/api/v1/services/whatsapp", "POST", args)
    elif tool_name == "creta_request_dubbing":
        return call_creta_api("/api/v1/services/voice-dubbing", "POST", args)
    elif tool_name == "creta_request_video_editing":
        return call_creta_api("/api/v1/services/video-editing", "POST", args)
    elif tool_name == "creta_request_microdrama":
        return call_creta_api("/api/v1/services/microdrama", "POST", args)
    else:
        return {"error": f"Unknown tool: {tool_name}"}

def main():
    print("=" * 60)
    print("  ✨ CRETA MEDIA — Google Gemini AI Assistant Connector")
    print("=" * 60)
    print(f"📡 Connected to Studio: {CRETA_BASE_URL}")
    print("🤖 Supported Tools: 3D Studio Tour, 70+ Language Dubbing, 4K Editing, WhatsApp")
    print("-" * 60)

    # Check if google-genai is available
    try:
        import google.generativeai as genai
    except ImportError:
        print("\n💡 To run live chat with Google Gemini, install the official package:")
        print("   pip install google-generativeai")
        print("\nAlternatively, you can import 'gemini-tools.json' directly into")
        print("Google AI Studio (https://aistudio.google.com) under Function Calling!")
        return

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        api_key = input("\nEnter your Google Gemini API Key (or press Enter to exit):\n> ").strip()

    if not api_key:
        print("\nExiting. You can set the key anytime with: set GEMINI_API_KEY=your_key")
        return

    genai.configure(api_key=api_key)
    tools = load_gemini_tools()

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        tools=[{"function_declarations": tools}],
        system_instruction=(
            "You are the executive AI director for CRETA MEDIA ('Stories. Made to Travel.'). "
            "You have direct tools to navigate the 3D studio, schedule voice dubbing in 70+ languages, "
            "order 4K DaVinci Resolve edits, and send real-time WhatsApp updates to users."
        )
    )

    chat = model.start_chat(enable_automatic_function_calling=False)
    print("\n✅ Gemini is connected and ready! Type your message (e.g. 'Show me the dubbing room and send WhatsApp to 919068734941')")
    print("Type 'exit' or 'quit' to stop.\n")

    while True:
        try:
            user_input = input("You > ").strip()
            if not user_input or user_input.lower() in ["exit", "quit"]:
                break

            response = chat.send_message(user_input)

            # Handle function calling loop
            while response.candidates and response.candidates[0].content.parts:
                part = response.candidates[0].content.parts[0]
                if hasattr(part, "function_call") and part.function_call:
                    fc = part.function_call
                    fn_name = fc.name
                    fn_args = dict(fc.args)
                    fn_result = execute_gemini_tool(fn_name, fn_args)
                    print(f"📦 Tool Result: {json.dumps(fn_result, indent=2)}")

                    # Send tool result back to Gemini
                    response = chat.send_message({
                        "role": "function",
                        "parts": [{
                            "function_response": {
                                "name": fn_name,
                                "response": fn_result
                            }
                        }]
                    })
                else:
                    break

            if response.text:
                print(f"\nGemini > {response.text}\n")

        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
