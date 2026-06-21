import React, { useState, useEffect } from 'react';
import { useLearningStore, Quiz } from '../../stores/learningStore';
import { CheckCircle, XCircle, ChevronRight, RefreshCw, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const QuizEngine = ({ quiz, moduleId }: { quiz: Quiz, moduleId: string }) => {
  const router = useRouter();
  const { submitQuizAnswers, progress } = useLearningStore();
  const modProgress = progress[moduleId];
  const previousScore = modProgress?.score || 0;

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTimeSpent(p => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (result) {
    const isPassed = result.passed;
    return (
      <div className="bg-[#1e293b] rounded-xl border border-white/5 p-8 md:p-12 text-center">
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${isPassed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {isPassed ? <CheckCircle className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{isPassed ? 'Quiz Passed!' : 'Needs Review'}</h2>
        <p className="text-slate-400 mb-8">You scored {result.score} out of {result.max_score}.</p>

        <div className="space-y-6 text-left mb-12">
          {quiz.questions.map((q) => {
            const res = result.results[q.id];
            return (
              <div key={q.id} className={`p-6 rounded-xl border ${res.is_correct ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                <div className="font-medium text-white mb-4 flex items-start gap-3">
                  {res.is_correct ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
                  {q.question}
                </div>
                <div className="pl-8 text-sm space-y-2">
                  <div className="text-slate-400">Your answer: <span className="text-white">{answers[q.id]}</span></div>
                  {!res.is_correct && <div className="text-slate-400">Correct answer: <span className="text-emerald-400 font-medium">{res.correct_answer}</span></div>}
                  <div className="mt-4 p-4 bg-[#0f172a] rounded-lg border border-white/5 text-slate-300">
                    <span className="text-indigo-400 font-medium mr-2">Explanation:</span>
                    {res.explanation}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={() => router.push('/learning')} className="px-6 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors">
            Back to Academy
          </button>
          {!isPassed && (
            <button onClick={() => { setResult(null); setAnswers({}); setCurrentQIndex(0); }} className="px-6 py-3 rounded-xl bg-indigo-500 text-white hover:bg-indigo-400 transition-colors flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Retake Quiz
            </button>
          )}
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQIndex];
  const isLast = currentQIndex === quiz.questions.length - 1;
  const currentAnswer = answers[question.id];

  const handleNext = async () => {
    if (isLast) {
      setIsSubmitting(true);
      try {
        const res = await submitQuizAnswers(quiz.id, moduleId, answers, Math.ceil(timeSpent / 60));
        setResult(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentQIndex(p => p + 1);
    }
  };

  const options = [
    { id: 'A', text: question.option_a },
    { id: 'B', text: question.option_b },
    { id: 'C', text: question.option_c },
    { id: 'D', text: question.option_d },
  ];

  return (
    <div className="bg-[#1e293b] rounded-xl border border-white/5 overflow-hidden max-w-3xl mx-auto">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0f172a]">
        <h3 className="font-semibold text-white">{quiz.title}</h3>
        <span className="text-sm text-slate-400">Question {currentQIndex + 1} of {quiz.questions.length}</span>
      </div>
      
      <div className="p-8 md:p-12">
        {previousScore > 0 && currentQIndex === 0 && (
          <div className="mb-8 p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> You've already scored {previousScore} points on this quiz. Retaking it can improve your score.
          </div>
        )}

        <h4 className="text-xl text-white font-medium mb-8 leading-relaxed">
          {question.question}
        </h4>

        <div className="space-y-4">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setAnswers(p => ({ ...p, [question.id]: opt.id }))}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                currentAnswer === opt.id 
                ? 'bg-indigo-500/20 border-indigo-500 text-white' 
                : 'bg-[#0f172a] border-white/5 text-slate-300 hover:border-white/20 hover:bg-white/[0.02]'
              }`}
            >
              <span className={`inline-block w-6 h-6 text-center rounded bg-black/20 mr-3 text-sm leading-6 ${currentAnswer === opt.id ? 'text-indigo-400' : 'text-slate-500'}`}>
                {opt.id}
              </span>
              {opt.text}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-white/5 bg-[#0f172a] flex justify-between">
        <button 
          onClick={() => setCurrentQIndex(p => Math.max(0, p - 1))}
          disabled={currentQIndex === 0}
          className="px-4 py-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!currentAnswer || isSubmitting}
          className="px-6 py-2 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? 'Submitting...' : isLast ? 'Submit Quiz' : 'Next Question'}
          {!isLast && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
