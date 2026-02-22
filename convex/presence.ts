import { mutation } from "./_generated/server";

// Set user online and update lastSeen
export const heartbeat = mutation({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return;

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (user) {
            await ctx.db.patch(user._id, {
                isOnline: true,
                lastSeen: Date.now(),
            });
        }
    },
});

// Set user offline
export const setOffline = mutation({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return;

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (user) {
            await ctx.db.patch(user._id, {
                isOnline: false,
                lastSeen: Date.now(),
            });
        }
    },
});
