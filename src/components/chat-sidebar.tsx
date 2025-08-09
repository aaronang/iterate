import { useState } from "react"
import { Send, Paperclip, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  attachments?: AttachedFile[]
}

interface AttachedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
}

export function ChatSidebar() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])

  const handleSendMessage = () => {
    if (!input.trim() && attachedFiles.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setAttachedFiles([])

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand your message. How can I help you further?",
        "That's an interesting question! Let me think about that...",
        "I'm here to assist you with your development needs.",
        "Thanks for your message! What would you like to work on?",
        "I can help you with coding, debugging, or planning your project.",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      // Check if the item is an image
      if (item.type.startsWith('image/')) {
        e.preventDefault()

        const file = item.getAsFile()
        if (file) {
          const attachedFile: AttachedFile = {
            id: Date.now().toString(),
            name: file.name || 'pasted-image.png',
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file)
          }

          setAttachedFiles((prev) => [...prev, attachedFile])
        }
        break
      }
    }
  }

  const handleAttachFile = () => {
    // Create a file input element
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,.pdf,.doc,.docx,.txt'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const attachedFile: AttachedFile = {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
        }

        setAttachedFiles((prev) => [...prev, attachedFile])
      }
    }
    input.click()
  }

  const removeAttachedFile = (fileId: string) => {
    setAttachedFiles((prev) => {
      const fileToRemove = prev.find(f => f.id === fileId)
      if (fileToRemove?.url) {
        URL.revokeObjectURL(fileToRemove.url)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }

  return (
    <Sidebar className="w-80 border-r">
      <SidebarContent className="flex-1 p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mb-2 space-y-1">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-2 text-xs opacity-90">
                          {attachment.url && attachment.type.startsWith('image/') ? (
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              className="w-6 h-6 object-cover rounded"
                            />
                          ) : (
                            <span>📄</span>
                          )}
                          <span className="truncate">{attachment.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Message content */}
                  {message.content && <div>{message.content}</div>}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-2">
          {/* Attached Files Display */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-md">
              {attachedFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-2 bg-background rounded px-2 py-1 text-sm">
                  {file.url && file.type.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                      📄
                    </div>
                  )}
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeAttachedFile(file.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Textarea with toolbar */}
          <div className="relative">
            <Textarea
              placeholder="Type your message or paste an image..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              onPaste={handlePaste}
              className="min-h-[80px] resize-none pr-12 pb-12"
              rows={3}
            />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button
                onClick={handleAttachFile}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="h-8 w-8 p-0"
                disabled={!input.trim() && attachedFiles.length === 0}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
