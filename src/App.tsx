import type { Screen } from "./types";
import Home from "./screens/Home";
import ProfileScreen from "./screens/ProfileScreen";
import SurveyScreen from "./screens/SurveyScreen";
import ResultsScreen from "./screens/ResultsScreen";
import TeacherScreen from "./screens/TeacherScreen";
import { useEffect, useState } from "react";
import { Heart, GraduationCap } from "lucide-react";
import { areas } from "./data/questions";
import { recommend, type Profile } from "./lib/recommend";
const initial: Profile = {
  age: "",
  job: "",
  salary: "",
  continent: "전체",
  nickname: "",
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [profile, setProfile] = useState(initial);
  const [answers, setAnswers] = useState<number[]>(Array(20).fill(0));
  const [step, setStep] = useState(0);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const heading = document.querySelector<HTMLElement>(
      "main h1, .question-card h2",
    );
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }, [screen, step]);
  const reset = () => {
    setScreen("home");
    setProfile(initial);
    setAnswers(Array(20).fill(0));
    setStep(0);
    setNotice("");
  };
  const result = screen === "result" ? recommend(profile, answers) : [];
  const best = result[0];
  async function share() {
    if (!best) return;
    const text = `${profile.nickname || "나"}에게 어울리는 도시: ${best.city.name} (${best.city.english}) · 교육용 예시 적합도 ${best.score.toFixed(1)}점. City Liveability`;
    try {
      if (navigator.share)
        await navigator.share({ title: "City Liveability", text });
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setNotice("결과 문구를 복사했어요.");
      } else setNotice(text);
    } catch {
      setNotice("공유를 완료하지 않았어요. 이미지 저장을 이용할 수 있어요.");
    }
  }
  async function download() {
    if (!best) return;
    await document.fonts.ready;
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const c = canvas.getContext("2d")!;
    c.fillStyle = "#fff8f4";
    c.fillRect(0, 0, 1200, 800);
    c.fillStyle = "#31352f";
    c.font = 'bold 36px "Noto Sans KR Variable", sans-serif';
    c.fillText("City Liveability", 70, 90);
    c.font = '26px "Noto Sans KR Variable", sans-serif';
    c.fillText("나의 가치관으로 발견한 도시", 70, 165);
    c.font = 'bold 64px "Noto Sans KR Variable", sans-serif';
    c.fillText(best.city.name, 70, 265);
    c.font = '30px "Noto Sans KR Variable", sans-serif';
    c.fillText(`${best.city.english} · ${best.city.country}`, 70, 320);
    c.fillStyle = "#bf627c";
    c.fillText(`교육용 예시 적합도 ${best.score.toFixed(1)} / 100`, 70, 390);
    areas.forEach((a, i) => {
      c.fillStyle = "#31352f";
      c.font = '23px "Noto Sans KR Variable", sans-serif';
      c.fillText(
        `${a}: 선호 ${best.prefs[i].toFixed(0)} · 도시 예시 ${best.effective[i].toFixed(0)}`,
        70,
        450 + i * 40,
      );
    });
    c.font = '18px "Noto Sans KR Variable", sans-serif';
    c.fillText(
      "실제 이주 적합성이나 객관적인 거주 만족도를 보장하지 않습니다.",
      70,
      750,
    );
    const link = document.createElement("a");
    link.download = "city-liveability-result.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    setNotice("결과 카드 PNG를 저장했어요.");
  }
  return (
    <>
      <header>
        <button className="brand" onClick={() => setScreen("home")}>
          <span className="brand-icon">
            <Heart size={20} />
          </span>
          City Liveability<span className="brand-dot">.</span>
        </button>
        <nav>
          <button
            aria-label="교실에서 탐구하기"
            onClick={() => setScreen("teacher")}
          >
            <GraduationCap size={17} /> <span>교실에서 탐구하기</span>
          </button>
          <span className="nav-tag">나의 도시 발견하기</span>
        </nav>
      </header>
      <main>
        {screen === "home" && <Home setScreen={setScreen} />}
        {screen === "profile" && (
          <ProfileScreen
            profile={profile}
            setProfile={setProfile}
            setScreen={setScreen}
            setNotice={setNotice}
          />
        )}
        {screen === "survey" && (
          <SurveyScreen
            answers={answers}
            setAnswers={setAnswers}
            step={step}
            setStep={setStep}
            setScreen={setScreen}
          />
        )}
        {screen === "result" && best && (
          <ResultsScreen
            profile={profile}
            result={result}
            setScreen={setScreen}
            setStep={setStep}
            download={download}
            share={share}
            reset={reset}
          />
        )}
        {screen === "teacher" && <TeacherScreen setScreen={setScreen} />}
        {notice && (
          <div className="notice" role="status">
            {notice}
            <button onClick={() => setNotice("")} aria-label="알림 닫기">
              ×
            </button>
          </div>
        )}
      </main>
      <footer>
        <span>
          <Heart size={14} /> City Liveability
        </span>
        <p>살기 좋은 도시의 기준은, 우리 모두 조금씩 달라요.</p>
        <small>지리 수업을 위한 교육용 탐구 · 예시 데이터 기반</small>
      </footer>
    </>
  );
}
