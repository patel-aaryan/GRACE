import requests
import json
import sys
import argparse

GEMINI_API_KEY = "AIzaSyDjgELsmsqUi8_Jw-yhpB9_z2GSaYbqBCQ"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

def send_prompt_to_gemini(prompt):
    """
    Send a prompt to Gemini AI and return the response
    """
    headers = {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
    }
    
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }
    
    try:
        response = requests.post(GEMINI_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        response_data = response.json()
        
        # Extract the text from the response
        if 'candidates' in response_data and len(response_data['candidates']) > 0:
            candidate = response_data['candidates'][0]
            if 'content' in candidate and 'parts' in candidate['content']:
                parts = candidate['content']['parts']
                if len(parts) > 0 and 'text' in parts[0]:
                    return parts[0]['text']
        
        return "No response received from Gemini"
        
    except requests.exceptions.RequestException as e:
        return f"Error making request: {e}"
    except json.JSONDecodeError as e:
        return f"Error parsing response: {e}"
    except Exception as e:
        return f"Unexpected error: {e}"

def main():
    parser = argparse.ArgumentParser(description='Send prompts to Gemini AI from terminal')
    parser.add_argument('prompt', nargs='*', help='The prompt to send to Gemini AI')
    parser.add_argument('--interactive', '-i', action='store_true', help='Run in interactive mode')
    
    args = parser.parse_args()
    
    if args.interactive:
        print("Gemini AI Terminal Interface (type 'exit' to quit)")
        print("-" * 50)
        
        while True:
            try:
                prompt = input("\nEnter your prompt: ").strip()
                
                if prompt.lower() in ['exit', 'quit', 'q']:
                    print("Goodbye!")
                    break
                
                if not prompt:
                    print("Please enter a prompt.")
                    continue
                
                print("\nSending to Gemini...")
                response = send_prompt_to_gemini(prompt)
                print(f"\nGemini Response:")
                print("-" * 30)
                print(response)
                print("-" * 30)
                
            except KeyboardInterrupt:
                print("\n\nGoodbye!")
                break
            except Exception as e:
                print(f"Error: {e}")
    
    else:
        if not args.prompt:
            print("Error: Please provide a prompt or use --interactive mode")
            print("Usage:")
            print("  python main.py 'Your prompt here'")
            print("  python main.py --interactive")
            sys.exit(1)
        
        prompt = ' '.join(args.prompt)
        print(f"Sending prompt to Gemini: {prompt}")
        print("-" * 50)
        
        response = send_prompt_to_gemini(prompt)
        print(response)

if __name__ == "__main__":
    main()








