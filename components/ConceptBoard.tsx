import React, { useState } from 'react';
import { ConceptBoardResult } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Props {
  data: ConceptBoardResult;
  isLoading: boolean;
  onUpdate?: (updatedData: ConceptBoardResult) => void;
}

const ConceptBoard: React.FC<Props> = ({ data, isLoading, onUpdate }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPDF = async () => {
    const input = document.getElementById('concept-board-export-area');
    if (!input) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(input, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Needed for base64 images sometimes or external resources
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Handle multi-page if content is very long (though usually one page for concept board)
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('AI_Concept_Board.pdf');
    } catch (error) {
      console.error('PDF generation failed', error);
      alert('PDF 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleChange = (field: keyof ConceptBoardResult, value: string) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        [field]: value
      });
    }
  };

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
    <div className="flex flex-col gap-4">
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="text-sm text-slate-500 px-2">
          💡 텍스트를 클릭하여 내용을 직접 수정할 수 있습니다.
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={isExporting}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-all ${
            isExporting 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 shadow hover:shadow-md'
          }`}
        >
          {isExporting ? '다운로드 중...' : 'PDF 다운로드 📥'}
        </button>
      </div>

      {/* Concept Board Area */}
      <div 
        id="concept-board-export-area"
        className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200"
      >
        <div className="bg-indigo-600 p-4 text-white text-center font-bold text-xl tracking-wide">
          PROJECT CONCEPT BOARD
        </div>
        
        <div className="p-6">
          <table className="w-full border-collapse table-fixed">
            <tbody>
              <tr className="border-b border-slate-200">
                <th className="w-1/4 py-4 px-6 bg-slate-50 text-left text-slate-700 font-bold border-r border-slate-200 align-middle">
                  한 줄 컨셉
                </th>
                <td className="w-3/4 py-2 px-4 text-slate-800 text-lg font-medium leading-relaxed">
                  <textarea 
                    value={data.oneLineConcept}
                    onChange={(e) => handleChange('oneLineConcept', e.target.value)}
                    className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded p-2 outline-none resize-none transition-all"
                    rows={2}
                  />
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <th className="py-4 px-6 bg-slate-50 text-left text-slate-700 font-bold border-r border-slate-200 align-middle">
                  장르 및 포맷
                </th>
                <td className="py-2 px-4 text-slate-600">
                  <textarea 
                    value={data.genreFormat}
                    onChange={(e) => handleChange('genreFormat', e.target.value)}
                    className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded p-2 outline-none resize-none transition-all"
                    rows={2}
                  />
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <th className="py-4 px-6 bg-slate-50 text-left text-slate-700 font-bold border-r border-slate-200 align-middle">
                  핵심 메시지
                </th>
                <td className="py-2 px-4 text-slate-600">
                  <textarea 
                    value={data.keyMessage}
                    onChange={(e) => handleChange('keyMessage', e.target.value)}
                    className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded p-2 outline-none resize-none transition-all"
                    rows={3}
                  />
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <th className="py-4 px-6 bg-slate-50 text-left text-slate-700 font-bold border-r border-slate-200 align-middle">
                  캐릭터 / 페르소나
                </th>
                <td className="py-2 px-4 text-slate-600">
                  <textarea 
                    value={data.character}
                    onChange={(e) => handleChange('character', e.target.value)}
                    className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded p-2 outline-none resize-none transition-all"
                    rows={3}
                  />
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <th className="py-4 px-6 bg-slate-50 text-left text-slate-700 font-bold border-r border-slate-200 align-middle">
                  톤 앤 매너
                </th>
                <td className="py-2 px-4 text-slate-600">
                  <textarea 
                    value={data.toneManner}
                    onChange={(e) => handleChange('toneManner', e.target.value)}
                    className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded p-2 outline-none resize-none transition-all"
                    rows={3}
                  />
                </td>
              </tr>
              <tr>
                <th className="py-4 px-6 bg-slate-50 text-left text-slate-700 font-bold border-r border-slate-200 align-top">
                  컨셉 이미지
                </th>
                <td className="py-4 px-6">
                  {data.generatedImageBase64 ? (
                    <div className="flex flex-col gap-2">
                      <div className="relative group w-full max-w-md rounded-lg overflow-hidden shadow-md mx-auto">
                        <img 
                          src={`data:image/jpeg;base64,${data.generatedImageBase64}`} 
                          alt="Generated Concept" 
                          className="w-full h-auto object-cover"
                        />
                      </div>
                      <div className="mt-2">
                         <label className="text-xs text-slate-400 font-bold mb-1 block">프롬프트 (수정 불가)</label>
                         <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">{data.imagePrompt}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-100 rounded-lg p-4 border border-slate-300 border-dashed">
                      <p className="text-slate-500 text-sm italic mb-2">이미지를 생성하지 못했습니다. 아래 프롬프트를 참고하세요:</p>
                      <textarea 
                        value={data.imagePrompt}
                        onChange={(e) => handleChange('imagePrompt', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded p-2 text-sm font-mono text-slate-700"
                        rows={3}
                      />
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConceptBoard;