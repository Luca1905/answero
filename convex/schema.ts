import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  questions: defineTable({
    authorId: v.string(),
    title: v.string(),
    body: v.string(),
    tags: v.optional(v.array(v.string())),
    upvotes: v.number(),
    downvotes: v.number(),
    score: v.number(),
    views: v.number(),
    answerCount: v.number(),
  })
    .index("by_authorId", ["authorId"])
    .index("by_score", ["score"]),

  answers: defineTable({
    authorId: v.string(),
    questionId: v.id("questions"),
    body: v.string(),
    upvotes: v.number(),
    downvotes: v.number(),
    score: v.number(),
    isAccepted: v.optional(v.boolean()),
  })
    .index("by_questionId", ["questionId"])
    .index("by_authorId", ["authorId"])
    .index("by_score", ["score"]),
});
