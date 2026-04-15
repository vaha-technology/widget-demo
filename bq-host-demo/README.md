This repository serves as an example to demonstrate the widget injection.

- Navigate to bq-host-demo if you aren't there already (cd bq-host-demo)
- npm install
- npm run dev

This should already start off the widget on the localhost.

If it does not start, must be georestriction of the API or S3 bucket that requires network configuration Bioniq's end - please contact Igor Luczko <igor@bioniq.com>.

Next, navigate to app.tsx, and review the component call:

<BioniqQuizWidget
distributor_id="999-PROMO"
country_code="PL"
onInit={() => console.log("host callback: Survey Loaded!")}
host_context="herbalife"
selector="#bq-survey"
/>

Furthermore, go to component "survey-widget.tsx" and from there review the comments in the code.
