export const loginUser = async (credentials: any) => {
    // USUARIO TEMPORAL - BYPASS PARA ENTREGABLE
    if (credentials.email === "emerio.lucero@galileo.edu") {
        return {
            user: { _id: "user-temporal-123", name: "Emerio Lucero", email: "emerio.lucero@galileo.edu" },
            token: "mock-token-temporal"
        };
    }

    const response = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Failed to fetch backend" }));
        throw new Error(error.message || "Failed to login");
    }
    return response.json();
};

export const registerUser = async (userData: any) => {
    // USUARIO TEMPORAL - BYPASS PARA ENTREGABLE
    if (userData.email === "emerio.lucero@galileo.edu") {
        return {
            user: { _id: "user-temporal-123", name: userData.name || "Emerio Lucero", email: "emerio.lucero@galileo.edu" },
            token: "mock-token-temporal"
        };
    }

    const response = await fetch("http://localhost:3001/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Failed to fetch backend" }));
        throw new Error(error.message || "Failed to register");
    }
    return response.json();
};

