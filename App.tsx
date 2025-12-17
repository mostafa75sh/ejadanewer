import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AppState, Objective, GOVERNORATES, CLASSIFICATIONS, IndicatorType, Result, Evidence, EmployeeProfile } from './types';
import { calculateTotalWeight, generateId, getDirectorateName, analyzePerformance, ensureUrlProtocol } from './utils';
import { EvidenceUploader } from './components/EvidenceUploader';
import { VoiceButton } from './components/VoiceButton';
import { GoogleGenAI } from "@google/genai";
import { 
  Users, Target, ChevronDown, ChevronUp, Plus, Trash, AlertCircle, CheckCircle, 
  Printer, ArrowLeft, ArrowRight, Save, LayoutGrid, FileText, Code, PenTool, Award, Loader2, Sparkles
} from 'lucide-react';

// --- Home Page ---
const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center text-center space-y-10 animate-fade-in pb-12 pt-4">
      <div className="w-full relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-oman-red to-oman-green rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative w-full bg-white ring-1 ring-gray-900/5 rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12">
           <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-oman-green/10 rounded-full blur-3xl"></div>
           <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-oman-red/10 rounded-full blur-3xl"></div>
           
           <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-800 tracking-tight leading-tight">
             مبادرة <span className="text-transparent bg-clip-text bg-gradient-to-l from-oman-red to-oman-green">توثيق</span>
           </h2>
           <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium">
             المنصة الرقمية الأولى لدعم العاملين بوزارة التربية والتعليم في سلطنة عُمان. 
             <br/>
             <span className="text-oman-green font-bold">وثّق إنجازاتك</span>، <span className="text-oman-red font-bold">حلل أداءك</span>، وأصدر تقارير احترافية بضغطة زر.
           </p>

           <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate('/profile')}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-800 shadow-xl hover:-translate-y-1"
              >
                البدء في التوثيق <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full">
        <div className="glass-panel p-8 rounded-3xl shadow-lg border-t-8 border-oman-green hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-oman-green">
            <Target size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">الرؤية</h3>
          <p className="text-gray-600 leading-relaxed">
            رؤية تربوية وطنية طموحة تتناغم مع أهداف <span className="font-bold text-oman-green">رؤية عُمان 2040</span>، نسعى من خلالها لتعزيز كفاءة الأداء المؤسسي والفردي.
          </p>
        </div>
        
        <div className="glass-panel p-8 rounded-3xl shadow-lg border-t-8 border-oman-red hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-oman-red">
            <Users size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">الرسالة</h3>
          <p className="text-gray-600 leading-relaxed">
            ترسيخ ثقافة الجودة والشفافية في التوثيق، وتوفير أدوات ذكية تدعم <span className="font-bold text-oman-red">نظام إجادة</span> وتضمن التحسين المستمر.
          </p>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto mt-16 pt-8 border-t border-gray-200/60">
        <div className="flex flex-col items-center justify-center space-y-2">
           <div className="p-2 bg-white rounded-full shadow-sm">
             <Code size={20} className="text-gray-400" />
           </div>
           <p className="text-gray-500 text-sm font-semibold">تصميم وتطوير</p>
           <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
             أ. مصطفى شعبان
           </h3>
           <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              <span>معلم تقنية المعلومات</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>مدرسة حمزة بن عبدالمطلب</span>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Profile Page ---
