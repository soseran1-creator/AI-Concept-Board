import React, { useState } from 'react';
import { GeneralBrief, AdvancedBrief, GENRES, SUBJECTS, GRADES } from '../types';

interface Props {
  onGenerate: (general: GeneralBrief, advanced: AdvancedBrief) => void;
  isGenerating: boolean;
}

const BriefForm: React.FC<Props> = ({ onGenerate, isGenerating }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'advanced'>('general');
  
  const [general, setGeneral] = useState<GeneralBrief>({
    contentName: '',
    purpose: '',
    usage: '',
    targetAge: '',
    keyTopic: '',
    length: '',
    aspectRatio: '',
    format: '',
    budgetDifficulty: '',
    toneMannerReferences: '',
    desiredOutcome: ''
  });

  const [advanced, setAdvanced] = useState<AdvancedBrief>({
    useGenreGuide: false,
    selectedGenre: GENRES[0],
    useSubjectGuide: false,
    selectedSubject: SUBJECTS[0],
    subjectCharacteristics: '',
    useGradeGuide: false,
    selectedGrade: GRADES[0],
    gradeCharacteristics: ''
  });

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGeneral(prev => ({ ...prev, [name]: value }));
  };

  const handleAdvancedChange = (field: keyof AdvancedBrief, value: any) => {
    setAdvanced(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(general, advanced);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex-1 py-4 px-6 text-sm font-semibold transition-colors ${
            activeTab === 'general' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          1. 일반 브리프 (기본)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('advanced')}
          className={`flex-1 py-4 px-6 text-sm font-semibold transition-colors ${
            activeTab === 'advanced' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          2. 고급 브리프 (선택)
        </button>
      </div>

      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">콘텐츠명</label>
                <input name="contentName" value={general.contentName} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="예: 꼬마 과학자의 하루" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">제작 목적</label>
                <input name="purpose" value={general.purpose} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="예: 신제품 홍보, 학습 동기 부여" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">콘텐츠 활용처</label>
                <input name="usage" value={general.usage} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="예: 유튜브, 교실 수업, 인스타그램" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">타깃 정보 (연령 등)</label>
                <input name="targetAge" value={general.targetAge} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="예: 초등학교 3학년, 30대 학부모" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">핵심 주제 (주요 메시지)</label>
              <textarea name="keyTopic" value={general.keyTopic} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none h-20" placeholder="콘텐츠가 전달해야 할 가장 중요한 메시지나 주제를 적어주세요." />
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-3">제작 조건</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">영상 길이</label>
                  <input name="length" value={general.length} onChange={handleGeneralChange} className="w-full p-2 bg-white border border-slate-300 rounded text-sm" placeholder="예: 3분 내외" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">화면 비율</label>
                  <select name="aspectRatio" value={general.aspectRatio} onChange={handleGeneralChange} className="w-full p-2 bg-white border border-slate-300 rounded text-sm">
                    <option value="">선택하세요</option>
                    <option value="16:9 (가로형)">16:9 (가로형)</option>
                    <option value="9:16 (세로형)">9:16 (세로형 - 숏츠/릴스)</option>
                    <option value="1:1 (정방형)">1:1 (카드뉴스 등)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">제작 형태</label>
                  <input name="format" value={general.format} onChange={handleGeneralChange} className="w-full p-2 bg-white border border-slate-300 rounded text-sm" placeholder="예: 시리즈물, 단편" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">예산 및 난이도</label>
                  <input name="budgetDifficulty" value={general.budgetDifficulty} onChange={handleGeneralChange} className="w-full p-2 bg-white border border-slate-300 rounded text-sm" placeholder="예: 중급 예산, 전문 모션그래픽 필요" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">톤 앤 매너 (레퍼런스)</label>
              <textarea name="toneMannerReferences" value={general.toneMannerReferences} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none h-16" placeholder="참고할 스타일, 이미지 링크, 혹은 '밝고 활기찬 느낌' 등의 텍스트 설명" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">최종 산출 희망 방향</label>
              <input name="desiredOutcome" value={general.desiredOutcome} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="예: 시청자가 과학 원리를 쉽게 이해하고 흥미를 느낌" />
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            {/* Genre Guide */}
            <div className={`p-4 rounded-lg border transition-all ${advanced.useGenreGuide ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-slate-200 opacity-75'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-800">장르 가이드 (비상교육 스타일)</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={advanced.useGenreGuide} onChange={(e) => handleAdvancedChange('useGenreGuide', e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              {advanced.useGenreGuide && (
                <div className="mt-2 animate-fadeIn">
                  <label className="block text-sm text-slate-600 mb-1">장르 선택</label>
                  <select 
                    value={advanced.selectedGenre} 
                    onChange={(e) => handleAdvancedChange('selectedGenre', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Subject Guide */}
            <div className={`p-4 rounded-lg border transition-all ${advanced.useSubjectGuide ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-slate-200 opacity-75'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-800">과목별 특성 가이드</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={advanced.useSubjectGuide} onChange={(e) => handleAdvancedChange('useSubjectGuide', e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              {advanced.useSubjectGuide && (
                <div className="mt-2 space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">과목 선택</label>
                    <select 
                      value={advanced.selectedSubject} 
                      onChange={(e) => handleAdvancedChange('selectedSubject', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500"
                    >
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">{advanced.selectedSubject} 특성 값 입력</label>
                    <textarea 
                      value={advanced.subjectCharacteristics}
                      onChange={(e) => handleAdvancedChange('subjectCharacteristics', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded h-20 text-sm focus:ring-2 focus:ring-indigo-500"
                      placeholder={`예: ${advanced.selectedSubject} 과목은 정확한 용어 사용과 논리적인 흐름이 중요함.`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Grade Guide */}
            <div className={`p-4 rounded-lg border transition-all ${advanced.useGradeGuide ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-slate-200 opacity-75'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-800">학년/타깃 특성 가이드</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={advanced.useGradeGuide} onChange={(e) => handleAdvancedChange('useGradeGuide', e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              {advanced.useGradeGuide && (
                <div className="mt-2 space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">대상 선택</label>
                    <select 
                      value={advanced.selectedGrade} 
                      onChange={(e) => handleAdvancedChange('selectedGrade', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500"
                    >
                      {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">{advanced.selectedGrade} 특성 값 입력</label>
                    <textarea 
                      value={advanced.gradeCharacteristics}
                      onChange={(e) => handleAdvancedChange('gradeCharacteristics', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded h-20 text-sm focus:ring-2 focus:ring-indigo-500"
                      placeholder={`예: ${advanced.selectedGrade}은(는) 집중 시간이 짧으므로 시각적 자극이 필요함.`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
        <button
          type="submit"
          disabled={isGenerating}
          className={`px-6 py-3 rounded-lg text-white font-bold shadow-md transition-all ${
            isGenerating 
            ? 'bg-slate-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {isGenerating ? '컨셉보드 생성 중...' : '컨셉보드 생성하기 ✨'}
        </button>
      </div>
    </form>
  );
};

export default BriefForm;