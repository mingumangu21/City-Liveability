import {
  ResponsiveContainer,
  RadarChart,
  PolarRadiusAxis,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
} from "recharts";
import { areas } from "../data/questions";
export default function ValueChart({
  prefs,
  effective,
}: {
  prefs: number[];
  effective: number[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart
        data={areas.map((area, i) => ({
          area:
            area === "교통 및 접근성"
              ? "교통"
              : area === "생활 인프라"
                ? "인프라"
                : area,
          preference: prefs[i],
          city: effective[i],
        }))}
      >
        <PolarGrid />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <PolarAngleAxis dataKey="area" tick={{ fontSize: 12 }} />
        <Radar
          isAnimationActive={false}
          name="개인 선호"
          dataKey="preference"
          stroke="#c7788b"
          fill="#ecc0ca"
          fillOpacity={0.45}
        />
        <Radar
          isAnimationActive={false}
          name="도시 예시 평가"
          dataKey="city"
          stroke="#718d79"
          fill="#a8c0ae"
          fillOpacity={0.25}
        />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
}
