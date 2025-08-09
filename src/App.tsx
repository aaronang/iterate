import { SidebarProvider } from "@/components/ui/sidebar"
import { ChatSidebar } from "@/components/chat-sidebar"
import { AdminPanel } from "@/components/admin-panel"

function App() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ChatSidebar />
        <main className="flex-1 flex flex-col">
          {/* Preview area - empty for now */}
        </main>
      </div>
      {/* Admin Panel - positioned absolutely, separate from main app */}
      <AdminPanel />
    </SidebarProvider>
  )
}

export default App
