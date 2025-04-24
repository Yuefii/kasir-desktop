export const buildInsertQuery = (table: string, data: Record<string, any>) => {
  const columns = Object.keys(data).join(', ')
  const placeholders = Object.keys(data)
    .map(() => '?')
    .join(', ')
  return `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`
}

export const buildUpdateQuery = (table: string, data: Record<string, any>, where: string) => {
  const setClause = Object.keys(data)
    .map((key) => `${key} = ?`)
    .join(', ')
  return `UPDATE ${table} SET ${setClause} WHERE ${where}`
}
