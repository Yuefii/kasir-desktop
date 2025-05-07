function nestedValue<T = any>(obj: Record<string, any>, path: string): T | undefined {
  return path.split('.').reduce((acc: any, key: string) => (acc ? acc[key] : undefined), obj)
}

export default nestedValue
