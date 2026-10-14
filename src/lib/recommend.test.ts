import { describe, it, expect } from "vitest";
import { preferences, recommend, type Profile } from "./recommend";
import { cities } from "../data/cities";
import { continents, questions } from "../data/questions";
const p: Profile = {
  age: "17",
  job: "교사",
  salary: "4000",
  continent: "전체",
  nickname: "",
};
describe("도시 추천", () => {
  it("잘못된 연봉·대륙과 빈 응답 배열을 거부한다", () => {
    for (const salary of ["0", "-1", "abc", ""])
      expect(() => recommend({ ...p, salary }, Array(20).fill(3))).toThrow();
    expect(() =>
      recommend({ ...p, continent: "없는 대륙" }, Array(20).fill(3)),
    ).toThrow();
    expect(() => preferences(new Array(20))).toThrow();
  });
  it("34개 도시와 모든 대륙, 20개 문항을 갖는다", () => {
    expect(cities.length).toBeGreaterThanOrEqual(30);
    expect(questions).toHaveLength(20);
    continents
      .slice(1)
      .forEach((c) =>
        expect(
          cities.filter((x) => x.continent === c).length,
        ).toBeGreaterThanOrEqual(3),
      );
    cities.forEach((c) => {
      expect(c.images).toHaveLength(3);
      expect(c.scores).toHaveLength(6);
    });
  });
  it("모든 응답을 요구한다", () => {
    expect(() => preferences([1])).toThrow();
    expect(() => preferences(Array(20).fill(0))).toThrow();
  });
  it("문항 수와 관계없이 영역별 평균을 계산한다", () => {
    expect(preferences(Array(20).fill(5))).toEqual(Array(6).fill(100));
    expect(preferences(Array(20).fill(1))).toEqual(Array(6).fill(20));
  });
  it("동일 입력은 동일 결과와 점수를 반환한다", () => {
    expect(recommend(p, Array(20).fill(3))).toEqual(
      recommend(p, Array(20).fill(3)),
    );
  });
  it("선호 대륙을 엄격하게 반영한다", () => {
    continents.slice(1).forEach((continent) => {
      const r = recommend({ ...p, continent }, Array(20).fill(3));
      expect(r.length).toBeGreaterThanOrEqual(3);
      expect(r.every((x) => x.city.continent === continent)).toBe(true);
    });
  });
  it("저소득도 대륙 선택을 바꾸지 않는다", () => {
    expect(
      recommend(
        { ...p, salary: "500", continent: "유럽" },
        Array(20).fill(3),
      ).every((r) => r.city.continent === "유럽"),
    ).toBe(true);
  });
  it("연봉은 경제성만 바꾸고 가중치 합과 점수 범위가 유효하다", () => {
    const a = recommend({ ...p, salary: "1000" }, Array(20).fill(3));
    const b = recommend({ ...p, salary: "8000" }, Array(20).fill(3));
    for (const r of a) {
      const other = b.find((x) => x.city.id === r.city.id)!;
      expect(r.effective.slice(1)).toEqual(other.effective.slice(1));
      expect(other.effective[0]).toBeGreaterThanOrEqual(r.effective[0]);
      expect(r.weights.reduce((s, w) => s + w, 0)).toBeCloseTo(1);
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
    }
  });
  it("가치관의 차이가 추천 순위에 반영된다", () => {
    const natural = questions.map((q) => (q.area === 2 ? 5 : 1));
    const cultural = questions.map((q) => (q.area === 4 ? 5 : 1));
    expect(recommend(p, natural)[0].city.id).not.toBe(
      recommend(p, cultural)[0].city.id,
    );
  });
  it("5^6 영역 선호 조합의 편중을 측정한다 (무작위 조정 없음)", () => {
    const counts: Record<string, number> = {};
    for (let n = 0; n < 15625; n++) {
      let k = n;
      const levels = Array.from({ length: 6 }, () => {
        const v = (k % 5) + 1;
        k = Math.floor(k / 5);
        return v;
      });
      const r = recommend(
        p,
        questions.map((q) => levels[q.area]),
      )[0];
      counts[r.city.id] = (counts[r.city.id] || 0) + 1;
    }
    const max = Math.max(...Object.values(counts));
    console.log(
      "연봉 4,000만원 · 전체 대륙 · 15,625개 선호 조합 추천 분포:",
      counts,
    );
    console.log("최대 추천 비율:", max / 15625);
    expect(Object.keys(counts).length).toBeGreaterThanOrEqual(10);
    expect(max / 15625).toBeLessThan(0.6);
  });
});
