import { session as session_ } from 'grammy';
import { BotStep } from 'src/types/enums';
import { Session, BotContext } from 'src/types/interfaces';

const initial = (): Session => ({
  menuId: undefined,
  bulkId: undefined,
  step: BotStep.default,
  isRegistered: undefined,
  winners: [],
});

function getSessionKey(ctx: BotContext): string | undefined {
  return ctx.from?.id.toString();
}

export const session = session_({
  initial: initial,
  getSessionKey: getSessionKey,
});
