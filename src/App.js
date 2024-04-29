import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { MainLayout } from "./components/layout/MainLayout";

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col justify-between h-screen max-w-4xl px-5 mx-auto">
        <Header />
        <MainLayout />
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default App;
