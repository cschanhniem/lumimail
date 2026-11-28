import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BrandLockup, LumimailMark, RouteMotif } from "@/components/brand";

describe("LumimailMark", () => {
	it("renders the app icon as decoration that fills its box", () => {
		const markup = renderToStaticMarkup(<LumimailMark className="h-7 w-7" />);

		expect(markup).toContain('data-brand-mark="true"');
		expect(markup).toContain('aria-hidden="true"');
		expect(markup).toContain('src="/icon-192.png"');
		expect(markup).toContain('alt=""');
		expect(markup).toContain("h-full w-full");
	});
});

describe("BrandLockup", () => {
	it("keeps the wordmark and optional tagline as live text", () => {
		const markup = renderToStaticMarkup(<BrandLockup tagline="Cloudflare-native email operations" />);

		expect(markup).toContain(">Lumimail<");
		expect(markup).toContain("Cloudflare-native email operations");
	});

	it("omits the tagline in compact application chrome", () => {
		const markup = renderToStaticMarkup(<BrandLockup />);

		expect(markup).toContain(">Lumimail<");
		expect(markup).not.toContain("Cloudflare-native");
	});
});

describe("RouteMotif", () => {
	it("renders code-native route geometry as decoration", () => {
		const markup = renderToStaticMarkup(<RouteMotif className="opacity-10" />);

		expect(markup).toContain('data-brand-route="true"');
		expect(markup).toContain('aria-hidden="true"');
		expect(markup).toContain('viewBox="0 0 320 240"');
		expect(markup).not.toContain("<img");
	});
});
