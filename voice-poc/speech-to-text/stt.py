import pyaudio
import wave
import tempfile
import os
import requests
import json
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class SpeechToText:
    def __init__(self, api_key: str | None = None):
        """Initialize the Speech-to-Text client with Deepgram API key."""
        self.api_key = api_key or os.getenv("DEEPGRAM_API_KEY")
        if not self.api_key:
            raise ValueError("Deepgram API key is required. Set DEEPGRAM_API_KEY environment variable or pass it directly.")
        
        self.base_url = "https://api.deepgram.com/v1/listen"
        
        # Audio recording settings
        self.chunk = 1024
        self.format = pyaudio.paInt16
        self.channels = 1
        self.rate = 16000
        
    def record_audio(self, duration: int = 5) -> str:
        """Record audio from microphone and save to temporary file."""
        print(f"Recording for {duration} seconds...")
        
        p = pyaudio.PyAudio()
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
        temp_filename = temp_file.name
        temp_file.close()
        
        try:
            # Start recording
            stream = p.open(
                format=self.format,
                channels=self.channels,
                rate=self.rate,
                input=True,
                frames_per_buffer=self.chunk
            )
            
            frames = []
            for i in range(0, int(self.rate / self.chunk * duration)):
                data = stream.read(self.chunk)
                frames.append(data)
            
            # Stop recording
            stream.stop_stream()
            stream.close()
            
            # Save to file
            wf = wave.open(temp_filename, 'wb')
            wf.setnchannels(self.channels)
            wf.setsampwidth(p.get_sample_size(self.format))
            wf.setframerate(self.rate)
            wf.writeframes(b''.join(frames))
            wf.close()
            
            print("Recording complete!")
            return temp_filename
            
        finally:
            p.terminate()
    
    def transcribe_file(self, audio_file_path: str) -> dict:
        """Transcribe audio file using Deepgram REST API."""
        try:
            # Headers for the request
            headers = {
                "Authorization": f"Token {self.api_key}",
                "Content-Type": "audio/wav"
            }
            
            # Parameters for transcription
            params = {
                "model": "nova-2",
                "smart_format": "true",
                "utterances": "true",
                "punctuate": "true",
                "diarize": "true"
            }
            
            # Read the audio file
            with open(audio_file_path, "rb") as audio_file:
                # Make request to Deepgram API
                response = requests.post(
                    self.base_url,
                    headers=headers,
                    params=params,
                    data=audio_file,
                    timeout=30
                )
            
            # Check if request was successful
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"API request failed with status {response.status_code}: {response.text}"}
            
        except Exception as e:
            print(f"Error during transcription: {e}")
            return {"error": str(e)}
    
    def extract_transcript(self, response: dict) -> str:
        """Extract the transcript text from Deepgram response."""
        try:
            if "error" in response:
                return f"Error: {response['error']}"
            
            # Extract the transcript text
            if "results" in response and "channels" in response["results"]:
                channels = response["results"]["channels"]
                if channels and len(channels) > 0:
                    alternatives = channels[0].get("alternatives", [])
                    if alternatives and len(alternatives) > 0:
                        transcript = alternatives[0].get("transcript", "")
                        return transcript if transcript else "No speech detected"
            
            return "No speech detected"
            
        except Exception as e:
            return f"Error extracting transcript: {e}"
    
    def record_and_transcribe(self, duration: int = 5) -> str:
        """Record audio and transcribe it in one go."""
        # Record audio
        audio_file = self.record_audio(duration)
        
        try:
            # Transcribe
            response = self.transcribe_file(audio_file)
            transcript = self.extract_transcript(response)
            return transcript
        finally:
            # Clean up temporary file
            if os.path.exists(audio_file):
                os.unlink(audio_file)

def main():
    """Example usage of the SpeechToText class."""
    try:
        # Initialize STT
        stt = SpeechToText()
        
        print("Speech-to-Text Demo")
        print("==================")
        print("Make sure you have set DEEPGRAM_API_KEY in your .env file")
        print("You'll need a microphone connected to your system")
        
        while True:
            user_input = input("\nPress Enter to record (5 seconds) or type 'quit' to exit: ").strip().lower()
            
            if user_input == 'quit':
                break
            
            # Record and transcribe
            transcript = stt.record_and_transcribe(duration=5)
            print(f"\nTranscript: {transcript}")
    
    except KeyboardInterrupt:
        print("\nExiting...")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
