export const fetchHabits = async (token: string) => {
    try {
        const response = await fetch("http://localhost:3000/habits", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch habits");
        }
        return await response.json();
    } catch (e) {
        return [];
    }
};

export const markAsDone = async (habitId: string, token: string) => {
    try {
        const response = await fetch(`http://localhost:3000/habits/markasdone/${habitId}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("Backend failed");
        }
        return await response.json();
    } catch (e) {
        throw e;
    }
};

export const createHabit = async (habitData: { title: string, description: string }, token: string) => {
    try {
        const response = await fetch("http://localhost:3000/habits", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(habitData)
        });
        
        if (!response.ok) {
            throw new Error("Backend failed");
        }
        return await response.json();
    } catch (e) {
        throw e;
    }
};
