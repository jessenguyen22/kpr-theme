// Oxanium for headings
import oxanium200 from "@fontsource/oxanium/200.css?url";
import oxanium300 from "@fontsource/oxanium/300.css?url";
import oxanium400 from "@fontsource/oxanium/400.css?url";
import oxanium500 from "@fontsource/oxanium/500.css?url";
import oxanium600 from "@fontsource/oxanium/600.css?url";
import oxanium700 from "@fontsource/oxanium/700.css?url";
import oxanium800 from "@fontsource/oxanium/800.css?url";

// IBM Plex Sans for body text
import ibmPlexSans100 from "@fontsource/ibm-plex-sans/100.css?url";
import ibmPlexSans200 from "@fontsource/ibm-plex-sans/200.css?url";
import ibmPlexSans300 from "@fontsource/ibm-plex-sans/300.css?url";
import ibmPlexSans400 from "@fontsource/ibm-plex-sans/400.css?url";
import ibmPlexSans500 from "@fontsource/ibm-plex-sans/500.css?url";
import ibmPlexSans600 from "@fontsource/ibm-plex-sans/600.css?url";
import ibmPlexSans700 from "@fontsource/ibm-plex-sans/700.css?url";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { SeoConfig } from "@shopify/hydrogen";
import { Analytics, getSeoMeta, useNonce } from "@shopify/hydrogen";
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaArgs,
} from "@shopify/remix-oxygen";
import { useThemeSettings, withWeaverse } from "@weaverse/hydrogen";
import type { CSSProperties } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useRouteLoaderData,
} from "react-router";
import { Footer } from "./components/layout/footer";
import { Header } from "./components/layout/header";
import { ScrollingAnnouncement } from "./components/layout/scrolling-announcement";
import { CustomAnalytics } from "./components/root/custom-analytics";
import { GenericError } from "./components/root/generic-error";
import { GlobalLoading } from "./components/root/global-loading";
import { NotFound } from "./components/root/not-found";
import styles from "./styles/app.css?url";
import fontStyles from "./styles/fonts.css?url";
import { DEFAULT_LOCALE } from "./utils/const";
import { loadCriticalData, loadDeferredData } from "./utils/root.server";
import { GlobalStyle } from "./weaverse/style";

export type RootLoader = typeof loader;

export const links: LinksFunction = () => {
  return [
    {
      rel: "preconnect",
      href: "https://cdn.shopify.com",
    },
    {
      rel: "preconnect",
      href: "https://shop.app",
    },
    { rel: "icon", type: "image/svg+xml", href: "/favicon.ico" },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {
    ...deferredData,
    ...criticalData,
  };
}

export const meta = ({ data }: MetaArgs<typeof loader>) => {
  return getSeoMeta(data?.seo as SeoConfig);
};

function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: Error }) {
  const routeError: { status?: number; data?: any } = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);

  let pageType = "page";

  if (isRouteError) {
    if (routeError.status === 404) {
      pageType = routeError.data || pageType;
    }
  }

  return isRouteError ? (
    routeError.status === 404 ? (
      <NotFound type={pageType} />
    ) : (
      <GenericError
        error={{ message: `${routeError.status} ${routeError.data}` }}
      />
    )
  ) : (
    <GenericError error={error instanceof Error ? error : undefined} />
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>("root");
  const locale = data?.selectedLocale ?? DEFAULT_LOCALE;
  const { topbarHeight, topbarText } = useThemeSettings();

  return (
    <html lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {/* Oxanium for headings */}
        <link rel="stylesheet" href={oxanium200} />
        <link rel="stylesheet" href={oxanium300} />
        <link rel="stylesheet" href={oxanium400} />
        <link rel="stylesheet" href={oxanium500} />
        <link rel="stylesheet" href={oxanium600} />
        <link rel="stylesheet" href={oxanium700} />
        <link rel="stylesheet" href={oxanium800} />
        
        {/* IBM Plex Sans for body text */}
        <link rel="stylesheet" href={ibmPlexSans100} />
        <link rel="stylesheet" href={ibmPlexSans200} />
        <link rel="stylesheet" href={ibmPlexSans300} />
        <link rel="stylesheet" href={ibmPlexSans400} />
        <link rel="stylesheet" href={ibmPlexSans500} />
        <link rel="stylesheet" href={ibmPlexSans600} />
        <link rel="stylesheet" href={ibmPlexSans700} />
        <link rel="stylesheet" href={styles} />
        <link rel="stylesheet" href={fontStyles} />
        <Meta />
        <Links />
        <GlobalStyle />
      </head>
      <body
        style={
          {
            opacity: 0,
            "--initial-topbar-height": `${topbarText ? topbarHeight : 0}px`,
          } as CSSProperties
        }
        className="transition-opacity opacity-100! duration-300 antialiased bg-background text-body"
      >
        {data ? (
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
          >
            <TooltipProvider disableHoverableContent>
              <div
                className="flex flex-col min-h-screen-no-topbar"
                key={`${locale.language}-${locale.country}`}
              >
                <div className="">
                  <a href="#mainContent" className="sr-only">
                    Skip to content
                  </a>
                </div>
                <ScrollingAnnouncement />
                <Header />
                <main id="mainContent" className="grow">
                  {children}
                </main>
                <Footer />
              </div>
            </TooltipProvider>
            <CustomAnalytics />
          </Analytics.Provider>
        ) : (
          children
        )}
        <GlobalLoading />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default withWeaverse(App);
