export const loginUser = async (credentials: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: credentials.email || credentials.username,
            password: credentials.password
        }),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Failed to fetch backend" }));
        throw new Error(error.error || error.message || "Failed to login");
    }
    return response.json();
};

export const registerUser = async (userData: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: userData.email || userData.username,
            password: userData.password
        }),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Failed to fetch backend" }));
        throw new Error(error.error || error.message || "Failed to register");
    }
    return response.json();
};

