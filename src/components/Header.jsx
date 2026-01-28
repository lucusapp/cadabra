import { useAuth } from "@/hooks/useAuth"
import Button from "@/components/ui/Button"


export default function Header() {
  const { user, login, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        <span className="font-bold">Cadabra</span>

        {user ? (
          <Button onClick={logout}>Salir</Button>
        ) : (
          <Button onClick={login}>Entrar</Button>
        )}
      </div>
    </header>
  )
}



