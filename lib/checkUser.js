import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma";

export const checkUser = async () => {
    const user = await currentUser(); // Get the current logged-in user

    if (!user) {
        return null; // Return null if no user is found
    }

    try {
        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id, // Find user by Clerk ID
            },
        });

        if (loggedInUser) {
            return loggedInUser; // Return existing user if found
        }

        const name = `${user.firstName} ${user.lastName}`; // Construct full name

        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name,
                imageUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddress, // Store user's email
            },
        });

        return newUser; // Return newly created user
    } catch (error) {
        console.log(error.message); // Log errors if any
    }
}
