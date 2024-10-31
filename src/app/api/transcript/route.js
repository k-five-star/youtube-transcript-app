import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { videoId } = await request.json();
    
    // Python FastAPI 서버로 요청
    const response = await fetch('http://localhost:8000/api/get-transcript', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ video_id: videoId }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to fetch transcript');
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}