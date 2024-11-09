export const load = async ({ fetch }) => {
    const response = await fetch(`/api/snippets`)
    const posts = await response.json()
    return {
        posts
    }
}
