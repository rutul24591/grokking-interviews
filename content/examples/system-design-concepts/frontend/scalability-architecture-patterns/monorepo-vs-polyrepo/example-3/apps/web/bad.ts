// Intentional example of a boundary violation:
// app-to-app imports create tight coupling and break deploy independence.
import { internal } from "../api/internal";

export const value = internal;

