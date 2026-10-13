import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  // Espero a que termine de revisar la sesion guardada antes de redirigir
  if (isLoading) return null;

  if (!isAuthenticated) return <Redirect href="/(auth)/bienvenida" />;
  return <Redirect href={userRole === "conductor" ? "/inicio" : "/mapa"} />;
}
