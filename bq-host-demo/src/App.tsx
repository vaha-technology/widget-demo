import { BioniqQuizWidget } from "./components/survey-widget";

function App() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px" }}>
      <h1>BQ Survey injection demo</h1>
      <p>This is a React host environment.</p>

       {/**
        * All parameters here take priority over defaults defined in the component
        */}
      <BioniqQuizWidget
        distributor_id="999-PROMO"
        country_code="PL"
        onInit={() => console.log("host callback: Survey Loaded!")}
        host_context="herbalife"
        selector="#bq-survey"
      />
    </div>
  );
}

export default App;
