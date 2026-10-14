import {
  ArrowLeft,
  MapPin,
  Check,
  RotateCcw,
  Download,
  Share2,
} from "lucide-react";
import { areas } from "../data/questions";
import { recommend, type Profile } from "../lib/recommend";
import type { Dispatch, SetStateAction } from "react";
import type { Screen } from "../types";
import Photo from "../components/Photo";
import { lazy, Suspense } from "react";
const ValueChart = lazy(() => import("../components/ValueChart"));
export default function ResultsScreen({
  profile,
  result,
  setScreen,
  setStep,
  download,
  share,
  reset,
}: {
  profile: Profile;
  result: ReturnType<typeof recommend>;
  setScreen: Dispatch<SetStateAction<Screen>>;
  setStep: Dispatch<SetStateAction<number>>;
  download: () => void;
  share: () => void;
  reset: () => void;
}) {
  const best = result[0];
  return (
    <section className="results">
      <div className="result-heading">
        <div className="eyebrow">YOUR CITY, YOUR STORY</div>
        <h1>{profile.nickname || "당신"}의 일상과 어울리는 도시</h1>
        <p>다른 우선순위를 선택하면, 다른 도시가 보일 수 있어요.</p>
      </div>
      <article className="result-main">
        <div className="result-title">
          <div>
            <span className="pill">
              가장 잘 맞는 도시 · {best.city.continent}
            </span>
            <h2>
              {best.city.name} <span>{best.city.english}</span>
            </h2>
            <p>
              <MapPin size={16} />
              {best.city.country} · {best.city.lat}°, {best.city.lng}°
            </p>
          </div>
          <div className="score">
            {best.score.toFixed(1)}
            <small>교육용 적합도 / 100</small>
          </div>
        </div>
        <div className="photo-grid">
          {best.city.images.map((src, i) => (
            <Photo
              key={src}
              src={src}
              alt={`도시·자연 분위기 참고 이미지 ${i + 1} (해당 도시 사진 아님)`}
            />
          ))}
        </div>
        <p className="image-credit">{best.city.imageSource}</p>
        <div className="city-facts">
          <div>
            <small>기후 특징</small>
            <p>{best.city.climate}</p>
          </div>
          <div>
            <small>이동 방식</small>
            <p>{best.city.transport}</p>
          </div>
          <div>
            <small>주거비 부담</small>
            <p>{best.city.housing}</p>
          </div>
        </div>
        <div className="result-columns">
          <div>
            <h3>나의 가치관과 잘 맞는 이유</h3>
            {best.contributions
              .map((value, i) => ({ value, i }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 3)
              .map(({ i }) => (
                <p className="reason" key={i}>
                  <Check size={18} />
                  <span>
                    <b>{areas[i]}</b> · 내 선호 {best.prefs[i].toFixed(0)}점,
                    도시 예시 평가 {best.effective[i].toFixed(0)}점. 전체 추천에{" "}
                    {best.contributions[i].toFixed(1)}점을 기여해요.
                  </span>
                </p>
              ))}
          </div>
          <div>
            <h3>함께 고려해 주세요</h3>
            {best.city.disadvantages.map((d) => (
              <p key={d} className="muted">
                • {d}
              </p>
            ))}
            <p className="muted">
              희망 직업 “{profile.job}”의 실제 취업 기회와 비자 조건은 계산하지
              않았어요.
            </p>
          </div>
        </div>
      </article>
      <div className="result-columns chart-row">
        <article className="panel">
          <h3>내 우선순위와 도시의 특성</h3>
          <p className="muted">핑크: 중요도 · 초록: 도시 조건 예시 (0~100)</p>
          <div className="chart">
            <Suspense fallback={<p>그래프 불러오는 중…</p>}>
              <ValueChart prefs={best.prefs} effective={best.effective} />
            </Suspense>
          </div>
        </article>
        <article className="panel">
          <h3>6가지 영역별 평가 근거</h3>
          {areas.map((a, i) => (
            <div className="area-row" key={a}>
              <div>
                <b>{a}</b>
                <span>가중치 {(best.weights[i] * 100).toFixed(1)}%</span>
              </div>
              <div className="bar">
                <i style={{ width: `${best.effective[i]}%` }} />
              </div>
              <small>
                {i === 0
                  ? `도시 경제성 ${best.city.scores[0]}점 + 연봉 대비 예시 비용 여유 ${best.affordability.toFixed(0)}점`
                  : i === 3
                    ? best.city.transport
                    : i === 2
                      ? best.city.climate
                      : `${a}의 교육용 도시 평가 ${best.city.scores[i]}점 · 관측 통계 아님`}
              </small>
              <small>{best.city.ratingMetadata[i].basis}</small>
            </div>
          ))}
        </article>
      </div>
      <h2 className="subheading">함께 살펴볼 도시들</h2>
      <div className="alternatives">
        {result.slice(1, 3).map((r) => (
          <article className="panel" key={r.city.id}>
            <span className="pill">{r.city.continent}</span>
            <h3>
              {r.city.name} <small>{r.city.english}</small>
            </h3>
            <p>
              {r.city.country} · 적합도 <b>{r.score.toFixed(1)}</b>
            </p>
            <p className="muted">
              강점:{" "}
              {areas[r.contributions.indexOf(Math.max(...r.contributions))]} ·
              메인 도시보다 {(best.score - r.score).toFixed(1)}점 낮음
            </p>
            <p className="muted">
              연간 예시 생활비 {(r.city.cost / 10000).toLocaleString("ko-KR")}
              만원 · 자연환경 {r.city.scores[2]}점 · 교통 {r.city.scores[3]}점
            </p>
          </article>
        ))}
      </div>
      <article className="learning">
        <span className="eyebrow">GEOGRAPHY NOTE</span>
        <h2>이 도시가 모든 사람에게 살기 좋은 도시일까?</h2>
        <p>
          {best.city.name}의 기후는 {best.city.climate}입니다. 교통은{" "}
          {best.city.transport}라는 특징을 살펴볼 수 있어요. 자연과 교통의
          접근성은 거주하는 동네, 소득과 이동 능력에 따라 달라집니다.
        </p>
        <p>
          같은 도시에서도 중심지와 외곽의 생활비, 녹지, 의료·교육 접근성은 다를
          수 있어요. 도시 평균만으로 모든 주민의 삶을 설명할 수 있을까요?
        </p>
        <p>
          <b>친구와 비교해 보세요.</b> 서로 가장 중요하게 생각한 영역은
          무엇인가요? 추천이 달라진 이유를 도시의 특징과 연결해 설명해 보세요.
        </p>
      </article>
      <details className="panel explanation">
        <summary>추천 계산 방식과 데이터 한계 보기</summary>
        <p>
          각 영역 문항의 평균을 5로 나누고 100을 곱해 선호 점수를 구합니다.
          가중치는 0.03 + 0.97 × (선호/100)³을 계산한 뒤 합이 1이 되게
          정규화합니다. 선호가 낮아도 영역을 완전히 제외하지 않습니다.
        </p>
        <p>
          경제성 = 도시 예시 경제성 × 75% + 연봉의 70% / 연간 예시 비용 × 100
          (최대 100) × 25%. 최종 점수는 6개 도시 평가와 영역 가중치의 곱을 합한
          값입니다. 안전 등 다른 다섯 영역도 계속 반영됩니다. 동점은 도시 ID로
          정렬하며 무작위 조정은 없습니다.
        </p>
        <p>
          비용은 세전 원화 연봉과 비교하는 KRW/년, 2026 가상 시나리오입니다.
          주거비를 포함한 가상 총 생활비이며, 주거비 부담: {best.city.housing}.
          메인 도시 예시 비용:{" "}
          {(best.city.cost / 10000).toLocaleString("ko-KR")}
          만원/년. 실제 통계·환율·세금 계산이 아닙니다.
        </p>
        <p>
          도시별 6개 점수와 비용은 검증된 외부 통계가 아닌 교육용 예시입니다.
          의료·교육·문화 등은 거친 종합 평가이며 실제 이용 자격을 반영하지
          않습니다. 기후·위치·교통 설명도 학습용 요약으로 최신 현지 자료 확인이
          필요합니다. 추천은 객관적인 거주 만족도나 이주 적합성을 보장하지
          않습니다.
        </p>
      </details>
      <div className="result-actions">
        <button
          className="secondary"
          onClick={() => {
            setStep(0);
            setScreen("survey");
          }}
        >
          <ArrowLeft size={17} /> 답변 수정
        </button>
        <button className="secondary" onClick={download}>
          <Download size={17} /> 카드 이미지 저장
        </button>
        <button className="secondary" onClick={share}>
          <Share2 size={17} /> 공유
        </button>
        <button className="primary" onClick={reset}>
          <RotateCcw size={17} /> 다시 검사하기
        </button>
      </div>
    </section>
  );
}
