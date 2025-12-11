import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// i18n
import "./i18n";
// Components (children)
import Spinner from "./components/Spinner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<Spinner />}>
      <App />
    </Suspense>
  </StrictMode>,
);

