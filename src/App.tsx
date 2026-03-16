import { Button } from "@/components/ui/button";
import RepairsList from "./components/RepairsList";

function App() {
  return (
    <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold text-foreground">Welcome to Smart Repair</h1>
      <p className="text-muted-foreground">Testing Shadcn UI integration</p>
      <Button onClick={() => alert("Shadcn Button Working!")}>
        Click Me
      </Button>
      <div className="w-full max-w-4xl mt-8">
        <RepairsList />
      </div>
    </div>
  );
}

export default App;