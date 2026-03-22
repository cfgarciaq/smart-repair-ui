import RepairsList from "./components/RepairsList";
import { ExternalLink } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
            SMART REPAIR
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-8 flex flex-col gap-8">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">System Overview</h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-3xl">
              A high-performance technical management system designed for real-time repair tracking, cost optimization, and client lifecycle management.
            </p>
          </div>
          <RepairsList />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:px-8 md:py-0 bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="https://cfgarciaq.dev"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 inline-flex items-center gap-1"
            >
              cfgarciaq.dev <ExternalLink className="h-3 w-3" />
            </a>
            . The source code is available on GitHub.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
