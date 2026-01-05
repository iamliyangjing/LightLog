
export enum EntryType {
  DIET = 'DIET',
  WORKOUT = 'WORKOUT'
}

// Equivalent to FoodEntry / ExerciseEntry in the SwiftData model
export interface LogEntry {
  id: string;
  name: string;
  calories: number;
  type: EntryType;
  timestamp: Date;
  duration?: number; // Optional duration in minutes
}

// Daily stats derived from entries, mirroring a DailyLog model
export interface DailyLog {
  date: string; // YYYY-MM-DD
  targetCalories: number;
  entries: LogEntry[];
}
