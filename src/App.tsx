import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "@/components/LangProvider";
import { RootLayout } from "@/components/RootLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Home } from "@/pages/Home";
import { Browse } from "@/pages/Browse";
import { SearchPage } from "@/pages/Search";
import { Watch } from "@/pages/Watch";
import { NotFound } from "@/pages/NotFound";

export function App() {
  return (
    <ErrorBoundary>
      <LangProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/watch/:type/:id" element={<Watch />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LangProvider>
    </ErrorBoundary>
  );
}

export default App;
