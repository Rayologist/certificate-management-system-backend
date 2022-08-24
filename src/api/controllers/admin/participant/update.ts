import { Middleware } from "@koa/router";
import { UpdateParticipantPayload } from "types";
import { prisma } from "@models";

const handleUpdateParticipant: Middleware = async (ctx) => {
  const { id, ...rest } = ctx.request.body as UpdateParticipantPayload;
  await prisma.participant.update({ where: { id }, data: rest });
  ctx.status = 201;
  ctx.body = { status: "success" };
};

export default handleUpdateParticipant;
