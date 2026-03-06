import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import BriefForm from './components/BriefForm';
import ConceptBoard from './components/ConceptBoard';
import { ApiProvider, AdvancedBrief, GeneralBrief, ConceptBoardResult } from './types';
import { generateConceptBoard } from './services/geminiService';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('AIzaSyCuGE0mS6988dVJc_WGWaLI0TChGnIunY0');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [result, setResult] = useState<ConceptBoardResult | null>(null);
  const [currentBrief, setCurrentBrief] = useState<GeneralBrief | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (general: GeneralBrief, advanced: AdvancedBrief) => {
    setIsGenerating(true);
    setError(null);
    setResult(null);
    setCurrentBrief(general); // Store the brief for display/export

    try {
      // Use the provided key or environment variable
      const finalApiKey = apiKey || process.env.GEMINI_API_KEY || '';
      const data = await generateConceptBoard(finalApiKey, general, advanced);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError("컨셉보드 생성에 실패했습니다. API 키 설정이나 네트워크 상태를 확인해주세요. (" + err.message + ")");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateResult = (updatedData: ConceptBoardResult) => {
    setResult(updatedData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50 text-slate-900 font-sans pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              AI Concept Board
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
              Gemini AI Active
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Input Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">📝 브리프 입력</h2>
                <span className="text-xs text-slate-500">자세히 적을수록 좋은 결과가 나옵니다.</span>
            </div>
            <BriefForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          </div>

          {/* Right: Result Board */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">✨ 컨셉보드 결과</h2>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                ⚠️ {error}
              </div>
            )}
            {result || isGenerating ? (
              <ConceptBoard 
                data={result || {
                  oneLineConcept: '', genreFormat: '', keyMessage: '', character: '', toneManner: '', imagePrompt: ''
                }} 
                generalBrief={currentBrief}
                isLoading={isGenerating} 
                onUpdate={handleUpdateResult}
              />
            ) : (
              <div className="h-[600px] flex flex-col items-center justify-center bg-white/50 border-2 border-dashed border-slate-300 rounded-xl text-slate-400">
                <span className="text-4xl mb-4">👈</span>
                <p>왼쪽에서 브리프를 작성하고<br/>'생성하기' 버튼을 눌러주세요.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;