const ProfilePage = ({ state, updateProfile }: { state: AppState, updateProfile: any }) => {
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateProfile(e.target.name, e.target.value);
  };

  const handleVoiceUpdate = (name: string, val: string) => {
    updateProfile(name, val);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => updateProfile('schoolLogo', reader.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const renderInput = (label: string, name: keyof EmployeeProfile, placeholder?: string) => (
    <div className="group">
      <label className="block text-sm font-bold text-gray-600 mb-2 transition-colors group-focus-within:text-oman-green">{label}</label>
      <div className="relative">
        <input 
          required 
          type="text" 
          name={name} 
          value={state.profile[name]} 
          onChange={handleChange} 
          className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-base rounded-xl focus:ring-2 focus:ring-oman-green/50 focus:border-oman-green focus:bg-white p-4 pl-12 transition-all duration-200 outline-none shadow-sm"
          placeholder={placeholder} 
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity">
           <VoiceButton onTranscript={(txt) => handleVoiceUpdate(name, txt)} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 animate-fade-in border border-gray-100">
      <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <FileText size={24} />
        </div>
        <h2 className="text-2xl font-black text-gray-800">البيانات الأساسية</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {renderInput('الاسم الثلاثي والقبيلة', 'name', 'مثال: محمد بن سعيد...')}
          {renderInput('المسمى الوظيفي', 'jobTitle')}
          {renderInput('المؤسسة / المدرسة', 'institution')}
          {renderInput('اسم المسؤول المباشر', 'managerName')}
        </div>

        <div className="space-y-6">
          <div className="group">
            <label className="block text-sm font-bold text-gray-600 mb-2 group-focus-within:text-oman-green">المحافظة</label>
            <select name="governorate" value={state.profile.governorate} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-base rounded-xl focus:ring-2 focus:ring-oman-green/50 focus:border-oman-green focus:bg-white p-4 transition-all duration-200 outline-none shadow-sm cursor-pointer">
              <option value="">اختر المحافظة...</option>
              {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            {state.profile.governorate && (
              <p className="text-xs text-oman-green mt-2 font-bold flex items-center gap-1 animate-pulse">
                <CheckCircle size={12} /> {getDirectorateName(state.profile.governorate)}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-bold text-gray-600 mb-2 group-focus-within:text-oman-green">الفترة</label>
              <select name="period" value={state.profile.period} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-base rounded-xl focus:ring-2 focus:ring-oman-green/50 focus:border-oman-green focus:bg-white p-4 transition-all duration-200 outline-none shadow-sm cursor-pointer">
                <option value="FIRST">الأولى</option>
                <option value="SECOND">الثانية</option>
              </select>
            </div>
            <div className="group">
              <label className="block text-sm font-bold text-gray-600 mb-2 group-focus-within:text-oman-green">العام</label>
              <div className="relative">
                <input type="text" name="year" value={state.profile.year} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-base rounded-xl focus:ring-2 focus:ring-oman-green/50 focus:border-oman-green focus:bg-white p-4 pl-12 transition-all duration-200 outline-none shadow-sm" />
                <VoiceButton onTranscript={(txt) => handleVoiceUpdate('year', txt)} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50 hover:opacity-100" />
              </div>
            </div>
          </div>
          <div className="group">
            <label className="block text-sm font-bold text-gray-600 mb-2">شعار المدرسة (اختياري)</label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 hover:bg-gray-50 hover:border-oman-green transition-colors text-center cursor-pointer">
               <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
               <div className="pointer-events-none flex flex-col items-center gap-2 text-gray-400">
                  <Plus size={24} />
                  <span className="text-xs font-bold">اضغط لرفع الشعار</span>
               </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 flex justify-end">
        <button onClick={() => navigate('/objectives')} className="bg-gray-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-3">
          التالي: الأهداف <ArrowLeft />
        </button>
      </div>
    </div>
  );
};

// --- Objectives & Results Manager ---
const ObjectivesPage = ({ state, addObjective, updateObjective, deleteObjective, addResult, updateResult, deleteResult }: any) => {
  const [activeObjId, setActiveObjId] = useState<string | null>(null);
  const totalWeight = calculateTotalWeight(state.objectives);

  const handleAddObjective = () => {
    if (totalWeight >= 100) return;
    addObjective();
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div className="glass-panel p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center sticky top-20 z-30 transition-all duration-300">
        <div className="mb-4 md:mb-0 text-center md:text-right">
           <h2 className="text-xl font-black text-gray-800 flex items-center justify-center md:justify-start gap-2">
             <Target className="text-oman-red" /> إدارة الأهداف والنتائج
           </h2>
           <p className="text-sm text-gray-500 font-medium mt-1">قم بإضافة الأهداف ثم النتائج الرئيسية لكل هدف.</p>
        </div>
        <div className={`px-6 py-3 rounded-xl font-black text-xl shadow-inner ${totalWeight === 100 ? 'bg-green-100 text-green-700 ring-2 ring-green-200' : 'bg-red-50 text-red-600 ring-2 ring-red-100'}`}>
          الوزن الكلي: {totalWeight}%
        </div>
      </div>

      {state.objectives.map((obj: Objective, index: number) => {
        const resultsWeight = calculateTotalWeight(obj.results);
        const isComplete = resultsWeight === obj.weight && obj.weight > 0;
        
        return (
          <div key={obj.id} className={`bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 ${activeObjId === obj.id ? 'ring-2 ring-oman-green shadow-xl scale-[1.01]' : 'hover:shadow-lg'}`}>
            <div className="p-5 cursor-pointer bg-gradient-to-l from-white to-gray-50" onClick={() => setActiveObjId(activeObjId === obj.id ? null : obj.id)}>
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex items-center gap-3">
                    <span className="bg-gray-800 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">هدف {index + 1}</span>
                    <select 
                      value={obj.classification} 
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateObjective(obj.id, { classification: e.target.value as any })}
                      className="text-xs border-none bg-blue-100 text-blue-800 rounded-lg px-3 py-1 font-bold focus:ring-0 cursor-pointer hover:bg-blue-200 transition"
                    >
                      {Object.entries(CLASSIFICATIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div className="relative w-full">
                    <input 
                      type="text" 
                      value={obj.text}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateObjective(obj.id, { text: e.target.value })}
                      placeholder="اكتب نص الهدف هنا..."
                      className="w-full font-bold text-gray-800 text-lg border-b-2 border-dashed border-gray-300 focus:border-oman-green focus:outline-none bg-transparent pb-2 pr-10 transition-colors"
                    />
                    <div className="absolute left-0 top-0">
                      <VoiceButton onTranscript={(txt) => updateObjective(obj.id, { text: txt })} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto justify-between md:justify-start mt-2 md:mt-0">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                    <span className="text-xs text-gray-500 font-bold">الوزن:</span>
                    <input 
                      type="number" 
                      value={obj.weight}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateObjective(obj.id, { weight: Number(e.target.value) })}
                      className="w-12 text-center bg-white border rounded p-1 font-bold text-oman-red outline-none focus:ring-1 focus:ring-oman-red"
                    />
                    <span className="text-xs font-bold text-gray-400">%</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <button onClick={(e) => { e.stopPropagation(); deleteObjective(obj.id); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition">
                        <Trash size={18} />
                     </button>
                     <div className="p-2 bg-gray-100 rounded-full">
                        {activeObjId === obj.id ? <ChevronUp size={20} className="text-gray-600"/> : <ChevronDown size={20} className="text-gray-600"/>}
                     </div>
                  </div>
                </div>
              </div>
              
              {!isComplete && (
                <div className="mt-3 text-xs bg-red-50 text-red-600 px-3 py-2 rounded-lg inline-flex items-center gap-2 font-bold animate-pulse">
                  <AlertCircle size={14} />
                  <span>انتبه: مجموع أوزان النتائج ({resultsWeight}%) لا يطابق وزن الهدف ({obj.weight}%)</span>
                </div>
              )}
            </div>

            {activeObjId === obj.id && (
              <div className="bg-gray-50/50 p-6 border-t border-gray-100 animate-slide-down">
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Code size={16} /> النتائج الرئيسية
                </h3>
                
                {obj.results.map((res: Result) => (
                  <div key={res.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-4 border-b border-gray-100 pb-3 gap-3">
                       <div className="relative flex-1 w-full">
                         <input 
                          className="w-full font-bold text-gray-800 border-none focus:ring-0 text-base p-0 placeholder-gray-300 bg-transparent"
                          placeholder="اكتب نص النتيجة الرئيسية..."
                          value={res.name}
                          onChange={(e) => updateResult(obj.id, res.id, { name: e.target.value })}
                         />
                         <div className="absolute left-0 top-0">
                           <VoiceButton onTranscript={(txt) => updateResult(obj.id, res.id, { name: txt })} />
                         </div>
                       </div>
                       <div className="flex items-center gap-3 w-full md:w-auto">
                          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border">
                             <span className="text-[10px] text-gray-400 font-bold">وزن النتيجة</span>
                             <input 
                               type="number" 
                               className="w-10 text-sm bg-transparent border-none p-0 text-center font-bold text-gray-700 focus:ring-0"
                               placeholder="0"
                               value={res.weight}
                               onChange={(e) => updateResult(obj.id, res.id, { weight: Number(e.target.value) })}
                             />
                          </div>
                          <button onClick={() => deleteResult(obj.id, res.id)} className="text-gray-300 hover:text-red-500 transition"><Trash size={16} /></button>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                       <div>
                         <label className="text-xs font-bold text-gray-500 block mb-2">نوع المؤشر</label>
                         <select 
                           value={res.indicatorType}
                           onChange={(e) => updateResult(obj.id, res.id, { indicatorType: e.target.value as any })}
                           className="w-full text-sm bg-gray-50 border-gray-200 rounded-lg p-2.5 focus:border-oman-green focus:ring-oman-green/20 font-medium cursor-pointer"
                          >
                           <option value="NUMBER">عدد</option>
                           <option value="PERCENTAGE">نسبة %</option>
                           <option value="DATE">تاريخ</option>
                         </select>
                       </div>
                       <div>
                         <label className="text-xs font-bold text-gray-500 block mb-2">الأداء الفعلي</label>
                         <div className="relative flex items-center">
                           <input 
                             type={res.indicatorType === 'DATE' ? 'date' : 'text'}
                             className="w-full text-sm bg-gray-50 border-gray-200 rounded-lg p-2.5 focus:border-oman-green focus:ring-oman-green/20 font-bold"
                             value={res.actualPerformance}
                             onChange={(e) => updateResult(obj.id, res.id, { actualPerformance: e.target.value })}
                           />
                           {res.indicatorType !== 'DATE' && <VoiceButton onTranscript={(txt) => updateResult(obj.id, res.id, { actualPerformance: txt })} className="absolute left-1" />}
                         </div>
                       </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                        <label className="text-xs font-black text-gray-400 block mb-2 text-center">المستهدفات</label>
                        <div className="grid grid-cols-3 gap-3">
                          <input type={res.indicatorType === 'DATE' ? 'date' : 'text'} className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 text-center shadow-sm" placeholder="منخفض" value={res.targetLow} onChange={(e) => updateResult(obj.id, res.id, { targetLow: e.target.value })} />
                          <input type={res.indicatorType === 'DATE' ? 'date' : 'text'} className="w-full text-xs bg-white border-2 border-blue-200 rounded-lg p-2 text-center font-bold shadow-sm text-blue-900" placeholder="متوقع" value={res.targetExpected} onChange={(e) => updateResult(obj.id, res.id, { targetExpected: e.target.value })} />
                          <input type={res.indicatorType === 'DATE' ? 'date' : 'text'} className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 text-center shadow-sm" placeholder="عالي" value={res.targetHigh} onChange={(e) => updateResult(obj.id, res.id, { targetHigh: e.target.value })} />
                        </div>
                    </div>

                    <EvidenceUploader 
                      evidenceList={res.evidence} 
                      onChange={(newEvidence) => updateResult(obj.id, res.id, { evidence: newEvidence })} 
                    />
                  </div>
                ))}

                <button 
                  onClick={() => addResult(obj.id)}
                  disabled={resultsWeight >= obj.weight}
                  className={`w-full py-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-sm font-bold transition-all ${resultsWeight >= obj.weight ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-oman-green/30 text-oman-green bg-green-50/50 hover:bg-green-50 hover:border-oman-green'}`}
                >
                  <Plus size={18} /> إضافة نتيجة جديدة
                </button>
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={handleAddObjective}
        disabled={totalWeight >= 100}
        className={`w-full py-5 rounded-2xl shadow-sm border-2 border-dashed flex items-center justify-center gap-2 font-bold text-lg transition-all duration-300 ${totalWeight >= 100 ? 'border-gray-200 text-gray-300 bg-gray-50' : 'border-gray-300 text-gray-500 hover:border-oman-red hover:text-oman-red hover:bg-red-50 hover:shadow-md'}`}
      >
        <Plus size={24} /> إضافة هدف جديد
      </button>

      {totalWeight === 100 && (
         <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-md px-4">
             <button onClick={() => window.location.hash = '#/report'} className="w-full bg-gray-900 text-white py-4 rounded-2xl shadow-2xl font-bold text-lg hover:bg-gray-800 transition-all flex justify-center items-center gap-3 animate-float hover:scale-105">
               <FileText /> عرض التقرير النهائي
             </button>
         </div>
      )}
    </div>
  );
};

// --- Report Page ---
const ReportPage = ({ state }: { state: AppState }) => {
  const navigate = useNavigate();
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    const generateAiReport = async () => {
      if (calculateTotalWeight(state.objectives) !== 100) return;
      setIsGenerating(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `أنت خبير في تقييم الأداء المهني في نظام "إجادة" بوزارة التربية والتعليم بسلطنة عُمان.
        الرجاء تحليل بيانات الأداء التالية وتقديم تقرير مهني مفصل باللغة العربية.
        البيانات:
        الموظف: ${state.profile.name}
        الوظيفة: ${state.profile.jobTitle}
        الأهداف: ${JSON.stringify(state.objectives.map(o => ({ 
          text: o.text, 
          results: o.results.map(r => ({ name: r.name, actual: r.actualPerformance, targets: [r.targetLow, r.targetExpected, r.targetHigh] })) 
        })))}
        
        المطلوب في التقرير:
        1. ملخص عام للأداء.
        2. نقاط القوة التفصيلية لكل هدف بناءً على النتائج المحققة.
        3. مجالات التحسين المقترحة لكل هدف لضمان الاستمرارية.
        4. توصية ختامية مهنية.
        اجعل الأسلوب رسمياً، مشجعاً، ومنظماً باستخدام نقاط واضحة.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });
        setAiAnalysis(response.text || analyzePerformance(state.objectives));
      } catch (error) {
        console.error("AI Generation Error:", error);
        setAiAnalysis(analyzePerformance(state.objectives));
      } finally {
        setIsGenerating(false);
      }
    };

    generateAiReport();
  }, [state]);

  if (calculateTotalWeight(state.objectives) !== 100) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="bg-red-50 p-6 rounded-full mb-6 text-oman-red">
           <AlertCircle size={64} />
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-2">التقرير غير جاهز</h2>
        <p className="text-gray-500 font-medium">يجب أن يكون مجموع أوزان الأهداف 100% لعرض التقرير.</p>
        <button onClick={() => navigate('/objectives')} className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition">العودة للأهداف</button>
      </div>
    );
  }

  const handlePrint = () => {
    const reportContent = document.querySelector('.report-container');
    if (!reportContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8" />
          <title>توثيق أدلة إجادة - ${state.profile.name}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Cairo', sans-serif; background: white; margin: 0; padding: 20px; }
            .grid { display: grid; }
            @media print {
               @page { size: A4; margin: 10mm; }
               body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
               .no-print { display: none !important; }
               .print-break-inside { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="max-w-4xl mx-auto">${reportContent.outerHTML}</div>
          <script>window.onload = () => { setTimeout(() => { window.print(); }, 1000); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-white mx-auto animate-fade-in">
       
       <div className="no-print flex justify-between items-center bg-gray-900 text-white p-5 rounded-2xl mb-8 shadow-2xl sticky top-24 z-50 ring-1 ring-white/20">
         <div className="flex items-center gap-4">
            <button onClick={() => navigate('/objectives')} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition text-white">
                <ArrowRight size={20} />
            </button>
            <div>
                <h3 className="font-bold text-lg">معاينة التقرير</h3>
                <p className="text-xs text-gray-400 font-medium">جاهز للطباعة بحجم A4</p>
            </div>
         </div>
         <div className="flex gap-3">
            <button type="button" onClick={handlePrint} className="bg-oman-green hover:bg-green-600 px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition shadow-lg text-sm">
               <Printer size={18} /> طباعة / حفظ PDF
            </button>
         </div>
       </div>

       <div className="report-container font-sans text-gray-900 leading-snug">
          
          <div className="border-b-4 border-oman-red pb-4 mb-6 print:mb-2 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-1 print:text-xl">توثيق أدلة إجادة</h1>
              <p className="text-lg font-bold text-gray-700 mb-2 print:text-sm">{state.profile.name}</p>
              <h2 className="text-xl font-bold text-oman-green print:text-lg">نظام إجادة</h2>
              <p className="text-base text-gray-600 font-medium mt-1 print:text-sm">{state.profile.year} - الفترة {state.profile.period === 'FIRST' ? 'الأولى' : 'الثانية'}</p>
            </div>
            <div className="flex gap-4">
               {state.profile.schoolLogo && <img src={state.profile.schoolLogo} alt="Logo" className="h-24 w-24 print:h-16 object-contain" />}
               <div className="text-left text-sm text-gray-600 font-medium print:text-xs">
                  <p className="font-bold text-black">سلطنة عُمان</p>
                  <p>وزارة التربية والتعليم</p>
                  <p>{getDirectorateName(state.profile.governorate)}</p>
               </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 print:p-4 print:mb-4 print:bg-white print:border-gray-400">
            <h3 className="text-base font-black text-oman-red mb-4 border-b border-gray-200 pb-2 print:text-sm">البيانات الأساسية</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-base print:text-xs print:gap-2">
               <div><span className="text-gray-500 block text-xs font-bold">الاسم:</span> <span className="font-bold">{state.profile.name}</span></div>
               <div><span className="text-gray-500 block text-xs font-bold">الوظيفة:</span> <span className="font-bold">{state.profile.jobTitle}</span></div>
               <div><span className="text-gray-500 block text-xs font-bold">جهة العمل:</span> <span className="font-bold">{state.profile.institution}</span></div>
               <div><span className="text-gray-500 block text-xs font-bold">المسؤول:</span> <span className="font-bold">{state.profile.managerName}</span></div>
            </div>
          </div>

          <div className="space-y-6 print:space-y-4">
            {state.objectives.map((obj, i) => (
              <div key={obj.id} className="print-break-inside border border-gray-400 rounded-lg overflow-hidden">
                 <div className="bg-gray-100 p-3 border-b border-gray-400 flex justify-between items-center print:bg-gray-200 print:py-1">
                    <span className="font-black text-lg print:text-sm">الهدف {i + 1}: {obj.text}</span>
                    <span className="bg-white border border-gray-400 px-3 py-1 rounded text-sm font-bold print:text-xs">{CLASSIFICATIONS[obj.classification]} ({obj.weight}%)</span>
                 </div>
                 
                 <div className="grid grid-cols-12 bg-gray-50 text-sm font-black p-3 border-b border-gray-400 print:text-xs print:py-1">
                    <div className="col-span-3">النتيجة</div>
                    <div className="col-span-1 text-center">الوزن</div>
                    <div className="col-span-3 text-center">المستهدف</div>
                    <div className="col-span-2 text-center">الأداء</div>
                    <div className="col-span-3">الأدلة</div>
                 </div>

                 {obj.results.map((res) => (
                   <div key={res.id} className="grid grid-cols-12 text-sm border-b last:border-0 border-gray-300 p-3 items-center print:text-xs print:py-1">
                      <div className="col-span-3 font-bold">{res.name}</div>
                      <div className="col-span-1 text-center">{res.weight}%</div>
                      <div className="col-span-3 text-center flex flex-col text-xs">
                         <span className="text-gray-400">{res.targetLow}</span>
                         <span className="font-bold text-black border-y border-gray-100 my-0.5">{res.targetExpected}</span>
                         <span className="text-gray-400">{res.targetHigh}</span>
                      </div>
                      <div className="col-span-2 text-center font-black text-lg print:text-sm">{res.actualPerformance}</div>
                      <div className="col-span-3">
                         {res.evidence.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2 print:gap-1">
                               {res.evidence.map(ev => {
                                 if (ev.type === 'IMAGE') return (
                                   <div key={ev.id} className="aspect-square border border-gray-200 p-0.5 bg-white rounded-md overflow-hidden flex items-center justify-center print:border-gray-400">
                                     <img src={ev.content} className="w-full h-full object-contain" alt="Evidence" />
                                   </div>
                                 );
                                 if (ev.type === 'LINK' || ev.type === 'VIDEO') {
                                   const safeUrl = ensureUrlProtocol(ev.content);
                                   return (
                                     <div key={ev.id} className="col-span-2 flex items-center gap-2 border p-1 rounded-md bg-white border-gray-200 print:border-gray-400">
                                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(safeUrl)}`} className="w-10 h-10 print:w-12 print:h-12 object-contain" alt="QR" />
                                         <a href={safeUrl} target="_blank" rel="noreferrer" className="text-xs print:text-[8px] text-blue-700 underline truncate flex-1">{ev.content}</a>
                                     </div>
                                   );
                                 }
                                 return (
                                   <div key={ev.id} className="col-span-2 flex items-center gap-2 border p-1 rounded-md bg-white border-gray-200 print:border-gray-400">
                                      <span className="text-xs print:text-[8px] text-gray-700 truncate">{ev.type === 'PDF' ? (ev.notes || 'ملف PDF') : ev.content}</span>
                                   </div>
                                 );
                               })}
                            </div>
                         ) : <span className="text-gray-400 italic text-xs">لا يوجد</span>}
                      </div>
                   </div>
                 ))}
              </div>
            ))}
          </div>

          <div className="print-break-inside mt-8 print:mt-4">
             <div className="bg-white border-2 border-gray-300 p-8 rounded-xl print:p-4 print:border">
                <div className="flex items-center gap-2 mb-4 border-b pb-2">
                   <Sparkles className="text-oman-green" />
                   <h3 className="text-xl font-black text-gray-800 print:text-sm">التحليل الذكي للأداء المهني</h3>
                </div>
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <Loader2 className="animate-spin mb-2" />
                    <p className="text-sm font-bold">جارٍ تحليل البيانات باستخدام الذكاء الاصطناعي...</p>
                  </div>
                ) : (
                  <div className="text-base leading-relaxed text-gray-800 text-justify font-medium print:text-xs whitespace-pre-wrap">
                    {aiAnalysis}
                  </div>
                )}
             </div>

             <div className="mt-16 flex justify-between px-10 pt-10 border-t-2 border-gray-300 text-base print:mt-4 print:pt-2 print:text-[10px] print:px-4">
                <div className="text-center"><p className="font-bold mb-12 print:mb-6">الموظف</p><p className="text-gray-400">..................</p></div>
                <div className="text-center"><p className="font-bold mb-12 print:mb-6">المسؤول المباشر</p><p className="text-gray-400">..................</p></div>
                <div className="text-center"><p className="font-bold mb-12 print:mb-6">الاعتماد</p><p className="text-gray-400">..................</p></div>
             </div>
          </div>

          <div className="text-center text-[10px] text-gray-400 mt-10 print:block hidden print:mt-2">
             تم إنشاء هذا التقرير عبر مبادرة "توثيق" الرقمية | تصميم وتطوير: أ. مصطفى شعبان
          </div>
       </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('tawthiq_state');
    return saved ? JSON.parse(saved) : {
      profile: {
        name: '', jobTitle: '', institution: '', managerName: '', governorate: '', period: 'FIRST', year: '2025'
      },
      objectives: []
    };
  });

  useEffect(() => {
    localStorage.setItem('tawthiq_state', JSON.stringify(state));
  }, [state]);

  const updateProfile = (key: keyof EmployeeProfile, value: any) => {
    setState(prev => ({ ...prev, profile: { ...prev.profile, [key]: value } }));
  };

  const addObjective = () => {
    const newObjective: Objective = {
      id: generateId(),
      text: '',
      classification: 'TASKS',
      weight: 0,
      results: []
    };
    setState(prev => ({ ...prev, objectives: [...prev.objectives, newObjective] }));
  };

  const updateObjective = (id: string, data: Partial<Objective>) => {
    setState(prev => ({
      ...prev,
      objectives: prev.objectives.map(o => o.id === id ? { ...o, ...data } : o)
    }));
  };

  const deleteObjective = (id: string) => {
    setState(prev => ({ ...prev, objectives: prev.objectives.filter(o => o.id !== id) }));
  };

  const addResult = (objId: string) => {
    const newResult: Result = {
      id: generateId(),
      name: '',
      weight: 0,
      indicatorType: 'NUMBER',
      targetLow: '',
      targetExpected: '',
      targetHigh: '',
      actualPerformance: '',
      evidence: []
    };
    setState(prev => ({
      ...prev,
      objectives: prev.objectives.map(o => o.id === objId ? { ...o, results: [...o.results, newResult] } : o)
    }));
  };

  const updateResult = (objId: string, resId: string, data: Partial<Result>) => {
    setState(prev => ({
      ...prev,
      objectives: prev.objectives.map(o => o.id === objId ? {
        ...o,
        results: o.results.map(r => r.id === resId ? { ...r, ...data } : r)
      } : o)
    }));
  };

  const deleteResult = (objId: string, resId: string) => {
    setState(prev => ({
      ...prev,
      objectives: prev.objectives.map(o => o.id === objId ? {
        ...o,
        results: o.results.filter(r => r.id !== resId)
      } : o)
    }));
  };

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage state={state} updateProfile={updateProfile} />} />
          <Route path="/objectives" element={
            <ObjectivesPage 
              state={state} 
              addObjective={addObjective}
              updateObjective={updateObjective}
              deleteObjective={deleteObjective}
              addResult={addResult}
              updateResult={updateResult}
              deleteResult={deleteResult}
            />
          } />
          <Route path="/report" element={<ReportPage state={state} />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
