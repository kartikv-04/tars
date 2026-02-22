import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get or create a 1:1 conversation between two users
export const getOrCreateConversation = mutation({
    args: {
        participantId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        // Find current user
        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!currentUser) throw new Error("User not found");

        // Check if a conversation already exists between these two users
        const currentUserMemberships = await ctx.db
            .query("conversationMembers")
            .withIndex("by_userId", (q) => q.eq("userId", currentUser._id))
            .collect();

        for (const membership of currentUserMemberships) {
            const otherMembership = await ctx.db
                .query("conversationMembers")
                .withIndex("by_conversationId_userId", (q) =>
                    q.eq("conversationId", membership.conversationId).eq("userId", args.participantId)
                )
                .unique();

            if (otherMembership) {
                return membership.conversationId;
            }
        }

        // No existing conversation — create one
        const conversationId = await ctx.db.insert("conversations", {});

        // Add both members
        await ctx.db.insert("conversationMembers", {
            conversationId,
            userId: currentUser._id,
            lastReadTime: Date.now(),
        });

        await ctx.db.insert("conversationMembers", {
            conversationId,
            userId: args.participantId,
            lastReadTime: Date.now(),
        });

        return conversationId;
    },
});

// Get all conversations for the current user (with last message preview)
export const getMyConversations = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!currentUser) return [];

        const memberships = await ctx.db
            .query("conversationMembers")
            .withIndex("by_userId", (q) => q.eq("userId", currentUser._id))
            .collect();

        const conversations = await Promise.all(
            memberships.map(async (membership) => {
                const conversation = await ctx.db.get(membership.conversationId);
                if (!conversation) return null;

                // Get the other member
                const allMembers = await ctx.db
                    .query("conversationMembers")
                    .withIndex("by_conversationId", (q) =>
                        q.eq("conversationId", conversation._id)
                    )
                    .collect();

                const otherMembership = allMembers.find(
                    (m) => m.userId !== currentUser._id
                );
                const otherUser = otherMembership
                    ? await ctx.db.get(otherMembership.userId)
                    : null;

                // Get last message
                const lastMessage = conversation.lastMessageId
                    ? await ctx.db.get(conversation.lastMessageId)
                    : null;

                // Count unread messages
                const allMessages = await ctx.db
                    .query("messages")
                    .withIndex("by_conversationId", (q) =>
                        q.eq("conversationId", conversation._id)
                    )
                    .collect();

                const unreadCount = allMessages.filter(
                    (msg) =>
                        msg._creationTime > membership.lastReadTime &&
                        msg.senderId !== currentUser._id
                ).length;

                return {
                    _id: conversation._id,
                    otherUser,
                    lastMessage: lastMessage
                        ? { content: lastMessage.content, _creationTime: lastMessage._creationTime }
                        : null,
                    lastMessageTime: conversation.lastMessageTime,
                    lastReadTime: membership.lastReadTime,
                    unreadCount,
                };
            })
        );

        return conversations
            .filter(Boolean)
            .sort((a, b) => (b!.lastMessageTime ?? 0) - (a!.lastMessageTime ?? 0));
    },
});

// Mark a conversation as read
export const markAsRead = mutation({
    args: {
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
        if (!currentUser) throw new Error("User not found");

        const membership = await ctx.db
            .query("conversationMembers")
            .withIndex("by_conversationId_userId", (q) =>
                q.eq("conversationId", args.conversationId).eq("userId", currentUser._id)
            )
            .unique();

        if (membership) {
            await ctx.db.patch(membership._id, { lastReadTime: Date.now() });
        }
    },
});
