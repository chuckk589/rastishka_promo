import { Keyboard } from 'grammy';
import { BotContext } from 'src/types/interfaces';
import i18n from '../middleware/i18n';

// keyboards
export const mainKeyboard = (ctx: BotContext): Keyboard => {
  return new Keyboard()
    .text(ctx.i18n.t('participate'))
    .text(ctx.i18n.t('rules'))
    .text(ctx.i18n.t('about'))
    .row()
    .text(ctx.i18n.t('myChecks'))
    .text(ctx.i18n.t('prizes'))
    .text(ctx.i18n.t('winners'))
    .row()
    .text(ctx.i18n.t('contacts'))
    .text(ctx.i18n.t('switchLanguage'));
};
