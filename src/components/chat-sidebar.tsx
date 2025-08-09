import { useState, useEffect, useRef } from "react"
import { ArrowUp, Image, X, PackageSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea when input changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 400) + 'px'
    }
  }, [input])

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

    // Check if we already have 3 attachments
    if (attachedFiles.length >= 3) {
      alert('Maximum 3 attachments allowed')
      return
    }

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
    // Check if we already have 3 attachments
    if (attachedFiles.length >= 3) {
      alert('Maximum 3 attachments allowed')
      return
    }

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
    <Sidebar className="border-r">
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
                    <div className="mb-2 space-y-2">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id}>
                          {attachment.url && attachment.type.startsWith('image/') ? (
                            <div className="space-y-1">
                              <img
                                src={attachment.url}
                                alt={attachment.name}
                                className="max-w-full max-h-48 object-contain rounded-md border"
                              />
                              <div className="text-xs opacity-70 truncate">{attachment.name}</div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs opacity-90 p-2 bg-muted/50 rounded">
                              <span>📄</span>
                              <span className="truncate">{attachment.name}</span>
                            </div>
                          )}
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
        {/* Container that looks like a textarea */}
        <div className="border rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          {/* Attached images displayed inline */}
          {attachedFiles.length > 0 && (
            <div className="p-3 pb-0 flex flex-wrap gap-2">
              {attachedFiles.map((file) => (
                <div key={file.id} className="relative">
                  {file.url && file.type.startsWith('image/') ? (
                    <div className="relative group/thumbnail">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-1 right-1 h-6 w-6 p-0 flex items-center justify-center opacity-0 group-hover/thumbnail:opacity-100 transition-opacity duration-200"
                        onClick={() => removeAttachedFile(file.id)}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative w-20 h-20 bg-muted rounded-lg border flex flex-col items-center justify-center group/file">
                      <span className="text-2xl">📄</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-1 right-1 h-6 w-6 p-0 flex items-center justify-center opacity-0 group-hover/file:opacity-100 transition-opacity duration-200"
                        onClick={() => removeAttachedFile(file.id)}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Auto-expanding textarea */}
          <Textarea
            ref={textareaRef}
            placeholder="Describe your idea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            onPaste={handlePaste}
            className={`max-h-[400px] resize-none border-0 focus-visible:ring-0 shadow-none overflow-y-auto scrollbar-thin ${
              attachedFiles.length > 0 ? 'pt-2' : ''
            }`}
            style={{
              height: 'auto',
              maxHeight: '400px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 400) + 'px';
            }}
          />

          {/* Bottom toolbar within the container */}
          <div className="flex justify-between items-center p-1.5">
            <div className="flex gap-0.5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleAttachFile}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      disabled={attachedFiles.length >= 3}
                    >
                      <Image className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{attachedFiles.length >= 3 ? 'Maximum 3 attachments' : 'Attach image'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        // TODO: Add package search functionality
                        console.log('Package search clicked')
                      }}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                    >
                      <PackageSearch className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Browse components</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full"
                    disabled={!input.trim() && attachedFiles.length === 0}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
