import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from "./shared/errors";

export const createAnswer = mutation({
  args: {
    questionId: v.id("questions"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new AuthenticationError();
    }

    const question = await ctx.db.get(args.questionId);
    if (!question) {
      return new NotFoundError();
    }

    const answerId = await ctx.db.insert("answers", {
      authorId: identity.subject,
      questionId: args.questionId,
      body: args.body,
      upvotes: 0,
      downvotes: 0,
      score: 0,
      isAccepted: false,
    });

    await ctx.db.patch(args.questionId, {
      answerCount: question.answerCount + 1,
    });

    return answerId;
  },
});

export const getAnswers = query({
  args: { questionId: v.id("questions") },
  handler: async (ctx, args) => {
    const answers = await ctx.db
      .query("answers")
      .withIndex("by_questionId", (q) => q.eq("questionId", args.questionId))
      .order("desc")
      .collect();
    return answers;
  },
});

export const updateAnswer = mutation({
  args: {
    answerId: v.id("answers"),
    body: v.string(),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new AuthenticationError();
    }
    const answer = await ctx.db.get(args.answerId);
    if (!answer) {
      return new NotFoundError();
    }
    if (answer.authorId !== identity.subject) {
      return new AuthorizationError();
    }
    await ctx.db.patch(args.answerId, {
      body: args.body,
    });

    return args.answerId;
  },
});

export const deleteAnswer = mutation({
  args: {
    answerId: v.id("answers"),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new AuthenticationError();
    }
    const answer = await ctx.db.get(args.answerId);
    if (!answer) {
      throw new NotFoundError();
    }
    if (answer.authorId !== identity.subject) {
      throw new AuthorizationError();
    }
    await ctx.db.delete(args.answerId);

    return args.answerId;
  },
});
