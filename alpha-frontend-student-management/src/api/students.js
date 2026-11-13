import apiClient from "./client"

export async function getAllStudents() {
    const students = []
    let page = 1
    let hasNextPage = true

    while (hasNextPage) {
        const response = await apiClient.get("/", {
            params: { page, limit: 100 },
        })
        students.push(...(response.data?.data ?? []))
        hasNextPage = Boolean(response.data?.meta?.hasNextPage)
        page += 1
    }

    return students
}
