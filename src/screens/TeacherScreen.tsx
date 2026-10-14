import { ArrowLeft } from "lucide-react";
import { questions } from "../data/questions";
import { recommend, type Profile } from "../lib/recommend";
import type { Dispatch, SetStateAction } from "react";
import type { Screen } from "../types";
export default function TeacherScreen({
  setScreen,
}: {
  setScreen: Dispatch<SetStateAction<Screen>>;
}) {
  const initial: Profile = {
    age: "",
    job: "",
    salary: "",
    continent: "전체",
    nickname: "",
  };
  return (
    <section className="flow">
      <div className="eyebrow">FOR THE CLASSROOM</div>
      <h1>다른 가치관, 다양한 도시</h1>
      <p className="subtitle">
        교사용 데모 · 실제 학생 응답을 수집하지 않습니다.
      </p>
      <div className="panel">
        <h2>가상 응답 60명 비교</h2>
        <p className="muted">
          고정된 예시 응답을 계산한 데모입니다. 실제 학급 통계가 아닙니다.
        </p>
        {(() => {
          const counts: Record<string, number> = {};
          for (let n = 0; n < 60; n++) {
            const a = questions.map(
              (q) => 1 + ((n * 7 + q.area * ((n % 5) + 1)) % 5),
            );
            const r = recommend(
              { ...initial, salary: String(2000 + n * 100) },
              a,
            )[0];
            counts[r.city.name] = (counts[r.city.name] || 0) + 1;
          }
          return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([city, count]) => (
              <div className="demo-row" key={city}>
                <b>{city}</b>
                <div className="bar">
                  <i style={{ width: `${(count / 60) * 100}%` }} />
                </div>
                <span>{count}명</span>
              </div>
            ));
        })()}
        <p>
          예시 분포는 가중치와 도시 데이터의 영향을 보여줍니다. 빈도가 높은
          도시가 객관적으로 더 좋다는 뜻은 아니에요.
        </p>
      </div>
      <article className="learning">
        <h2>수업에 이렇게 활용해 보세요</h2>
        <p>
          ① 개인별 우선순위를 기록하고 ② 추천 도시의 지리적 특성을 조사한 뒤 ③
          친구와 다른 추천이 나온 이유를 설명해 보세요.
        </p>
        <p>
          실제 학급 저장·관리자 인증·학급별 분석·CSV/엑셀 내보내기는 후속
          단계입니다. 인증과 접근 제어, 동의 및 보관 정책을 마련한 뒤 개발해야
          합니다.
        </p>
      </article>
      <button className="secondary" onClick={() => setScreen("home")}>
        <ArrowLeft size={17} /> 시작 화면
      </button>
    </section>
  );
}
