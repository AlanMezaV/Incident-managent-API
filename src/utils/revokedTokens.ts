export const revokedTokens: string[] = [];

// Función para agregar un token a la lista de revocación
export const revokeToken = (token: string) => {
    revokedTokens.push(token);
};

// Función para verificar si un token está revocado
export const isTokenRevoked = (token: string): boolean => {
    return revokedTokens.includes(token);
};
