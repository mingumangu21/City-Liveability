import { ArrowRight, ArrowLeft } from "lucide-react";
import { continents } from "../data/questions";
import { type Profile } from "../lib/recommend";
import type { Dispatch, SetStateAction } from "react";
import type { Screen } from "../types";
export default function ProfileScreen({
  profile,
  setProfile,
  setScreen,
  setNotice,
}: {
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
  setScreen: Dispatch<SetStateAction<Screen>>;
  setNotice: Dispatch<SetStateAction<string>>;
}) {
  return (
    <section className="flow">
      <div className="eyebrow">STEP 01 · 나의 일상 상상하기</div>
      <h1>먼저, 당신을 알려주세요.</h1>
      <p className="subtitle">미래의 내 모습을 자유롭게 상상해도 좋아요.</p>
      <form
        className="form-card"
        onSubmit={(e) => {
          e.preventDefault();
          setScreen("survey");
          setNotice("");
        }}
      >
        <div className="form-grid">
          <label>
            나이{" "}
            <input
              type="number"
              min="14"
              max="120"
              required
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              placeholder="예: 17"
            />
            <small>14~120세 · 추천 순위에는 반영하지 않아요.</small>
          </label>
          <label>
            이름이나 별명 <span className="optional">선택</span>
            <input
              maxLength={30}
              value={profile.nickname}
              onChange={(e) =>
                setProfile({ ...profile, nickname: e.target.value })
              }
              placeholder="어떻게 불러드릴까요?"
            />
          </label>
          <label>
            희망 직업
            <input
              required
              maxLength={80}
              value={profile.job}
              onChange={(e) => setProfile({ ...profile, job: e.target.value })}
              placeholder="예: 교사, 디자이너"
            />
            <small>
              관심 있는 직업을 적어주세요. 취업 가능성 계산에는 사용하지 않아요.
            </small>
          </label>
          <label>
            예상 연봉 <span className="optional">만원 / 년</span>
            <input
              type="number"
              min="1"
              max="1000000"
              required
              value={profile.salary}
              onChange={(e) =>
                setProfile({ ...profile, salary: e.target.value })
              }
              placeholder="예: 4000 = 연 4,000만원"
            />
            <small>
              세전 원화 연봉을 상상해 입력하세요. 현지 소득·세금·환율은
              별도예요.
            </small>
          </label>
          <label className="wide">
            선호 대륙
            <select
              value={profile.continent}
              onChange={(e) =>
                setProfile({ ...profile, continent: e.target.value })
              }
            >
              {continents.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <small>
              선택한 대륙 안에서 추천해요. 전체를 선택하면 모든 도시를 비교해요.
            </small>
          </label>
        </div>
        <div className="privacy-inline">
          입력과 답변은 현재 브라우저 메모리에서만 처리됩니다. 새로고침하면
          사라져요. 외부 사진 요청에는 설문 정보를 포함하지 않아요.
        </div>
        <div className="actions">
          <button
            type="button"
            className="secondary"
            onClick={() => setScreen("home")}
          >
            <ArrowLeft size={17} /> 이전
          </button>
          <button className="primary" type="submit">
            검사 시작하기 <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </section>
  );
}
