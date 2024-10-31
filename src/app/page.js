'use client';
import { useState } from 'react';
import TranscriptForm from '../components/TranscriptForm';
import TranscriptDisplay from '../components/TranscriptDisplay';

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          YouTube Transcript Extractor
        </h1>
        
        <TranscriptForm 
          transcript={transcript}
          setTranscript={setTranscript}
          setSummary={setSummary}
          setLoading={setLoading}
        />
        
        <TranscriptDisplay 
          transcript={transcript}
          summary={summary}
          loading={loading}
        />
      </div>
    </main>
  );
}