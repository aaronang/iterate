export interface FileChange {
  id: string
  filename: string
  action: "creating" | "modifying" | "deleting"
  changes: string[]
  isLoading?: boolean
}

export interface ScenarioStep {
  fileChanges?: FileChange[]
  thinking?: string
}

export interface PrototypeScenario {
  steps: ScenarioStep[]
  summary: string
}

export const prototypeScenarios: PrototypeScenario[] = [
  // Simple single-step scenarios
  {
    steps: [
      {
        fileChanges: [
          {
            id: "1",
            filename: "src/components/ProductCard.tsx",
            action: "creating",
            changes: ["Creating product card component", "Adding image display", "Implementing price and title layout"],
            isLoading: true
          }
        ]
      }
    ],
    summary: "Perfect! I've created a product card component for your e-commerce prototype. It includes image display, pricing, and clean typography."
  },
  
  // Multi-step with thinking breaks
  {
    steps: [
      {
        fileChanges: [
          {
            id: "2",
            filename: "src/components/Dashboard.tsx",
            action: "creating",
            changes: ["Setting up dashboard layout", "Adding navigation sidebar", "Creating main content area"],
            isLoading: true
          }
        ]
      },
      {
        thinking: "Now I need to create metrics cards to display the key performance indicators..."
      },
      {
        fileChanges: [
          {
            id: "3",
            filename: "src/components/MetricsCard.tsx",
            action: "creating",
            changes: ["Building metrics display card", "Adding chart placeholder", "Implementing responsive design"],
            isLoading: true
          }
        ]
      },
      {
        thinking: "Let me add the styling to make this look professional with dark mode support..."
      },
      {
        fileChanges: [
          {
            id: "4",
            filename: "src/styles/dashboard.css",
            action: "creating",
            changes: ["Adding dashboard grid layout", "Styling metrics cards", "Implementing dark mode support"],
            isLoading: true
          }
        ]
      }
    ],
    summary: "Excellent! I've built a complete dashboard prototype with metrics cards, responsive layout, and dark mode support. The dashboard is ready for your analytics data."
  },

  // Complex prototype with multiple iterations
  {
    steps: [
      {
        fileChanges: [
          {
            id: "5",
            filename: "src/components/ChatInterface.tsx",
            action: "creating",
            changes: ["Creating chat interface layout", "Adding message bubbles", "Setting up input area"],
            isLoading: true
          }
        ]
      },
      {
        thinking: "I need to set up real-time communication with WebSocket for live messaging..."
      },
      {
        fileChanges: [
          {
            id: "6",
            filename: "src/hooks/useWebSocket.ts",
            action: "creating",
            changes: ["Implementing WebSocket connection", "Adding message handling", "Setting up reconnection logic"],
            isLoading: true
          }
        ]
      },
      {
        thinking: "Now I'll connect the WebSocket to the chat interface for real-time updates..."
      },
      {
        fileChanges: [
          {
            id: "7",
            filename: "src/components/ChatInterface.tsx",
            action: "modifying",
            changes: ["Connecting WebSocket hook", "Adding real-time message updates", "Implementing typing indicators"],
            isLoading: true
          }
        ]
      },
      {
        thinking: "Let me add an emoji picker to make the chat more engaging and fun..."
      },
      {
        fileChanges: [
          {
            id: "8",
            filename: "src/components/EmojiPicker.tsx",
            action: "creating",
            changes: ["Building emoji picker component", "Adding emoji categories", "Implementing search functionality"],
            isLoading: true
          }
        ]
      }
    ],
    summary: "Amazing! I've created a fully functional chat prototype with real-time messaging, WebSocket integration, typing indicators, and emoji support. Your chat app is ready for testing!"
  },

  // Mobile app prototype
  {
    steps: [
      {
        fileChanges: [
          {
            id: "9",
            filename: "src/components/MobileNav.tsx",
            action: "creating",
            changes: ["Creating mobile navigation", "Adding tab bar", "Implementing touch gestures"],
            isLoading: true
          }
        ]
      },
      {
        thinking: "Now I'll create the main screens that users will navigate to..."
      },
      {
        fileChanges: [
          {
            id: "10",
            filename: "src/screens/HomeScreen.tsx",
            action: "creating",
            changes: ["Building home screen layout", "Adding hero section", "Creating feature cards"],
            isLoading: true
          },
          {
            id: "11",
            filename: "src/screens/ProfileScreen.tsx",
            action: "creating",
            changes: ["Setting up profile screen", "Adding user avatar", "Creating settings menu"],
            isLoading: true
          }
        ]
      }
    ],
    summary: "Great! I've built a mobile app prototype with navigation, home screen, and profile functionality. The app is optimized for touch interactions and mobile viewports."
  },

  // Data visualization prototype
  {
    steps: [
      {
        fileChanges: [
          {
            id: "12",
            filename: "src/components/ChartContainer.tsx",
            action: "creating",
            changes: ["Creating chart container", "Setting up responsive wrapper", "Adding loading states"],
            isLoading: true
          }
        ]
      },
      {
        thinking: "I need to create data processing utilities to handle and transform the raw data..."
      },
      {
        fileChanges: [
          {
            id: "13",
            filename: "src/utils/dataProcessor.ts",
            action: "creating",
            changes: ["Building data processing utilities", "Adding aggregation functions", "Implementing data validation"],
            isLoading: true
          }
        ]
      },
      {
        thinking: "Now I'll build the actual chart components with interactive features..."
      },
      {
        fileChanges: [
          {
            id: "14",
            filename: "src/components/LineChart.tsx",
            action: "creating",
            changes: ["Implementing line chart component", "Adding interactive tooltips", "Creating zoom functionality"],
            isLoading: true
          },
          {
            id: "15",
            filename: "src/components/BarChart.tsx",
            action: "creating",
            changes: ["Building bar chart component", "Adding animations", "Implementing click handlers"],
            isLoading: true
          }
        ]
      }
    ],
    summary: "Perfect! I've created a comprehensive data visualization prototype with interactive charts, data processing utilities, and responsive design. Your analytics dashboard is ready to display real data."
  }
]
