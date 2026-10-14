import {
  Heart,
  ArrowRight,
  Globe2,
  Sparkles,
  Check,
  Compass,
  Ribbon,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { Screen } from "../types";
export default function Home({
  setScreen,
}: {
  setScreen: Dispatch<SetStateAction<Screen>>;
}) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span /> A LITTLE JOURNEY, A NEW PERSPECTIVE
          </div>
          <h1>
            나에게 가장 잘 맞는
            <br />
            도시는{" "}
            <span className="pink-word">
              어디일까?
              <svg viewBox="0 0 360 18">
                <path d="M3 13 Q160 -1 355 9" />
              </svg>
            </span>
          </h1>
          <p className="subtitle">
            나의 라이프스타일과 가치관으로 발견하는 세계의 도시
          </p>
          <p className="hero-description">
            누군가에게 좋은 도시가 나에게도 좋을까요?
            <br />
            내가 소중하게 생각하는 일상에서, 나만의 도시를 찾아보세요.
          </p>
          <button
            className="primary start"
            onClick={() => setScreen("profile")}
          >
            나에게 맞는 도시 찾기 <ArrowRight size={20} />
          </button>
          <div className="micro">
            <Check size={14} /> 약 5분 소요 <span>·</span> 20개의 질문{" "}
            <span>·</span> 가입 없이 시작
          </div>
        </div>
        <div className="hero-art">
          <div className="art-paper">
            <div className="paper-header">
              <span>YOUR NEXT CHAPTER</span>
              <Heart size={18} />
            </div>
            <div className="illustration">
              <div className="sun" />
              <div className="cloud c1" />
              <div className="cloud c2" />
              <div className="hill" />
              <div className="building b1">
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="building b2">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="building b3">
                <i />
                <i />
                <i />
              </div>
              <div className="tree t1" />
              <div className="tree t2" />
              <div className="path" />
            </div>
            <div className="paper-caption">
              어떤 일상을 꿈꾸고 있나요?
              <span>A place that feels like you.</span>
            </div>
          </div>
          <div className="floating-note">
            <Compass size={23} />
            <div>
              좋은 도시는, 나답게 살 수 있는 곳
              <small>당신의 가치관이 여행의 시작이에요.</small>
            </div>
          </div>
          <span className="art-star" aria-hidden="true">
            <Sparkles size={44} />
          </span>
          <span className="art-heart">♡</span>
        </div>
      </section>
      <section className="intro-strip">
        <div>
          <span className="section-kicker">MORE THAN A CITY TEST</span>
          <h2>
            도시를 알아가는 일,
            <br />
            나를 알아가는 일.
          </h2>
        </div>
        <p>
          정답은 없어요. 나의 우선순위를 발견하고,
          <br />
          서로 다른 도시의 삶을 지리적 시선으로 탐구해요.
        </p>
        <span className="strip-flower" aria-hidden="true">
          <Sparkles size={44} />
        </span>
      </section>
      <section className="feature-grid">
        {[
          {
            icon: <Heart />,
            title: "나의 가치관 발견",
            text: "경제성부터 자연환경까지,\n6가지 영역으로 내 일상을 살펴봐요.",
            n: "01",
          },
          {
            icon: <Globe2 />,
            title: "세계 도시와 연결",
            text: "6개 대륙, 34개의 도시에서\n나의 우선순위와 맞는 곳을 찾아요.",
            n: "02",
          },
          {
            icon: <Sparkles />,
            title: "새로운 시선으로 탐구",
            text: "추천 이유와 도시의 차이를 비교하며\n살기 좋은 도시의 의미를 생각해요.",
            n: "03",
          },
        ].map((f) => (
          <article className="feature" key={f.n}>
            <span className="feature-icon">{f.icon}</span>
            <span className="feature-number">{f.n}</span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </article>
        ))}
      </section>
      <div className="privacy">
        <Ribbon size={18} />
        <p>
          가볍게 시작하고, 깊이 생각해요.{" "}
          <span>입력한 정보와 답변은 서버에 저장하거나 전송하지 않아요.</span>
        </p>
      </div>
    </>
  );
}
