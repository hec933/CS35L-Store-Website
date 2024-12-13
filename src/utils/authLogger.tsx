//keep log of logins!
export function logAuth(userId: string, name: string, email: string) {
    const timestamp = new Date().toISOString();
    console.log(`Login for user ID ${userId} with ${name} and ${email} at ${timestamp}`);
}