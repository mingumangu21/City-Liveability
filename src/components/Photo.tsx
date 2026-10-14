import { useState } from "react";
import { Globe2 } from "lucide-react";
export default function Photo({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div
      className="photo fallback"
      role="img"
      aria-label="이미지 연결 실패: 도시 풍경 대체 그림"
    >
      <Globe2 size={48} />
      <span>도시를 상상해 보세요</span>
    </div>
  ) : (
    <img
      loading="lazy"
      referrerPolicy="no-referrer"
      className="photo"
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}
