import Script from "next/script";

type AnalyticsSettings = {
  gtmId: string | null;
  ga4Id: string | null;
  metaPixelId: string | null;
  smartlookId: string | null;
  customHeadScript: string | null;
  customBodyScript: string | null;
};

export default function Analytics({ settings }: { settings: AnalyticsSettings }) {
  return (
    <>
      {settings.gtmId && (
        <>
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${settings.gtmId}');`,
            }}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${settings.gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      {settings.ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${settings.ga4Id}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${settings.ga4Id}');`,
            }}
          />
        </>
      )}

      {settings.metaPixelId && (
        <>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${settings.metaPixelId}');fbq('track', 'PageView');`,
            }}
          />
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${settings.metaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {settings.smartlookId && (
        <Script
          id="smartlook"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.smartlook||(function(d) {var o=smartlook=function(){o.api.push(arguments)},h=d.getElementsByTagName('head')[0];var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);})(document);smartlook('init', '${settings.smartlookId}', { region: 'eu' });`,
          }}
        />
      )}

      {settings.customHeadScript && (
        <Script
          id="custom-head-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: settings.customHeadScript }}
        />
      )}

      {settings.customBodyScript && (
        <Script
          id="custom-body-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: settings.customBodyScript }}
        />
      )}
    </>
  );
}
