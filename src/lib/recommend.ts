import { cities, type City } from "../data/cities";
import { questions, continents } from "../data/questions";
export interface Profile {
  age: string;
  job: string;
  salary: string;
  continent: string;
  nickname: string;
}
export const algorithmConfig = {
  baseImportance: 0.03,
  preferenceImportance: 0.97,
  preferenceExponent: 3,
  budgetShare: 0.25,
  spendableIncome: 0.7,
};
export function preferences(answers: number[]) {
  if (
    answers.length !== 20 ||
    Array.from(answers).some((a) => !Number.isInteger(a) || a < 1 || a > 5)
  )
    throw new Error("20문항 모두 답해주세요.");
  return Array.from({ length: 6 }, (_, area) => {
    const items = questions.filter((q) => q.area === area);
    return (
      (items.reduce((s, q) => s + answers[q.id], 0) / items.length / 5) * 100
    );
  });
}
export function recommend(profile: Profile, answers: number[]) {
  if (!continents.includes(profile.continent))
    throw new Error("선호 대륙을 확인해 주세요.");
  const prefs = preferences(answers);
  const salary = Number(profile.salary) * 10000;
  if (!Number.isFinite(salary) || salary <= 0)
    throw new Error("연봉을 확인해 주세요.");
  const weights = prefs.map(
    (p) =>
      algorithmConfig.baseImportance +
      algorithmConfig.preferenceImportance *
        (p / 100) ** algorithmConfig.preferenceExponent,
  );
  const sum = weights.reduce((a, b) => a + b, 0);
  return cities
    .filter(
      (c) => profile.continent === "전체" || c.continent === profile.continent,
    )
    .map((city: City) => {
      const affordability = Math.max(
        0,
        Math.min(
          100,
          ((salary * algorithmConfig.spendableIncome) / city.cost) * 100,
        ),
      );
      const effective = city.scores.map((s, i) =>
        i === 0
          ? s * (1 - algorithmConfig.budgetShare) +
            affordability * algorithmConfig.budgetShare
          : s,
      );
      const contributions = effective.map((s, i) => (s * weights[i]) / sum);
      return {
        city,
        score: contributions.reduce((a, b) => a + b, 0),
        effective,
        contributions,
        prefs,
        weights: weights.map((w) => w / sum),
        affordability,
      };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        (a.city.id < b.city.id ? -1 : a.city.id > b.city.id ? 1 : 0),
    );
}
