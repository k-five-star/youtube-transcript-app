'use client';
import { useState } from 'react';

export default function TranscriptForm({ transcript, loading, setTranscript, setSummary, setLoading }) {
  const [url, setUrl] = useState('');

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      alert('올바른 YouTube URL을 입력해주세요');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/get-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ video_id: videoId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || '자막을 가져오는데 실패했습니다.');
      }

      if (data.transcript) {
        setTranscript(data.transcript);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('자막을 가져오는데 실패했습니다: ' + error.message);
    }
    setLoading(false);
  };

  const handleSummarize = async () => {
    if (!transcript) {
      alert('먼저 자막을 추출해주세요');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: transcript }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || '요약하는데 실패했습니다.');
      }

      if (data.summary) {
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('요약하는데 실패했습니다: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="YouTube URL을 입력하세요"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            자막 추출
          </button>
          <button
            type="button"
            onClick={handleSummarize}
            disabled={!transcript}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
          >
            요약하기
          </button>
        </div>
      </div>
    </form>
  );
}