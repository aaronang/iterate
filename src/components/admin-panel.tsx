import { useState } from "react"
import { Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface FeatureFlags {
  enableNewChatUI: boolean
  enableAdvancedSearch: boolean
  enableBetaFeatures: boolean
  debugMode: boolean
}

export function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({
    enableNewChatUI: false,
    enableAdvancedSearch: true,
    enableBetaFeatures: false,
    debugMode: false,
  })

  const toggleFeatureFlag = (flag: keyof FeatureFlags) => {
    setFeatureFlags(prev => ({
      ...prev,
      [flag]: !prev[flag]
    }))
  }

  return (
    <>
      {/* Admin Panel Toggle Button - Fixed position */}
      <Button
        onClick={() => setIsOpen(true)}
        size="sm"
        variant="outline"
        className="fixed bottom-4 right-4 z-50 h-10 w-10 p-0 rounded-full shadow-lg"
        title="Admin Panel"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {/* Admin Panel Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <Card className="relative w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg">Admin Panel</CardTitle>
                <CardDescription>
                  Toggle feature flags and implementation settings
                </CardDescription>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Feature Flags Section */}
              <div>
                <h3 className="text-sm font-medium mb-3">Feature Flags</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-chat-ui" className="text-sm">
                      New Chat UI
                    </Label>
                    <Switch
                      id="new-chat-ui"
                      checked={featureFlags.enableNewChatUI}
                      onCheckedChange={() => toggleFeatureFlag('enableNewChatUI')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="advanced-search" className="text-sm">
                      Advanced Search
                    </Label>
                    <Switch
                      id="advanced-search"
                      checked={featureFlags.enableAdvancedSearch}
                      onCheckedChange={() => toggleFeatureFlag('enableAdvancedSearch')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="beta-features" className="text-sm">
                      Beta Features
                    </Label>
                    <Switch
                      id="beta-features"
                      checked={featureFlags.enableBetaFeatures}
                      onCheckedChange={() => toggleFeatureFlag('enableBetaFeatures')}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Debug Section */}
              <div>
                <h3 className="text-sm font-medium mb-3">Debug</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="debug-mode" className="text-sm">
                    Debug Mode
                  </Label>
                  <Switch
                    id="debug-mode"
                    checked={featureFlags.debugMode}
                    onCheckedChange={() => toggleFeatureFlag('debugMode')}
                  />
                </div>
              </div>

              <Separator />

              {/* Implementation Switches */}
              <div>
                <h3 className="text-sm font-medium mb-3">Implementation</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>• Chat UI: {featureFlags.enableNewChatUI ? 'New' : 'Legacy'}</p>
                  <p>• Search: {featureFlags.enableAdvancedSearch ? 'Advanced' : 'Basic'}</p>
                  <p>• Debug: {featureFlags.debugMode ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
