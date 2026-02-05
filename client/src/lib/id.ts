/**
 * Generate a unique ID for client-side entities (nodes, blocks, tasks, etc.)
 * Uses crypto.randomUUID() for proper uniqueness guarantees.
 */
export function generateId(): string {
  return crypto.randomUUID();
}
