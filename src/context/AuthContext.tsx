import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";

type RolUsuario = "pasajero" | "conductor" | null;

type TipoContextoAutenticacion = {
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: RolUsuario;
  login: (rol: RolUsuario) => void;
  logout: () => void;
};

// Espacio para guardar la sesion del usuario en memoria
const ContextoAutenticacion = createContext<
  TipoContextoAutenticacion | undefined
>(undefined);

// Reparto la sesion a toda la app y la sincronizo con Supabase
export const AuthProvider = ({
  children: pantallasHijas,
}: {
  children: React.ReactNode;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<RolUsuario>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Reviso si ya hay una sesion guardada en el telefono al abrir la app
  useEffect(() => {
    const restaurarSesion = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const rol = (session.user.user_metadata?.rol as RolUsuario) || "pasajero";
          setIsAuthenticated(true);
          setUserRole(rol);
        }
      } catch {
        // Si falla la lectura dejo la sesion cerrada
      } finally {
        setIsLoading(false);
      }
    };

    restaurarSesion();

    // Escucho eventos de sesion en Supabase para mantenerla al dia
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const rol = (session.user.user_metadata?.rol as RolUsuario) || "pasajero";
          setIsAuthenticated(true);
          setUserRole(rol);
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback((rol: RolUsuario) => {
    setIsAuthenticated(true);
    setUserRole(rol);
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignoro si da error al desloguear
    }
    setIsAuthenticated(false);
    setUserRole(null);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, isLoading, userRole, login, logout }),
    [isAuthenticated, isLoading, userRole, login, logout]
  );

  return (
    <ContextoAutenticacion.Provider value={value}>
      {pantallasHijas}
    </ContextoAutenticacion.Provider>
  );
};

// Hook para acceder a la sesion en cualquier pantalla
export const useAuth = () => {
  const contexto = useContext(ContextoAutenticacion);

  if (!contexto) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  return contexto;
};
