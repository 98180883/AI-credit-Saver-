[UI Trigger: Analyze Click]
         │
         ▼
 ┌───────────────┐
 │ Input Check   │ ──(Fails)──► [Alert: Validation Error Notification]
 └───────────────┘
         │ (Passes)
         ▼
 ┌───────────────┐
 │ audit.js      │ ◄─────────── [compares differnt AI plans and generates recommendations , this is the core logic of the app ]
 └───────────────┘
         │
         ▼
 ┌───────────────┐
 │ UI State Update│ ────────────► [UI Update: Display Recommendations and Savings and Charts]
 └───────────────┘
         │
         ▼
 ┌───────────────┐
 │ Fetch Payload │ ────────────► [API Call: Groq API for AI-generated summary and insights if failed then fallback to static summary]
 └───────────────┘

 ## Detailed architecture could not de made due to time constraint . but the above flow diagram gives a basic idea of how the app works and how different components interact with each other .