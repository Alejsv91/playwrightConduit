export interface AiLocatorSuggestion {
    method: "role" | "text" | "testId" | "label";
    role?: string; 
    name?: string; 
    value?: string; 
  }