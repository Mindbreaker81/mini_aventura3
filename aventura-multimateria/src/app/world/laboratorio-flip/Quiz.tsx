"use client";
import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import useLaboratorioFlipStore from './useLaboratorioFlipStore';

const Quiz: React.FC = () => {
  const { 
    lessons, 
    currentLesson, 
    answers, 
    selectAnswer, 
    submitQuiz 
  } = useLaboratorioFlipStore();
  
  const lesson = lessons[currentLesson];

  if (!lesson) return null;

  const allQuestionsAnswered = answers.every(answer => answer !== null);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          🧠 Quiz: {lesson.title}
        </h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Clock size={16} />
            3 preguntas
          </span>
          <span>Mínimo 2 correctas para continuar</span>
        </div>
      </div>

      <div className="space-y-6">
        {lesson.questions.map((question, questionIndex) => (
          <div key={questionIndex} className="border border-gray-200 rounded-lg p-4">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                Pregunta {questionIndex + 1}
              </h3>
              <p className="text-gray-700">{question.q}</p>
            </div>
            
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    answers[questionIndex] === optionIndex
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${questionIndex}`}
                    value={optionIndex}
                    checked={answers[questionIndex] === optionIndex}
                    onChange={() => selectAnswer(questionIndex, optionIndex)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="flex-1 text-gray-700">{option}</span>
                  {answers[questionIndex] === optionIndex && (
                    <CheckCircle size={20} className="text-blue-600" />
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Progreso de respuestas */}
      <div className="mt-6 mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progreso del quiz</span>
          <span>{answers.filter(a => a !== null).length}/3 respondidas</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(answers.filter(a => a !== null).length / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Botón de envío */}
      <div className="flex justify-center">
        <button
          onClick={submitQuiz}
          disabled={!allQuestionsAnswered}
          className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all ${
            allQuestionsAnswered
              ? 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {allQuestionsAnswered ? (
            <>
              <CheckCircle size={20} />
              Comprobar respuestas
            </>
          ) : (
            <>
              <Clock size={20} />
              Responde todas las preguntas
            </>
          )}
        </button>
      </div>

      {/* Ayuda */}
      <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">💡 Recordatorio:</h4>
        <p className="text-yellow-700 text-sm">
          Si no recuerdas alguna respuesta, puedes volver a ver el video. 
          Necesitas al menos 2 respuestas correctas para obtener una pieza del experimento.
        </p>
      </div>
    </div>
  );
};

export default Quiz;