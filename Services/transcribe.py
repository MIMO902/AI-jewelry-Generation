import sys
import whisper

def transcribe_audio(audio_path):
    try:
        # Load Whisper model
        model = whisper.load_model("base")
        # Transcribe the audio
        result = model.transcribe(audio_path)
        return result["text"]
    except Exception as e:
        print(f"Error during transcription: {str(e)}")
        sys.exit(1)  # Ensure the Python process returns a failure code

if __name__ == "__main__":
    audio_path = sys.argv[1]
    transcription = transcribe_audio(audio_path)
    print(transcription)

