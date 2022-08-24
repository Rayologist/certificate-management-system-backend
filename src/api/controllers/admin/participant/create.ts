import { Middleware } from "@koa/router";
import { prisma } from "@models";
import { CreateParticipantPayload } from "types";

const handleCreateParticipant: Middleware = async (ctx) => {
  const payload = ctx.request.body as { data: CreateParticipantPayload[] };
  await prisma.participant.createMany({ data: payload.data });
  ctx.status = 201;
  ctx.body = { status: "success" };
};

export default handleCreateParticipant;
