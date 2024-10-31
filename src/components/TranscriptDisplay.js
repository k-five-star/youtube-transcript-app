'use client';

export default function TranscriptDisplay({ transcript, summary, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {transcript && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">자막</h2>
          <div className="max-h-[400px] overflow-y-auto">
            <pre className="whitespace-pre-wrap font-sans text-gray-700">
              {transcript}
            </pre>
          </div>
        </div>
      )}

      {summary && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">요약</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700">{summary}</p>
          </div>
        </div>
      )}

      {!transcript && !summary && (
        <div className="text-center text-gray-500 py-8">
          YouTube URL을 입력하고 자막을 추출해보세요.
        </div>
      )}
    </div>
  );
}