import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

    // Synced from Clerk on first login
    users: defineTable({
        clerkId: v.string(),
        name: v.string(),
        email: v.string(),
        imageUrl: v.optional(v.string()),
        isOnline: v.boolean(),
        lastSeen: v.number(),
    })
        .index("by_clerkId", ["clerkId"])
        .index("by_email", ["email"]),

    // 1:1 conversations only
    conversations: defineTable({
        lastMessageId: v.optional(v.id("messages")),
        lastMessageTime: v.optional(v.number()),
    }),

    // Join table: which users are in which conversation
    conversationMembers: defineTable({
        conversationId: v.id("conversations"),
        userId: v.id("users"),
        lastReadTime: v.number(),
    })
        .index("by_conversationId", ["conversationId"])
        .index("by_userId", ["userId"])
        .index("by_conversationId_userId", ["conversationId", "userId"]),

    // Messages
    messages: defineTable({
        conversationId: v.id("conversations"),
        senderId: v.id("users"),
        content: v.string(),
    })
        .index("by_conversationId", ["conversationId"]),

    // Typing indicators
    typingIndicators: defineTable({
        conversationId: v.id("conversations"),
        userId: v.id("users"),
        lastTypedAt: v.number(),
    })
        .index("by_conversationId", ["conversationId"])
        .index("by_conversationId_userId", ["conversationId", "userId"]),

});
