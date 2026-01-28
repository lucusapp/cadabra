import { useState } from "react"

export function useAuth() {
  const [user, setUser] = useState(null)

  const login = () => setUser({ name: "Demo" })
  const logout = () => setUser(null)

  return { user, login, logout }
}
