import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// This isProtectedRoute function will be used to check if a route is protected or not
// The protected routes are the routes that are only accessible to signed in users
// If the user is not signed in, they will be redirected to the sign in page

// The createRouteMatcher function takes an array of regular expressions and returns a function that checks if a route is protected or not by matching the route against the regular expressions

// In this case, the protected routes are the routes that start with /dashboard, /transactions, and /transaction

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/transactions(.*)",
  "/transaction(.*)",
]);

// The clerkMiddleware function is a wrapper around the middleware function that is used to check if the user is signed in or not
const clerk = clerkMiddleware(async (auth, req) => {
  // The auth function is used to get the user id of the signed in user
  const { userId } = await auth();

  // If the user is not signed in and the route is protected, the user will be redirected to the sign in page
  if (!userId && isProtectedRoute(req)) {
    // The redirectToSignIn function is used to redirect the user to the sign in page
    const { redirectToSignIn } = await auth();

    return redirectToSignIn();
  }
});

export default clerk;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};