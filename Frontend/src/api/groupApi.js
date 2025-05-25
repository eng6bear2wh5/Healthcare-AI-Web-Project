// api/groupApi.js
export const getAllGroups = async () => {
    const res = await fetch("/api/groups");
    return await res.json();
};

export const createGroup = async (group) => {
    const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(group),
    });
    return await res.json();
};
