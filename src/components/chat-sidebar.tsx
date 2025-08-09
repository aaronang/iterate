import { useState, useEffect, useRef } from "react"
import { ArrowUp, Image, X, Trash2, Loader2, FilePen, ChevronDown, ChevronUp, Cog } from "lucide-react"
import { prototypeScenarios } from "@/data/prototypeScenarios"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  SidebarHeader,
} from "@/components/ui/sidebar"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  attachments?: AttachedFile[]
  fileChanges?: FileChange[]
}

interface FileChange {
  id: string
  filename: string
  action: "modifying" | "creating" | "deleting"
  changes: string[]
  isLoading?: boolean
}

function TypingIndicator() {
  return (
    <div className="bg-muted/50 border rounded-lg px-3 py-2 mb-2 text-sm">
      <div className="flex items-center gap-2">
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        <span className="font-medium">Thinking...</span>
      </div>
    </div>
  )
}

function FileChangeIndicator({ fileChange }: { fileChange: FileChange }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [visibleChanges, setVisibleChanges] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (fileChange.isLoading) {
      // Show changes progressively
      fileChange.changes.forEach((change, index) => {
        setTimeout(() => {
          setVisibleChanges(prev => [...prev, change])
          if (index === fileChange.changes.length - 1) {
            setTimeout(() => setIsComplete(true), 500)
          }
        }, (index + 1) * 800) // 800ms delay between each change
      })
    } else {
      // Show all changes immediately for non-loading states
      setVisibleChanges(fileChange.changes)
      setIsComplete(true)
    }
  }, [fileChange])

  const getIcon = () => {
    if (fileChange.isLoading && !isComplete) {
      return <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
    }

    switch (fileChange.action) {
      case "creating":
        return <FilePen className="h-3 w-3 text-muted-foreground" />
      case "modifying":
        return <FilePen className="h-3 w-3 text-muted-foreground" />
      case "deleting":
        return <Trash2 className="h-3 w-3 text-muted-foreground" />
    }
  }

  const getActionText = () => {
    if (fileChange.isLoading && !isComplete) {
      switch (fileChange.action) {
        case "creating":
          return "Creating file"
        case "modifying":
          return "Edited file"
        case "deleting":
          return "Deleting file"
      }
    }

    switch (fileChange.action) {
      case "creating":
        return "Created file"
      case "modifying":
        return "Edited file"
      case "deleting":
        return "Deleted file"
    }
  }

  const hasChanges = visibleChanges.length > 0

  // Custom truncation that shows the end of the path (filename)
  const formatFilePath = (filepath: string) => {
    const parts = filepath.split('/')
    if (parts.length <= 2) return filepath

    // For long paths, show ".../" + last two parts
    const lastTwo = parts.slice(-2).join('/')
    return `.../${lastTwo}`
  }

  return (
    <div className="bg-muted/50 border rounded-lg mb-2 text-sm overflow-hidden w-full">
      <div
        className={`flex items-center px-3 py-2 w-full overflow-hidden ${hasChanges ? 'cursor-pointer hover:bg-muted/70' : ''}`}
        onClick={() => hasChanges && setIsExpanded(!isExpanded)}
      >
        <div className="flex-shrink-0 mr-2">
          {getIcon()}
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-1 w-full overflow-hidden">
            <span className="font-medium shrink-0 whitespace-nowrap">{getActionText()}</span>
            <span className="text-muted-foreground truncate flex-1 overflow-hidden">
              {formatFilePath(fileChange.filename)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          {hasChanges && (
            <div>
              {isExpanded ? (
                <ChevronUp className="h-3 w-3 text-muted-foreground" strokeWidth={2.25}/>
              ) : (
                <ChevronDown className="h-3 w-3 text-muted-foreground" strokeWidth={2.25}/>
              )}
            </div>
          )}
        </div>
      </div>

      {isExpanded && hasChanges && (
        <div className="border-t border-muted">
          <div className="px-3 py-2 bg-muted/30">
            <div className="text-xs font-mono text-muted-foreground space-y-1">
              {fileChange.action === "creating" && (
                <>
                  <div className="text-green-600 dark:text-green-400">+ export function Button() {"{"}</div>
                  <div className="text-green-600 dark:text-green-400">+   return (</div>
                  <div className="text-green-600 dark:text-green-400">+     &lt;button className="px-4 py-2"&gt;</div>
                  <div className="text-green-600 dark:text-green-400">+       Click me</div>
                  <div className="text-green-600 dark:text-green-400">+     &lt;/button&gt;</div>
                  <div className="text-green-600 dark:text-green-400">+   )</div>
                  <div className="text-green-600 dark:text-green-400">+ {"}"}</div>
                </>
              )}
              {fileChange.action === "modifying" && (
                <>
                  <div className="text-muted-foreground">  export function Button() {"{"}</div>
                  <div className="text-red-600 dark:text-red-400">-   return &lt;button&gt;Old Button&lt;/button&gt;</div>
                  <div className="text-green-600 dark:text-green-400">+   return (</div>
                  <div className="text-green-600 dark:text-green-400">+     &lt;button className="px-4 py-2 bg-blue-500"&gt;</div>
                  <div className="text-green-600 dark:text-green-400">+       New Button</div>
                  <div className="text-green-600 dark:text-green-400">+     &lt;/button&gt;</div>
                  <div className="text-green-600 dark:text-green-400">+   )</div>
                  <div className="text-muted-foreground">  {"}"}</div>
                </>
              )}
              {fileChange.action === "deleting" && (
                <>
                  <div className="text-red-600 dark:text-red-400">- export function Button() {"{"}</div>
                  <div className="text-red-600 dark:text-red-400">-   return &lt;button&gt;Button&lt;/button&gt;</div>
                  <div className="text-red-600 dark:text-red-400">- {"}"}</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface AttachedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
}

export function ChatSidebar() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [chatTitle, setChatTitle] = useState("New chat")
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

    // Rename chat based on user's first message if it's currently "New chat"
    if (chatTitle === "New chat" && input.trim()) {
      const chatTitles = [
        "Button Component",
        "Login Form",
        "API Integration",
        "Dashboard UI",
        "User Authentication",
        "Data Visualization",
        "File Upload",
        "Search Feature"
      ]
      const randomTitle = chatTitles[Math.floor(Math.random() * chatTitles.length)]
      setChatTitle(randomTitle)
    }

    // Simulate AI response with progressive file changes
    // First show thinking indicator
    setTimeout(() => {
      const thinkingMessage: Message = {
        id: Date.now().toString(),
        content: "",
        role: "assistant",
        timestamp: new Date(),
        fileChanges: [{
          id: "thinking",
          filename: "",
          action: "modifying" as const,
          changes: [],
          isLoading: true
        }]
      }
      setMessages((prev) => [...prev, thinkingMessage])
    }, 500)

    // Then show actual response with file changes
    setTimeout(() => {


      const randomScenario = prototypeScenarios[Math.floor(Math.random() * prototypeScenarios.length)]

      // Execute the scenario steps
      let currentDelay = 0

      // Remove thinking message first
      setMessages((prev) => prev.filter(msg => !msg.fileChanges?.some(fc => fc.id === "thinking")))

      randomScenario.steps.forEach((step, stepIndex) => {
        setTimeout(() => {
          if (step.thinking) {
            // Add thinking as permanent text message
            setMessages((prev) => [...prev, {
              id: `thinking-${Date.now()}-${stepIndex}`,
              content: step.thinking || "",
              role: "assistant",
              timestamp: new Date(),
            }])
          } else if (step.fileChanges) {
            // Add file changes
            setMessages((prev) => [...prev, {
              id: `step-${Date.now()}-${stepIndex}`,
              content: "",
              role: "assistant",
              timestamp: new Date(),
              fileChanges: step.fileChanges
            }])
          }
        }, currentDelay)

        currentDelay += step.thinking ? 2000 : 2500 // Thinking takes 2s, file operations take 2.5s
      })

      // Add final summary
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: `summary-${Date.now()}`,
          content: randomScenario.summary,
          role: "assistant",
          timestamp: new Date(),
        }])
      }, currentDelay + 1000)

    }, 2000)
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
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <Select value={chatTitle} onValueChange={setChatTitle}>
            <SelectTrigger className="w-[180px] h-8 text-sm">
              <SelectValue placeholder="New chat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New chat">New chat</SelectItem>
              <SelectItem value="Button Component">Button Component</SelectItem>
              <SelectItem value="Login Form">Login Form</SelectItem>
              <SelectItem value="API Integration">API Integration</SelectItem>
              <SelectItem value="Dashboard UI">Dashboard UI</SelectItem>
              <SelectItem value="User Authentication">User Authentication</SelectItem>
              <SelectItem value="Data Visualization">Data Visualization</SelectItem>
              <SelectItem value="File Upload">File Upload</SelectItem>
              <SelectItem value="Search Feature">Search Feature</SelectItem>
            </SelectContent>
          </Select>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Cog className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-0">
        <ScrollArea className="flex-1 pl-4 pr-3 overflow-x-hidden">
          <div className="space-y-4 py-4 min-w-0">
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === "user" ? (
                  /* User messages - keep in bubbles, right-aligned */
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-primary text-primary-foreground">
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
                                <div className="flex items-center gap-2 text-xs opacity-90 p-2 bg-primary-foreground/20 rounded">
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
                ) : (
                  /* Assistant messages - full width, no bubble */
                  <div className="w-full space-y-2">
                    {/* Show file changes for assistant messages */}
                    {message.fileChanges && message.fileChanges.length > 0 && (
                      <div className="space-y-2 w-full max-w-full overflow-hidden">
                        {message.fileChanges.map((fileChange) => (
                          fileChange.id === "thinking" ? (
                            <TypingIndicator key={fileChange.id} />
                          ) : (
                            <FileChangeIndicator key={fileChange.id} fileChange={fileChange} />
                          )
                        ))}
                      </div>
                    )}

                    {/* Message content - no bubble styling */}
                    {message.content && (
                      <div className="text-sm text-foreground py-1">
                        {message.content}
                      </div>
                    )}
                  </div>
                )}
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
