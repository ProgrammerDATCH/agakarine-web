export interface Step {
    id: string
    content: string
    order: number
  }
  
  export interface Note {
    id: string
    title: string
    description?: string
    steps: Step[]
    tags: string[]
    category?: string
    userId: string
    createdAt: string
    updatedAt: string
  }