"""
Basic Text-to-Speech implementation using Deepgram
Proof of concept for GRACE companion app
"""

import os
import asyncio
import json
from pathlib import Path
from typing import Optional, Dict, Any
import httpx
from io import BytesIO


class DeepgramTTS:
    """Simple Deepgram Text-to-Speech client"""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Deepgram TTS client
        
        Args:
            api_key: Deepgram API key. If not provided, will look for DEEPGRAM_API_KEY env var
        """
        self.api_key = api_key or os.getenv("DEEPGRAM_API_KEY")
        if not self.api_key:
            raise ValueError("Deepgram API key is required. Set DEEPGRAM_API_KEY environment variable or pass api_key parameter.")
        
        self.base_url = "https://api.deepgram.com/v1/speak"
        self.headers = {
            "Authorization": f"Token {self.api_key}",
            "Content-Type": "application/json"
        }
    
    async def text_to_speech(
        self, 
        text: str, 
        model: str = "aura-asteria-en",
        encoding: str = "linear16",
        sample_rate: int = 24000
    ) -> bytes:
        """
        Convert text to speech using Deepgram TTS API
        
        Args:
            text: Text to convert to speech
            model: Voice model to use (default: aura-asteria-en)
            encoding: Audio encoding format (default: linear16)
            sample_rate: Audio sample rate (default: 24000)
            
        Returns:
            Audio data as bytes
        """
        if not text.strip():
            raise ValueError("Text cannot be empty")
        
        payload = {
            "text": text
        }
        
        params = {
            "model": model,
            "encoding": encoding,
            "sample_rate": sample_rate
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.base_url,
                    headers=self.headers,
                    json=payload,
                    params=params,
                    timeout=30.0
                )
                response.raise_for_status()
                return response.content
                
            except httpx.HTTPError as e:
                raise Exception(f"Deepgram TTS API error: {e}")
    
    def text_to_speech_sync(
        self, 
        text: str, 
        model: str = "aura-asteria-en",
        encoding: str = "linear16",
        sample_rate: int = 24000
    ) -> bytes:
        """
        Synchronous version of text_to_speech
        
        Args:
            text: Text to convert to speech
            model: Voice model to use
            encoding: Audio encoding format
            sample_rate: Audio sample rate
            
        Returns:
            Audio data as bytes
        """
        return asyncio.run(self.text_to_speech(text, model, encoding, sample_rate))
    
    async def save_speech_to_file(
        self,
        text: str,
        filename: str,
        model: str = "aura-asteria-en",
        encoding: str = "linear16",
        sample_rate: int = 24000
    ) -> str:
        """
        Convert text to speech and save to file
        
        Args:
            text: Text to convert to speech
            filename: Output filename (without extension)
            model: Voice model to use
            encoding: Audio encoding format
            sample_rate: Audio sample rate
            
        Returns:
            Path to saved file
        """
        audio_data = await self.text_to_speech(text, model, encoding, sample_rate)
        
        # Determine file extension based on encoding
        ext = "wav" if encoding == "linear16" else "mp3"
        filepath = f"{filename}.{ext}"
        
        with open(filepath, "wb") as f:
            f.write(audio_data)
        
        return filepath


def create_tts_client(api_key: Optional[str] = None) -> DeepgramTTS:
    """
    Factory function to create TTS client
    
    Args:
        api_key: Optional Deepgram API key
        
    Returns:
        Configured DeepgramTTS instance
    """
    return DeepgramTTS(api_key)


# Example usage and testing
async def main():
    """Test the TTS functionality"""
    try:
        # Create TTS client
        tts = create_tts_client()
        
        # Test text
        test_text = "Hello! I'm Grace, your AI companion. How are you feeling today?"
        
        print(f"Converting text to speech: '{test_text}'")
        
        # Generate speech
        audio_data = await tts.text_to_speech(test_text)
        print(f"Generated audio data: {len(audio_data)} bytes")
        
        # Save to file
        output_file = await tts.save_speech_to_file(test_text, "test_output")
        print(f"Audio saved to: {output_file}")
        
        print("TTS test completed successfully!")
        
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    # Run the test
    asyncio.run(main())
