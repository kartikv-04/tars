export default {
    providers: [
        {
            domain: process.env.CLERK_JWT_ISSUER_DOMAIN, // from Clerk dashboard
            applicationID: "convex",
        },
    ],
};
