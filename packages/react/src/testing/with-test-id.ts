export function withTestId(id?: string | null): Record<string, string> {
  return id ? { 'data-test-id': id } : {}
}