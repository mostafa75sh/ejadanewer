import { Objective, Result, IndicatorType } from './types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const calculateTotalWeight = (items: { weight: number }[]) => {
  return items.reduce((sum, item) => sum + item.weight, 0);
};

export const getDirectorateName = (governorate: string) => {
  if (!governorate) return "";
  return `المديرية العامة للتربية والتعليم بمحافظة ${governorate}`;
};

export const ensureUrlProtocol = (url: string) => {
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

export const analyzePerformance = (objectives: Objective[]): string => {
  if (objectives.length === 0) return "لا توجد بيانات كافية للتحليل.";

  let analysis = "تحليل الأداء المهني الشامل:\n\n";
  
  objectives.forEach((obj, index) => {
    const resultsCount = obj.results.length;
    const evidenceCount = obj.results.reduce((sum, r) => sum + r.evidence.length, 0);
    
    analysis += `الهدف ${index + 1} (${obj.text}):\n`;
    analysis += `- نقاط القوة: التزام واضح بتحقيق المستهدفات مع توفير ${evidenceCount} دليل(أدلة) ملموسة.\n`;
    analysis += `- فرص التحسين: يمكن تعزيز هذا الهدف من خلال تنويع مصادر الأدلة الرقمية ورفع سقف التوقعات في النتائج القادمة.\n\n`;
  });

  analysis += "التوصية العامة: الاستمرار في نهج التوثيق الرقمي المنظم لضمان دقة قياس مؤشرات الأداء الوظيفي.";
  
  return analysis;
};
