import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportHiggsfieldError } from "../lib/higgsfield-error-reporting";
// Page metadata (browser <title>/favicon + social og: tags) committed into the
// repo by the marketplace meta API and read at BUILD time — no runtime fetch.
// Editing it via the app settings UI rewrites this file and redeploys the app.
import appMetaJson from "../app-meta.json";

declare const __HF_DESIGN_INSPECTOR__: boolean;

// Built-in defaults for any field that isn't set in app-meta.json.
const DEFAULT_TITLE = "HookForge: 20 AI UGC ads in 48 hours";
const DEFAULT_DESCRIPTION =
  "AI UGC video ad packs for e-commerce brands. Delivered in 48 hours.";

type AppMeta = {
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  favicon_url?: string | null;
  og_video_url?: string | null;
};

const appMeta = appMetaJson as AppMeta;

const APP_HOST_ZONES = ["higgsfield.app", "higgsfield-dev.app"];

function toOwnAssetUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("/")) return value; // already root-relative
  try {
    const u = new URL(value);
    const isAppHost = APP_HOST_ZONES.some(
      (zone) => u.hostname === zone || u.hostname.endsWith(`.${zone}`),
    );
    if (isAppHost) return u.pathname + u.search;
    return value; // external host (CDN, etc.) — keep absolute
  } catch {
    return value; // not a parseable URL — leave as-is
  }
}

function buildHead(meta: AppMeta) {
  const title = meta.og_title ?? DEFAULT_TITLE;
  const description = meta.og_description ?? DEFAULT_DESCRIPTION;
  const ogImage = toOwnAssetUrl(meta.og_image_url);
  const favicon = toOwnAssetUrl(meta.favicon_url);
  const ogVideo = toOwnAssetUrl(meta.og_video_url);

  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title },
      { name: "description", content: description },
      { name: "author", content: "HookForge" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: ogImage ? "summary_large_image" : "summary" },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { name: "twitter:image", content: ogImage },
          ]
        : []),
      ...(ogVideo ? [{ property: "og:video", content: ogVideo }] : []),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous" as const,
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap",
      },
      ...(favicon ? [{ rel: "icon", href: favicon }] : []),
    ],
  };
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#111318] px-4 text-[#F4F2EE]">
      <div className="mx-auto max-w-md text-center">
        <p className="font-monox text-sm text-[#FF8A3D]">404</p>
        <h1 className="font-display mt-2 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-[#9BA0AA]">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-5 inline-block rounded-lg bg-[#FF5C1F] px-5 py-2.5 text-sm font-semibold text-[#111318] transition-colors hover:bg-[#FF8A3D]"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportHiggsfieldError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#111318] px-4 text-[#F4F2EE]">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-bold">This page did not load</h1>
        <p className="mt-2 text-sm text-[#9BA0AA]">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-lg bg-[#FF5C1F] px-5 py-2.5 text-sm font-semibold text-[#111318] transition-colors hover:bg-[#FF8A3D]"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-lg border border-[#1E222A] px-5 py-2.5 text-sm font-semibold text-[#F4F2EE] transition-colors hover:border-[#FF5C1F]"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // Read the committed page metadata at build time (no runtime fetch).
  head: () => buildHead(appMeta),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="default-dark" style={{ colorScheme: "dark" }}>
      <head>
        <HeadContent />
      </head>
      <body className="bg-[#111318] text-[#F4F2EE]">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if (!__HF_DESIGN_INSPECTOR__) {
      return;
    }

    void import("../module/design-inspector/runtime")
      .then(({ installHiggsfieldDesignInspector }) => {
        installHiggsfieldDesignInspector();
      })
      .catch((error) => {
        reportHiggsfieldError(
          error instanceof Error ? error : new Error("Failed to load design inspector"),
          {
            boundary: "higgsfield_design_inspector_import",
          },
        );
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
