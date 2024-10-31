from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi
from dotenv import load_dotenv
import openai
import os

# 환경 변수 로드
load_dotenv()
openai.api_key = os.environ.get('OPEN_AI_API_KEY')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    video_id: str

class SummaryRequest(BaseModel):
    text: str

@app.post("/api/get-transcript")
async def get_transcript(request: VideoRequest):
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(request.video_id, languages=['ko', 'en'])
        full_transcript = '\n'.join([entry['text'] for entry in transcript_list])
        return {"transcript": full_transcript}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/summarize")
async def summarize_text(request: SummaryRequest):
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes text. Please provide a concise summary in given language."},
                {"role": "user", "content": f"Please summarize the following text:\n\n{request.text}"}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        summary = response.choices[0].message.content
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)