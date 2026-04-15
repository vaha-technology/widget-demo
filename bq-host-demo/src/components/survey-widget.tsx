import { useEffect, useRef } from "react";

// interface definition
export interface BioniqSurveyConfig {
  // questionnaire_key: use to fetch specific questionnaire for the host
  questionnaire_key: string;
  // questionnaire_theme: leave out for now
  questionnaire_theme?: string;
  // callback_url: where the widget should redirect
  // formula_draft_uuid will be added to the url by the widget
  callback_url: string;
  distributor_id?: number | string;
  country_code?: string;
  // pass here "herbalife", "dscommerce", "shopify"
  host_context: string;
  // this is the DOM element to be used, e.g. #bq-survey - remember about #
  selector: string;
  // tbd
  additional_data?: Record<string, any>;
  // listener for host app callback
  onInit: () => void;
}

interface BioniqQuizWidgetProps extends Partial<BioniqSurveyConfig> {
  // Optional: Event Callbacks
  onVueAppReady?: (event: CustomEvent) => void;
  onQuizFinished?: (event: CustomEvent) => void;
}

// don't forget about types
declare global {
  interface Window {
    bqSurvey: {
      init?: (config: BioniqSurveyConfig) => void;
    };
  }
}

/**
 * this is the config object with the DEFAULT values
 * the properties used in <BioniqQuizWidget /> overrides
 * e.g. <BioniqQuizWidget questionnaire_key="go_memory_preset_quiz" /> will fetch memory quiz
 */

// const other_questionnaires = [
//   "go_female_preset_quiz",
//   "go_memory_preset_quiz",
//   "bioniq-questionnaire-shopify",
// ];

/**
 * before finishing quiz, go to https://my-global-dev.bioniq.com/
 * login with the password "bioniq"
 * only then the demo callback_url will work
 */
const defaults: BioniqSurveyConfig = {
  questionnaire_key: "bioniq-questionnaire-shopify",
  questionnaire_theme: "blue_orange",
  callback_url: `https://my-global-dev.bioniq.com/products/bioniq-go`,
  distributor_id: 1234,
  country_code: "GB",
  host_context: "react-demo",
  selector: "#app",
  onInit: () => console.log("[Host App] Widget initialized with defaults"),
};

export const BioniqQuizWidget = (props: BioniqQuizWidgetProps) => {
  // this is to prevent multiple callbacks registration
  const listenersAttached = useRef(false);

  useEffect(() => {
    /**
     * Bioniq Widget requires JS and CSS files to be injected
     * The pair is unique per environment - the host app shall manage the storage
     * recommendation is to use env
     */
    const jsUrl = import.meta.env.VITE_BIONIQ_JS_URL;
    const cssUrl = import.meta.env.VITE_BIONIQ_CSS_URL;

    /** optional start - register event listeners */
    const handleReady = (e: Event) => {
      console.log("[Host App] ✅ vue_app_ready");
      if (props.onVueAppReady) props.onVueAppReady(e as CustomEvent);
    };

    const handleFinished = (e: Event) => {
      console.log("[Host App] ✅ bqSurvey:quizFinished");
      if (props.onQuizFinished) props.onQuizFinished(e as CustomEvent);
    };

    if (!listenersAttached.current) {
      console.log("[Host App] Attaching Listeners");
      window.addEventListener("vue_app_ready", handleReady);
      window.addEventListener("bqSurvey:quizFinished", handleFinished);
      listenersAttached.current = true;
    }
    /** optional end - register event listeners */

    /**
     * function to start the widget
     * window.bqSurvey is initialized by the SDK widget
     */
    const startWidget = () => {
      if (window.bqSurvey?.init) {
        const finalConfig = {
          ...defaults,
          ...props,
        };

        console.log("[Host App] Initializing with config:", finalConfig);

        window.bqSurvey.init(finalConfig);
      } else {
        console.log("[Host App] widget did not initialize");
      }
    };

    // CSS injection
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

    return () => {
      console.log("[Host App] Cleaning Up");
      window.removeEventListener("vue_app_ready", handleReady);
      window.removeEventListener("bqSurvey:quizFinished", handleFinished);
      listenersAttached.current = false;
    };
  }, [props]);

  const mountId = props.selector?.replace("#", "") || "app";

  return (
    <>
      {/** use custom styles in the parent
       * be sure to use mountId for widget scoping
       */}
      <style>
        {`
          #${mountId} .bq-question-layout .bq-button-one-container { 
            background: #266431 !important; 
          }
          
          /* You can add more overrides here easily */
          #${mountId} .some-other-class {
            color: red;
          }
        `}
      </style>
      <div className="bioniq-widget-wrapper">
        <div id={mountId}></div>
      </div>
    </>
  );
};
