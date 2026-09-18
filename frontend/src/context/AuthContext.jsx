import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:8080/api";

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore login session when the application starts
  useEffect(() => {

    const savedUser =
      localStorage.getItem("agricloud_user");

    const token =
      localStorage.getItem("agricloud_token");

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("agricloud_user");
        localStorage.removeItem("agricloud_token");
      }
    }

    setLoading(false);

  }, []);

  // =========================
  // LOGIN
  // =========================

  const login = async (email, password, role) => {

    const response = await fetch(
      `${API_URL}/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email,
          password,
          role
        })
      }
    );

    let data;

    try {
      data = await response.json();
    } catch (error) {
      throw new Error(
        "Unable to connect to the backend"
      );
    }

    if (!response.ok) {

      throw new Error(
        data.message || "Login failed"
      );
    }

    // User information returned by Spring Boot
    const userData = {
      name: data.name,
      email: data.email,
      role: data.role
    };

    // Save JWT token
    localStorage.setItem(
      "agricloud_token",
      data.token
    );

    // Save user information
    localStorage.setItem(
      "agricloud_user",
      JSON.stringify(userData)
    );

    // Update React state
    setUser(userData);

    return userData;
  };

  // =========================
  // REGISTER
  // =========================

  const register = async (userData) => {

    const response = await fetch(
      `${API_URL}/auth/register`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(userData)
      }
    );

    let data;

    try {
      data = await response.json();
    } catch (error) {
      throw new Error(
        "Unable to connect to the backend"
      );
    }

    if (!response.ok) {

      throw new Error(
        data.message || "Registration failed"
      );
    }

    return data;
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {

    localStorage.removeItem(
      "agricloud_user"
    );

    localStorage.removeItem(
      "agricloud_token"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}