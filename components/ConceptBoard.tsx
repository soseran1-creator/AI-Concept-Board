import React from 'react';
import { ConceptBoardResult } from '../types';

interface Props {
  data: ConceptBoardResult;
  isLoading: boolean;
}

const ConceptBoard: React.FC<Props> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-xl shadow-lg border border-slate-200 p-8 animate-pulse">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium text-lg">AI가 컨셉보드를 기획하고 있습니다...</p>
        <p className="text-slate-400 text-sm mt-2">이미지 생성에는 시간이 조금 걸릴 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
      <div className="bg-indigo-600 p-4 text-white text-center font-bold text-xl tracking-wide">
        PROJECT CONCEPT BOARD
      </div>
      
      <div className="p-6 overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <tbody>
            <tr className="border-b border-slate-200">
              <th className="w-1/4 py-4 px-6 bg-slate-50 text-left text-slate-700 font-bold border-r border-slate-200 align-middle">
                한 줄 컨셉
              </th>
              <td className="w-3/4 py-4 px-6 text-slate-800 text-lg font-medium leading-relaxed">
                {data.oneLineConcept}
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <th className="py-4 px-6 bg-slate-50 text-left text-slate-700 font-bold border-r border-slate-200 align-middle">
                장르 및 포맷
              </th>
              <td className="py-4 px-6 text-slate-600">
                {data.genreFormat}
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <th className="py-4 px-6 bg-slate-50 text-left text-slate-700 font-bold border-r border-slate-200 align-middle">
                핵심 메시지
              </th>
              <td className="py-4 px-6 text-slate-600">
                {data.keyMessage}
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <th className="py-4 px-6 bg-slate-50 text-left text-slate-700 font-bold border-r border-slate-200 align-middle">
                캐릭터 / 페르소나
              </th>
              <td className="py-4 px-6 text-slate-600">
                {data.character}
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <th className="py-4 px-6 bg-slate-50 text-left text-slate-700 font-bold border-r border-slate-200 align-middle">
                톤 앤 매너
              </th>
              <td className="py-4 px-6 text-slate-600">
                {data.toneManner}
              </td>
            </tr>
            <tr>
              <th className="py-4 px-6 bg-slate-50 text-left text-slate-700 font-bold border-r border-slate-200 align-top">
                컨셉 이미지
              </th>
              <td className="py-4 px-6">
                {data.generatedImageBase64 ? (
                  <div className="relative group w-full max-w-md rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={`data:image/jpeg;base64,${data.generatedImageBase64}`} 
                      alt="Generated Concept" 
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                      <p className="text-white text-xs text-center">{data.imagePrompt}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-100 rounded-lg p-4 border border-slate-300 border-dashed">
                    <p className="text-slate-500 text-sm italic mb-2">이미지를 생성하지 못했습니다. 아래 프롬프트를 참고하세요:</p>
                    <p className="text-slate-700 text-sm font-mono bg-white p-2 rounded border border-slate-200">
                      {data.imagePrompt}
                    </p>
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConceptBoard;