import React, { useState, useRef, useEffect } from 'react';
import { ConceptBoardResult, GeneralBrief } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Props {
  data: ConceptBoardResult;
  generalBrief: GeneralBrief | null;
  isLoading: boolean;
  onUpdate?: (updatedData: ConceptBoardResult) => void;
}

// Helper component for auto-resizing textareas
const AutoResizeTextarea = ({
  value,
  onChange,
  className,
  minHeight = "60px",
  placeholder
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className: string;
  minHeight?: string;
  placeholder?: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scrollHeight
    }
  };

  useEffect(() => {
    resize();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      className={`${className} overflow-hidden`}
      style={{ minHeight: minHeight }}
      placeholder={placeholder}
      rows={1}
    />
  );
};

const ConceptBoard: React.FC<Props> = ({ data, generalBrief, isLoading, onUpdate }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPDF = async () => {
    const input = document.getElementById('concept-board-export-area');
    if (!input) return;

    setIsExporting(true);
    try {
      // 1. Capture the element at high resolution
      const canvas = await html2canvas(input, {
        scale: 2, // High resolution for better text clarity
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // 2. Define Page & Margins
      const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
      
      // 10% margin
      const margin = pageWidth * 0.1; 
      const maxPrintWidth = pageWidth - (margin * 2);
      const maxPrintHeight = pageHeight - (margin * 2);

      // 3. Calculate Scale to Fit ONE Page
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const imgRatio = imgWidth / imgHeight;
      const printRatio = maxPrintWidth / maxPrintHeight;

      let finalWidth, finalHeight;

      // If image is "taller" than the print area (relative to width), constrain by height
      if (imgRatio < printRatio) {
        finalHeight = maxPrintHeight;
        finalWidth = finalHeight * imgRatio;
      } else {
        // Otherwise constrain by width
        finalWidth = maxPrintWidth;
        finalHeight = finalWidth / imgRatio;
      }

      // 4. Center the image horizontally (optional, but looks better if constrained by height)
      const xOffset = margin + (maxPrintWidth - finalWidth) / 2;
      const yOffset = margin; // Top margin

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
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
      <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-white rounded-xl shadow-lg border border-slate-200 p-8 animate-pulse">
        <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-slate-800 font-bold text-xl mb-2">AI가 컨셉보드를 기획하고 있습니다...</p>
        <p className="text-slate-500 text-sm">브리프 분석 중 • 캐릭터 설정 중 • 이미지 생성 중</p>
      </div>
    );
  }

  const ThComponent = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <th className="w-[180px] py-6 px-4 bg-slate-50 text-left border-r border-slate-200 align-top">
      <div className="flex flex-col">
        <span className="text-slate-800 font-bold text-lg leading-tight mb-1">{title}</span>
        <span className="text-slate-400 font-medium text-xs uppercase tracking-wide">{subtitle}</span>
      </div>
    </th>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="text-sm text-slate-500 px-2 flex items-center gap-2">
          <span>💡</span>
          <span>내용을 클릭하여 직접 수정할 수 있습니다.</span>
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
          {isExporting ? 'PDF 생성 중...' : 'PDF 다운로드 📥'}
        </button>
      </div>

      {/* Concept Board Area (Wrapper for Export) */}
      <div 
        id="concept-board-export-area"
        className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col"
      >
        {/* PDF Header Info (Shows only if content exists or as placeholder) */}
        <div className="px-8 pt-8 pb-4 bg-white flex justify-end">
           <div className="text-right">
              <span className="text-sm font-bold text-slate-500 mr-2">요청 부서/담당자, 제작 부서/담당자:</span>
              <span className="text-sm text-slate-800 font-medium underline decoration-slate-300 underline-offset-4">
                {generalBrief?.requestDept ? generalBrief.requestDept : "　　　　　　　　　　　　　　"}
              </span>
           </div>
        </div>

        {/* Main Content */}
        <div className="px-8">
          <div className="bg-indigo-700 p-6 text-white flex justify-between items-end border-b-4 border-indigo-900 rounded-t-lg">
            <div>
              <h2 className="text-2xl font-bold tracking-wider">PROJECT CONCEPT BOARD</h2>
            </div>
            <div className="text-right">
              <div className="text-xs text-indigo-200">Date</div>
              <div className="font-mono">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
          
          <div className="border border-t-0 border-slate-200 rounded-b-lg overflow-hidden">
            <table className="w-full border-collapse table-fixed">
              <tbody>
                {/* 1. Concept */}
                <tr className="border-b border-slate-200">
                  <ThComponent title="① 한 줄 컨셉" subtitle="Concept" />
                  <td className="p-4 align-top">
                    <AutoResizeTextarea
                      value={data.oneLineConcept}
                      onChange={(e) => handleChange('oneLineConcept', e.target.value)}
                      className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-300 focus:bg-indigo-50/30 rounded p-2 outline-none resize-none transition-all text-lg font-bold text-slate-800 leading-relaxed"
                      placeholder="컨셉 내용이 입력됩니다."
                      minHeight="60px"
                    />
                  </td>
                </tr>
                
                {/* 2. Genre & Format */}
                <tr className="border-b border-slate-200">
                  <ThComponent title="② 장르 및 포맷" subtitle="Genre & Format" />
                  <td className="p-4 align-top">
                    <AutoResizeTextarea 
                      value={data.genreFormat}
                      onChange={(e) => handleChange('genreFormat', e.target.value)}
                      className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-300 focus:bg-indigo-50/30 rounded p-2 outline-none resize-none transition-all text-slate-700 leading-relaxed"
                      minHeight="80px"
                    />
                  </td>
                </tr>

                {/* 3. Core Message */}
                <tr className="border-b border-slate-200">
                  <ThComponent title="③ 핵심 메시지" subtitle="Core Message" />
                  <td className="p-4 align-top">
                    <AutoResizeTextarea
                      value={data.keyMessage}
                      onChange={(e) => handleChange('keyMessage', e.target.value)}
                      className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-300 focus:bg-indigo-50/30 rounded p-2 outline-none resize-none transition-all text-slate-700 leading-relaxed font-medium"
                      minHeight="80px"
                    />
                  </td>
                </tr>

                {/* 4. Character */}
                <tr className="border-b border-slate-200">
                  <ThComponent title="④ 캐릭터" subtitle="Character" />
                  <td className="p-4 align-top">
                    <AutoResizeTextarea 
                      value={data.character}
                      onChange={(e) => handleChange('character', e.target.value)}
                      className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-300 focus:bg-indigo-50/30 rounded p-2 outline-none resize-none transition-all text-slate-700 leading-relaxed whitespace-pre-wrap"
                      minHeight="140px"
                    />
                  </td>
                </tr>

                {/* 5. Tone & Manner */}
                <tr className="border-b border-slate-200">
                  <ThComponent title="⑤ 톤 앤 매너" subtitle="Tone & Manner" />
                  <td className="p-4 align-top">
                    <AutoResizeTextarea
                      value={data.toneManner}
                      onChange={(e) => handleChange('toneManner', e.target.value)}
                      className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-300 focus:bg-indigo-50/30 rounded p-2 outline-none resize-none transition-all text-slate-700 leading-relaxed"
                      minHeight="100px"
                    />
                  </td>
                </tr>

                {/* 6. Concept Image */}
                <tr>
                  <ThComponent title="⑥ 컨셉 이미지" subtitle="Key Scenes" />
                  <td className="p-6 align-top bg-slate-50/50">
                    {data.generatedImageBase64 ? (
                      <div className="flex flex-col gap-3">
                        <div className="relative group w-full rounded-xl overflow-hidden shadow-lg border border-slate-200">
                          <img 
                            src={`data:image/jpeg;base64,${data.generatedImageBase64}`} 
                            alt="Generated Concept" 
                            className="w-full h-auto object-cover"
                          />
                        </div>
                        <div className="mt-1">
                          <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase tracking-wider">Image Generation Prompt</label>
                          <p className="text-xs text-slate-500 font-mono bg-white p-3 rounded border border-slate-200 shadow-sm whitespace-pre-wrap break-all">{data.imagePrompt}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="bg-slate-100 rounded-xl p-8 border-2 border-slate-300 border-dashed flex items-center justify-center text-slate-400 h-[300px]">
                          <div className="text-center">
                            <span className="text-4xl block mb-2">🖼️</span>
                            <span className="text-sm">이미지 생성에 실패했거나 대기 중입니다.</span>
                          </div>
                        </div>
                        <div className="mt-1">
                          <label className="text-[10px] text-slate-400 font-bold mb-1 block uppercase tracking-wider">Suggested Prompt</label>
                          <AutoResizeTextarea
                            value={data.imagePrompt}
                            onChange={(e) => handleChange('imagePrompt', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded p-3 text-xs font-mono text-slate-600"
                            minHeight="60px"
                          />
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* PDF Footer Disclaimer */}
        <div className="px-8 pb-8 pt-4 flex justify-end">
           <p className="text-[10px] text-slate-400 font-medium">
             본 문서는 비상교육 AI 컨셉보드 자동 생성 시스템을 이용하였습니다.
           </p>
        </div>
      </div>
    </div>
  );
};

export default ConceptBoard;