export interface AiLocatorSuggestion {
    method: "role" | "text" | "testId" | "label";
    role?: string; // solo si method === "role", ej. "button"
    name?: string; // solo si method === "role", nombre accesible
    value?: string; // usado por "text" | "testId" | "label"
  }