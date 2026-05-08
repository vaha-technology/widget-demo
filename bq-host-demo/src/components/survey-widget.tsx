import { useEffect, useRef, memo } from "react";

export interface BioniqSurveyConfig {
  questionnaire_key: string;
  callback_url: string;
  host_context: string;
  selector: string;
  onInit: () => void;
  [key: string]: any;
}

declare global {
  interface Window {
    bqSurvey?: { init?: (config: BioniqSurveyConfig) => void };
    quiz?: { init?: (config: BioniqSurveyConfig) => void };
  }
}

export const BioniqQuizWidget = memo((props: any) => {
  // CRITICAL: This ref ensures we only ever call .init() ONCE per page load
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 1. If we've already started the process, get out.
    if (hasInitialized.current) return;

    const jsUrl = import.meta.env.VITE_BIONIQ_JS_URL;
    const cssUrl = import.meta.env.VITE_BIONIQ_CSS_URL;
    const mountId = props.selector?.replace("#", "") || "app";

    const startWidget = () => {
      if (hasInitialized.current) return;

      const sdk = window.bqSurvey || window.quiz;
      const el = document.getElementById(mountId);

      if (el && sdk?.init) {
        hasInitialized.current = true;

        const finalConfig = {
          questionnaire_key: props.questionnaire_key,
          callback_url: props.callback_url, // Now pulled from your Playground form
          host_context: props.host_context,
          selector: `#${mountId}`,
          onInit: props.onInit,
          ...props, // Overlays everything else
        };

        sdk.init(finalConfig);
      } else {
        setTimeout(startWidget, 100);
      }
    };

    // Asset Injection
    if (cssUrl && !document.querySelector(`link[href="${cssUrl}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssUrl;
      document.head.appendChild(link);
    }

    if (jsUrl) {
      const existingScript = document.querySelector(`script[src="${jsUrl}"]`);
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = jsUrl;
        script.async = true;
        script.onload = startWidget;
        document.body.appendChild(script);
      } else {
        startWidget();
      }
    }
  }, []); // Only runs on mount

  return (
    <div
      className="bioniq-widget-wrapper"
      style={{ height: "100%", width: "100%" }}
    >
      <div id={props.selector?.replace("#", "") || "app"}></div>
    </div>
  );
});
