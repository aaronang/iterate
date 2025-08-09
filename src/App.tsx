import { SidebarProvider } from "@/components/ui/sidebar"
import { ChatSidebar } from "@/components/chat-sidebar"

function App() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ChatSidebar />
        <main className="flex-1 flex flex-col">
          {/* Preview area - empty for now */}
        </main>
      </div>
    </SidebarProvider>
  )
}

export default App
