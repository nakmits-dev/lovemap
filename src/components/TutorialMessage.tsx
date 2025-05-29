import React from 'react';
import { X } from 'lucide-react';
import { useTutorial } from '../context/TutorialContext';

const messages = [
  {
    title: 'ラブマップへようこそ！',
    content: '恋愛関係を可視化するアプリです。登場人物を追加して、関係性を繋いでいきましょう。'
  },
  {
    title: '登場人物を追加',
    content: '左側のサイドバーから「＋」ボタンをクリックして、登場人物を追加できます。'
  },
  {
    title: '関係性を追加',
    content: '登場人物の横にある「＋」ボタンをクリックして、他の登場人物との関係を設定できます。'
  },
  {
    title: '男女の切り替え',
    content: '右上のボタンで、男性から女性へのアプローチと女性から男性へのアプローチを切り替えられます。'
  }
];

const TutorialMessage: React.FC = () => {
  const { currentStep, dismissTutorial, nextStep, prevStep } = useTutorial();

  if (currentStep < 0 || currentStep >= messages.length) return null;

  const message = messages[currentStep];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md mx-4 bg-white rounded-lg shadow-lg z-50">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-slate-800">{message.title}</h3>
          <button
            onClick={dismissTutorial}
            className="p-1 hover:bg-slate-100 rounded-full"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-slate-600 mb-4">{message.content}</p>
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {Array.from({ length: messages.length }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentStep ? 'bg-blue-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded"
              >
                戻る
              </button>
            )}
            {currentStep < messages.length - 1 ? (
              <button
                onClick={nextStep}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                次へ
              </button>
            ) : (
              <button
                onClick={dismissTutorial}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                始める
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};