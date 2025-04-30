import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from "./shared/errors";

export const createQuestion = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new AuthenticationError();
    }
    const questionId = await ctx.db.insert("questions", {
      authorId: identity.subject,
      title: args.title,
      body: args.body,
      tags: args.tags,
      upvotes: 0,
      downvotes: 0,
      score: 0,
      views: 0,
      answerCount: 0,
    });

    return questionId;
  },
});

export const getQuestion = query({
  args: { questionId: v.id("questions") },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.questionId);
    if (!question) {
      throw new NotFoundError();
    }

    return question;
  },
});

export const listQuestions = query({
  args: {},
  handler: async (ctx) => {
    const questions = await ctx.db.query("questions").order("desc").take(20);

    return questions;
  },
});

export const updateQuestion = mutation({
  args: {
    questionId: v.id("questions"),
    title: v.optional(v.string()),
    body: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new AuthenticationError();
    }
    const question = await ctx.db.get(args.questionId);
    if (!question) {
      throw new NotFoundError();
    }
    if (question.authorId !== identity.subject) {
      throw new AuthorizationError();
    }
    await ctx.db.patch(args.questionId, {
      title: args.title,
      body: args.body,
      tags: args.tags,
    });

    return args.questionId;
  },
});

export const deleteQuestion = mutation({
  args: {
    questionId: v.id("questions"),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new AuthenticationError();
    }
    const question = await ctx.db.get(args.questionId);
    if (!question) {
      throw new NotFoundError();
    }
    if (question.authorId !== identity.subject) {
      throw new AuthorizationError();
    }
    await ctx.db.delete(args.questionId);

    return args.questionId;
  },
});
