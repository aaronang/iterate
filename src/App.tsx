import { Button } from "@/components/ui/button"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ChatSidebar } from "@/components/chat-sidebar"

function App() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ChatSidebar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Welcome to Iterate</h1>
            <p className="text-muted-foreground">
              Your AI-powered development companion
            </p>
            <Button>Get Started</Button>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default App
