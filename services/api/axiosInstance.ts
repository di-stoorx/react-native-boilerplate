import { BASE_URL } from "@/helpers/apiHelpers";
import {
  getGlobalRefreshToken,
  getGlobalToken,
  setGlobalRefreshTokenSync,
  setGlobalTokenSync,
} from "@/services/authTokenManager";
import {
  saveRefreshToken,
  saveToken,
} from "@/services/storage/asyncStorageService";
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";

// ✅ Création de l'instance
const api = axios.create({
  baseURL: BASE_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];
let logoutHandler: (() => void) | null = null;

// ✅ Fonction pour gérer la file d’attente de requêtes pendant le refresh
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ✅ Injection du logout React (depuis le AuthContext)
export const setLogoutHandler = (fn: () => void) => {
  logoutHandler = fn;
};

// ✅ Intercepteur de requête → Ajout du token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getGlobalToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ✅ Intercepteur de réponse → Gestion du refresh token
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // console.error("[Axios] Error:", error?.response?.status, error.config?.url);

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // ⚠️ Si 401, on tente le refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      console.warn("[Token] 401 détecté – tentative de refresh...");

      if (isRefreshing) {
        console.log("[Token] Refresh déjà en cours – en attente...");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axios(originalRequest);
            }
            return Promise.reject(new Error('No original request'));
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getGlobalRefreshToken();
        if (!refreshToken) {
          console.error("[Token] Aucun refresh token disponible !");
          throw new Error("No refresh token");
        }

        console.log("[Token] Envoi du refresh token...");  
        const res = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        if (!res.data?.accessToken) {
          console.error("[Token] Réponse de refresh invalide:", res.data);
          throw new Error("Invalid refresh response");
        }

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        // Use sync versions to avoid async issues in interceptor
        setGlobalTokenSync(newAccessToken);
        setGlobalRefreshTokenSync(newRefreshToken);
        
        // Persist to storage using the legacy functions (for now)
        await saveToken(newAccessToken);
        await saveRefreshToken(newRefreshToken);

        processQueue(null, newAccessToken);
        isRefreshing = false;

        if (originalRequest) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          console.log("[Token] Refresh réussi, relance de la requête originale");

          return axios(originalRequest);
        }
        return Promise.reject(new Error('No original request'));
      } catch (err: any) {
        console.error("[Token] Échec du refresh:", err.message);
        processQueue(err, null);
        isRefreshing = false;

        if (logoutHandler) {
          console.log("[Token] Appel du logout handler React...");
          logoutHandler();
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
