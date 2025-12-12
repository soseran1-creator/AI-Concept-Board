import React, { useState } from 'react';
import { GeneralBrief, AdvancedBrief, GENRES, SUBJECTS, GRADES } from '../types';

interface Props {
  onGenerate: (general: GeneralBrief, advanced: AdvancedBrief) => void;
  isGenerating: boolean;
}

const BriefForm: React.FC<Props> = ({ onGenerate, isGenerating }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'advanced'>('general');
  
  const [general, setGeneral] = useState<GeneralBrief>({
    // 1. Overview
    contentName: '',
    requestDept: '',
    purpose: '',
    usage: '',
    contentNature: '',
    // 2. Target
    targetAge: '',
    targetKnowledge: '',
    // 3. Key Topic
    keyMessage: '',
    mustInclude: '',
    mustAvoid: '',
    // 4. Production
    length: '',
    aspectRatio: '',
    genre: '',
    characterInfo: '',
    budgetDifficulty: '',
    // 5. Tone Manner
    atmosphere: '',
    refLink: '',
    similarLink: '',
    plannerRefLink: '',
    colorPalette: '',
    // 6. Outcome
    knowledgeGained: ''
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

  const RequiredLabel = ({ label }: { label: string }) => (
    <label className="block text-sm font-semibold text-slate-800 mb-1">
      <span className="text-red-500 mr-1">*</span>{label}
    </label>
  );

  const OptionalLabel = ({ label }: { label: string }) => (
    <label className="block text-sm font-medium text-slate-600 mb-1">
      <span className="text-slate-400 font-normal mr-1">(선택)</span>{label}
    </label>
  );

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
          <div className="space-y-8">
            {/* 1. 콘텐츠 개요 */}
            <div className="space-y-4">
              <h3 className="text-md font-bold text-indigo-900 border-b pb-2 border-indigo-100 flex items-center">
                <span className="bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">1</span>
                콘텐츠 개요
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <RequiredLabel label="콘텐츠명" />
                  <input name="contentName" value={general.contentName} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="예: 꼬마 과학자의 하루" />
                </div>
                <div>
                  <OptionalLabel label="요청 부서/담당자, 제작 부서/담당자" />
                  <input name="requestDept" value={general.requestDept} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50" />
                </div>
                <div>
                  <RequiredLabel label="제작 목적" />
                  <input name="purpose" value={general.purpose} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="예: 개념 이해 강화, 브랜드 홍보" />
                </div>
                <div>
                  <RequiredLabel label="콘텐츠 활용처" />
                  <input name="usage" value={general.usage} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="예: 교과서QR, 브랜드 SNS" />
                </div>
                <div className="md:col-span-2">
                  <RequiredLabel label="콘텐츠 성격" />
                  <input name="contentNature" value={general.contentNature} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="예: 정보형, 감성형, 서사형, 캐릭터 중심형" />
                </div>
              </div>
            </div>

            {/* 2. 타깃 정보 */}
            <div className="space-y-4">
              <h3 className="text-md font-bold text-indigo-900 border-b pb-2 border-indigo-100 flex items-center">
                <span className="bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">2</span>
                타깃 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <RequiredLabel label="대상 연령 및 수준" />
                  <input name="targetAge" value={general.targetAge} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="예: 초등학교 5학년, 일반 사용자" />
                </div>
                <div>
                  <OptionalLabel label="타깃의 사전 지식 수준" />
                  <input name="targetKnowledge" value={general.targetKnowledge} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50" placeholder="예: 개념 기초 수준, 이해도 낮음" />
                </div>
              </div>
            </div>

            {/* 3. 핵심 주제 */}
            <div className="space-y-4">
              <h3 className="text-md font-bold text-indigo-900 border-b pb-2 border-indigo-100 flex items-center">
                <span className="bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">3</span>
                핵심 주제
              </h3>
              <div>
                <RequiredLabel label="주요 메시지" />
                <textarea name="keyMessage" value={general.keyMessage} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" rows={2} placeholder="예: 민주주의란 무엇인가?" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <OptionalLabel label="반드시 포함해야 할 내용" />
                  <textarea name="mustInclude" value={general.mustInclude} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50" rows={2} placeholder="예: 민주주의 개념과 의미" />
                </div>
                <div>
                  <OptionalLabel label="포함하면 안 되는 내용" />
                  <textarea name="mustAvoid" value={general.mustAvoid} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50" rows={2} placeholder="예: 폭력적인 설정" />
                </div>
              </div>
            </div>

            {/* 4. 제작 조건 */}
            <div className="space-y-4">
              <h3 className="text-md font-bold text-indigo-900 border-b pb-2 border-indigo-100 flex items-center">
                <span className="bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">4</span>
                제작 조건
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <RequiredLabel label="영상 길이" />
                  <input name="length" value={general.length} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="예: 3분 내외" />
                </div>
                <div>
                  <RequiredLabel label="화면 비율 및 포맷" />
                  <select name="aspectRatio" value={general.aspectRatio} onChange={handleGeneralChange} className="w-full p-2 bg-white border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="">선택하세요</option>
                    <option value="16:9 (가로형)">16:9 (가로형 - 유튜브 등)</option>
                    <option value="9:16 (세로형)">9:16 (세로형 - 숏폼)</option>
                    <option value="1:1 (정방형)">1:1 (카드뉴스 등)</option>
                  </select>
                </div>
                <div>
                  <RequiredLabel label="제작 형태(장르)" />
                  <input name="genre" value={general.genre} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="예: 모션그래픽, 실사 촬영" />
                </div>
                <div>
                  <RequiredLabel label="캐릭터 정보" />
                  <input name="characterInfo" value={general.characterInfo} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="예: 메인 캐릭터 비바" />
                </div>
                <div className="md:col-span-2">
                   <OptionalLabel label="예산 범위 또는 제작 난이도" />
                   <input name="budgetDifficulty" value={general.budgetDifficulty} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50" placeholder="예: 상, 중, 하" />
                </div>
              </div>
            </div>

            {/* 5. 톤 앤 매너 조건 */}
            <div className="space-y-4">
              <h3 className="text-md font-bold text-indigo-900 border-b pb-2 border-indigo-100 flex items-center">
                <span className="bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">5</span>
                톤 앤 매너 조건
              </h3>
              <div>
                <RequiredLabel label="콘텐츠의 전체 분위기" />
                <input name="atmosphere" value={general.atmosphere} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="예: 밝고 유쾌, 정보 중심, 차분함" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <OptionalLabel label="참고 이미지 또는 링크" />
                   <input name="refLink" value={general.refLink} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50" />
                 </div>
                 <div>
                   <OptionalLabel label="기존 제작물 중 유사 스타일 여부" />
                   <input name="similarLink" value={general.similarLink} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50" />
                 </div>
                 <div>
                   <OptionalLabel label="기획자가 원하는 톤 앤 매너 참고 영상" />
                   <input name="plannerRefLink" value={general.plannerRefLink} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50" />
                 </div>
                 <div>
                   <OptionalLabel label="색감 팔레트 지정" />
                   <input name="colorPalette" value={general.colorPalette} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50" placeholder="예: 파스텔톤, 비비드" />
                 </div>
              </div>
            </div>

             {/* 6. 최종 산출 희망 방향 */}
             <div className="space-y-4">
              <h3 className="text-md font-bold text-indigo-900 border-b pb-2 border-indigo-100 flex items-center">
                <span className="bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">6</span>
                최종 산출 희망 방향
              </h3>
              <div>
                <RequiredLabel label="이 콘텐츠를 본 사람이 얻는 지식" />
                <input name="knowledgeGained" value={general.knowledgeGained} onChange={handleGeneralChange} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="예: 개념을 바로 설명할 수 있다" />
              </div>
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