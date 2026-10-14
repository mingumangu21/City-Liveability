import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { areas, questions } from "../data/questions";
import type { Dispatch, SetStateAction } from "react";
import type { Screen } from "../types";
export default function SurveyScreen({
  answers,
  setAnswers,
  step,
  setStep,
  setScreen,
}: {
  answers: number[];
  setAnswers: Dispatch<SetStateAction<number[]>>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  setScreen: Dispatch<SetStateAction<Screen>>;
}) {
  const completed = answers.filter(Boolean).length;
  const labels = [
    "전혀 그렇지 않다",
    "그렇지 않다",
    "보통이다",
    "그렇다",
    "매우 그렇다",
  ];
  return (
    <section className="flow survey">
      <div className="eyebrow">STEP 02 · 나의 우선순위 발견하기</div>
      <div className="progress-label">
        <span>{completed} / 20문항 응답</span>
        <span>{Math.round((completed / 20) * 100)}%</span>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={20}
      >
        <div style={{ width: `${(completed / 20) * 100}%` }} />
      </div>
      <div className="question-card">
        <span className="pill">{areas[questions[step].area]}</span>
        <p className="question-number">
          QUESTION {String(step + 1).padStart(2, "0")}
        </p>
        <h2>{questions[step].text}</h2>
        <p className="hint">{questions[step].hint}</p>
        <div className="choices">
          {labels.map((label, i) => (
            <button
              key={label}
              className={answers[step] === i + 1 ? "choice selected" : "choice"}
              aria-pressed={answers[step] === i + 1}
              onClick={() => {
                setAnswers((a) => a.map((v, j) => (j === step ? i + 1 : v)));
              }}
            >
              <span>{i + 1}</span>
              {label}
              {answers[step] === i + 1 && <Check size={16} />}
            </button>
          ))}
        </div>
        <div className="actions">
          <button
            className="secondary"
            onClick={() =>
              step === 0 ? setScreen("profile") : setStep(step - 1)
            }
          >
            <ArrowLeft size={17} /> 이전
          </button>
          <span>{step + 1} / 20</span>
          <button
            className="primary"
            disabled={!answers[step] || (step === 19 && completed !== 20)}
            onClick={() =>
              step === 19 ? setScreen("result") : setStep(step + 1)
            }
          >
            {step === 19 ? "결과 확인" : "다음 질문"} <ArrowRight size={17} />
          </button>
        </div>
      </div>
      <div className="question-dots" aria-label="답변 수정할 문항 선택">
        {questions.map((q) => (
          <button
            key={q.id}
            className={`${answers[q.id] ? "answered" : ""} ${step === q.id ? "current" : ""}`}
            onClick={() => setStep(q.id)}
            aria-label={`${q.id + 1}번 문항${answers[q.id] ? " 응답 완료" : ""}`}
          >
            {q.id + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
