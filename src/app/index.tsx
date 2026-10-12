import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) return <Redirect href="/(auth)/bienvenida" />;
  return <Redirect href={userRole === "conductor" ? "/inicio" : "/mapa"} />;
}
