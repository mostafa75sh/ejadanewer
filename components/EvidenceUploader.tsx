import React, { useState, useRef } from 'react';
import { Evidence, EvidenceType } from '../types';
import { generateId } from '../utils';
import { Image, Link, FileText, Video, Trash2, Mic, StopCircle } from 'lucide-react';

interface Props {
  evidenceList: Evidence[];
  onChange: (list: Evidence[]) => void;
}

export const EvidenceUploader: React.FC<Props> = ({ evidenceList, onChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to read file as DataURL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: EvidenceType) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newEvidence: Evidence = {
          id: generateId(),
          type,
          content: reader.result as string,
          notes: file.name
        };
        onChange([...evidenceList, newEvidence]);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addLink = () => {
    if (!linkInput) return;
    const newEvidence: Evidence = {
      id: generateId(),
      type: 'LINK',
      content: linkInput
    };
    onChange([...evidenceList, newEvidence]);
    setLinkInput('');
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("متصفحك لا يدعم الإدخال الصوتي");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      // Logic for stopping would be handled by the recognition event listeners in a real implementation
      return;
    }

    setIsRecording(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-OM';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const newEvidence: Evidence = {
        id: generateId(),
        type: 'TEXT',
        content: transcript
      };
      onChange([...evidenceList, newEvidence]);
      setIsRecording(false);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const removeEvidence = (id: string) => {
    onChange(evidenceList.filter(e => e.id !== id));
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="text-sm font-bold text-gray-700 mb-3">إرفاق الأدلة والبراهين</h4>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Buttons */}
        <label className="cursor-pointer bg-white border border-gray-300 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2 text-sm">
          <Image size={16} /> صورة
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e, 'IMAGE')} 
          />
        </label>

        <label className="cursor-pointer bg-white border border-gray-300 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2 text-sm">
          <FileText size={16} /> PDF
          <input 
            type="file" 
            accept="application/pdf" 
            className="hidden" 
            onChange={(e) => handleFileUpload(e, 'PDF')} 
          />
        </label>
        
        <button 
          onClick={handleVoiceInput}
          className={`px-3 py-2 rounded-md flex items-center gap-2 text-sm transition-colors ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-white border border-gray-300 text-gray-600'}`}
        >
          {isRecording ? <StopCircle size={16} /> : <Mic size={16} />}
          {isRecording ? 'جارٍ التسجيل...' : 'إملاء صوتي'}
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input 
          type="url" 
          placeholder="إضافة رابط (فيديو/مستند)..." 
          className="flex-1 p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-oman-green focus:outline-none"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
        />
        <button 
          onClick={addLink}
          className="bg-oman-green text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
        >
          <Link size={16} />
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {evidenceList.map(ev => (
          <div key={ev.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 shadow-sm text-sm">
            <div className="flex items-center gap-2 overflow-hidden">
              {ev.type === 'IMAGE' && <Image size={16} className="text-blue-500" />}
              {ev.type === 'PDF' && <FileText size={16} className="text-red-500" />}
              {ev.type === 'LINK' && <Link size={16} className="text-green-500" />}
              {ev.type === 'TEXT' && <Mic size={16} className="text-gray-500" />}
              
              <span className="truncate max-w-[200px] text-gray-700">
                {ev.type === 'IMAGE' ? 'صورة مرفقة' : ev.type === 'PDF' ? ev.notes || 'ملف PDF' : ev.content}
              </span>
              
              {ev.type === 'IMAGE' && (
                <img src={ev.content} alt="preview" className="h-8 w-8 object-cover rounded ml-2" />
              )}
            </div>
            <button onClick={() => removeEvidence(ev.id)} className="text-red-500 hover:text-red-700">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {evidenceList.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-2">لا توجد أدلة مرفقة حتى الآن</p>
        )}
      </div>
    </div>
  );
};