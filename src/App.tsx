import { Button } from "@/components/ui/button";
import RepairsList from "./components/RepairsList";
import { ExternalLink } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 flex-col items-center justify-center py-4 text-center">
          <h1 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
            SMART REPAIR
          </h1>
          <p className="mt-2 max-w-[700px] text-sm text-muted-foreground sm:text-base">
            A high-performance technical management system designed for real-time repair tracking, cost optimization, and client lifecycle management.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-8 flex flex-col items-center gap-8">
        <div className="w-full max-w-6xl">
          <RepairsList />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:px-8 md:py-0">
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
