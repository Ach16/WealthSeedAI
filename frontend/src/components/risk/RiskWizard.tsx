import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const questions = [
  {
    id: 'investment_horizon',
    title: 'Investment Horizon',
    description: 'How long do you plan to invest your money before you need to withdraw it?',
    options: ['Less than 1 year', '1-3 years', '3-7 years', '7-15 years', '15+ years']
  },
  {
    id: 'risk_tolerance',
    title: 'Risk Tolerance',
    description: 'Which statement best describes your attitude towards investment risk?',
    options: [
      'Avoid losses completely',
      'Small losses acceptable',
      'Moderate fluctuations acceptable',
      'Large fluctuations acceptable',
      'High risk for high returns'
    ]
  },
  {
    id: 'income_stability',
    title: 'Income Stability',
    description: 'How stable is your current and future income stream?',
    options: ['Very unstable', 'Somewhat unstable', 'Average', 'Stable', 'Very stable']
  },
  {
    id: 'emergency_fund',
    title: 'Emergency Fund',
    description: 'How many months of living expenses do you have saved in an easily accessible account?',
    options: ['None', 'Less than 3 months', '3-6 months', '6-12 months', 'More than 12 months']
  },
  {
    id: 'market_experience',
    title: 'Market Experience',
    description: 'How would you rate your experience and knowledge of financial markets?',
    options: ['No experience', 'Beginner', 'Intermediate', 'Advanced', 'Professional']
  }
];

interface RiskWizardProps {
  onComplete: (answers: any) => void;
  isLoading: boolean;
}

export const RiskWizard: React.FC<RiskWizardProps> = ({ onComplete, isLoading }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [questions[currentStep].id]: option });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentQ = questions[currentStep];
  const selectedOption = answers[currentQ.id];

  return (
    <div className="bg-[#0f172a] rounded-2xl p-8 border border-white/5 shadow-2xl max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>Step {currentStep + 1} of {questions.length}</span>
          <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-[#1e293b] rounded-full h-1.5">
          <div 
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" 
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8 min-h-[250px]">
        <h2 className="text-2xl font-bold text-white mb-2">{currentQ.title}</h2>
        <p className="text-slate-400 mb-6">{currentQ.description}</p>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(option)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedOption === option 
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                  : 'bg-[#1e293b] border-white/5 text-slate-300 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-white/5">
        <button
          onClick={handleBack}
          disabled={currentStep === 0 || isLoading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedOption || isLoading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : currentStep === questions.length - 1 ? 'Finish' : 'Next'}
          {!isLoading && currentStep < questions.length - 1 && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
