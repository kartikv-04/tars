import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const upsertUser = mutation({
    args: {
        clerkId: v.string(),
        name: v.string(),
        email: v.string(),
        imageUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (existingUser) {
            // Update existing user
            await ctx.db.patch(existingUser._id, {
                name: args.name,
                email: args.email,
                imageUrl: args.imageUrl,
                isOnline: true,
                lastSeen: Date.now(),
            });
            return existingUser._id;
        }

        // Insert new user
        const newUserId = await ctx.db.insert("users", {
            clerkId: args.clerkId,
            name: args.name,
            email: args.email,
            imageUrl: args.imageUrl,
            isOnline: true,
            lastSeen: Date.now(),
        });

        return newUserId;
    },
});

export const getCurrentUser = query({
    args: { clerkId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (!args.clerkId) return null;

        return await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .unique();
    },
});
