import { readFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";
test("20문항, 수정, 대륙 조건, 결과 저장과 초기화", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("https://images.unsplash.com/**", (route) => route.abort());
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (data: ShareData) => {
        (window as unknown as { sharedResult: ShareData }).sharedResult = data;
      },
    });
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /나에게 가장 잘 맞는/ }),
  ).toBeVisible();
  await expect(page.getByText("서울")).toHaveCount(0);
  await page.screenshot({
    path: `test-results/home-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "나에게 맞는 도시 찾기" }).click();
  await page.getByLabel("나이", { exact: false }).fill("17");
  await page.getByLabel("희망 직업").fill("교사");
  await page.getByLabel("예상 연봉").fill("4000");
  await page.getByLabel("선호 대륙").selectOption("유럽");
  await page.getByRole("button", { name: "검사 시작하기" }).click();
  await expect(page.getByRole("button", { name: "다음 질문" })).toBeDisabled();
  for (let i = 0; i < 20; i++) {
    await page.getByRole("button", { name: "3 보통이다" }).click();
    await page
      .getByRole("button", { name: i === 19 ? "결과 확인" : "다음 질문" })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "당신의 일상과 어울리는 도시" }),
  ).toBeVisible();
  await expect(page.getByText("가장 잘 맞는 도시 · 유럽")).toBeVisible();
  await expect(page.locator(".photo-grid .fallback")).toHaveCount(3);
  await expect(page.locator(".alternatives .panel")).toHaveCount(2);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator(".recharts-radar-polygon")).toHaveCount(2);
  const score = await page.locator(".score").innerText();
  await page.screenshot({
    path: `test-results/result-${testInfo.project.name}.png`,
    fullPage: true,
  });
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "카드 이미지 저장" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("city-liveability-result.png");
  const downloaded = await readFile((await download.path())!);
  expect(downloaded.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  expect(downloaded.readUInt32BE(16)).toBe(1200);
  expect(downloaded.readUInt32BE(20)).toBe(800);
  await page.getByRole("button", { name: "공유", exact: true }).click();
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { sharedResult: ShareData }).sharedResult.text,
    ),
  ).toContain("City Liveability");
  await page.getByRole("button", { name: "답변 수정" }).click();
  await page.getByRole("button", { name: "20번 문항 응답 완료" }).click();
  await page.getByRole("button", { name: "결과 확인" }).click();
  expect(await page.locator(".score").innerText()).toBe(score);
  await page.getByRole("button", { name: "다시 검사하기" }).click();
  await expect(
    page.getByRole("heading", { name: /나에게 가장 잘 맞는/ }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
test("기본 정보 수정과 이전 질문 이동, 교사용 데모", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "교실에서 탐구하기" }).click();
  await expect(
    page.getByRole("heading", { name: "가상 응답 60명 비교" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "시작 화면" }).click();
  await page.getByRole("button", { name: "나에게 맞는 도시 찾기" }).click();
  await page.getByLabel("나이").fill("17");
  await page.getByLabel("희망 직업").fill("개발자");
  await page.getByLabel("예상 연봉").fill("3500");
  await page.getByRole("button", { name: "검사 시작하기" }).click();
  await page.getByRole("button", { name: "5 매우 그렇다" }).click();
  await page.getByRole("button", { name: "다음 질문" }).click();
  await page.getByRole("button", { name: "이전", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "5 매우 그렇다" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "이전", exact: true }).click();
  await expect(page.getByLabel("희망 직업")).toHaveValue("개발자");
});
