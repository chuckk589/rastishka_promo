import { Menu } from '@grammyjs/menu';
import { InputFile, Keyboard } from 'grammy';
import { UserGender, Locale } from 'src/modules/mikroorm/entities/User';
import { BotStep } from 'src/types/enums';
import { BaseComposer, BotContext } from 'src/types/interfaces';
import { Command, ComposerController, On, Use } from '../common/decorators';
import { label } from '../common/helpers';
import { globalService } from './global.service';
import { Router } from '@grammyjs/router';
import { AppConfigService } from 'src/modules/app-config/app-config.service';
import { mainKeyboard } from '../common/keyboards';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import i18n from '../middleware/i18n';

@ComposerController
export class globalComposer extends BaseComposer {
  constructor(
    private readonly globalService: globalService,
    private readonly AppConfigService: AppConfigService,
    @InjectPinoLogger('globalComposer') private readonly logger: PinoLogger,
  ) {
    super();
  }

  @Use()
  menu = new Menu<BotContext>('reg-menu').dynamic((ctx, range) => {
    const locale = ctx.i18n.locale() as Locale;
    switch (ctx.session.step) {
      case BotStep.default: {
        Object.values(Locale).map((lang) =>
          range.text(label({ text: lang }), async (ctx) => {
            await this.globalService.updateUser(ctx.from.id, { locale: lang as Locale });
            ctx.i18n.locale(lang);
            ctx.session.step = BotStep.age;
            await ctx.editMessageText(ctx.i18n.t('start') + '\n\n' + ctx.i18n.t('askAge'));
          }),
        );
        break;
      }
      case BotStep.age: {
        range.text(label({ text: 'yes' }), async (ctx) => {
          ctx.session.step = BotStep.gender;
          await ctx.editMessageText(ctx.i18n.t('start') + '\n\n' + ctx.i18n.t('askGender'));
        });
        range.text(label({ text: 'no' }), async (ctx) => {
          ctx.session.step = BotStep.default;
          ctx.menu.close();
          await ctx.reply(ctx.i18n.t('restrictedAge'));
        });
        break;
      }

      case BotStep.gender: {
        Object.values(UserGender).map((gender) => {
          range.text(label({ text: gender }), async (ctx) => {
            ctx.session.step = BotStep.city;
            await this.globalService.updateUser(ctx.from.id, { gender: gender });
            await ctx.editMessageText(ctx.i18n.t('start') + '\n\n' + ctx.i18n.t('askCity'));
          });
        });
        break;
      }
      case BotStep.city: {
        this.AppConfigService.cities.map((city, index) => {
          range.text(label({ text: city.translation[locale] }), async (ctx) => {
            ctx.session.step = BotStep.promo;
            await this.globalService.updateCity(ctx.from.id, city.id);
            await ctx.editMessageText(ctx.i18n.t('start') + '\n\n' + ctx.i18n.t('askPromo'));
          }),
            index % 3 === 0 && range.row();
        });
        break;
      }
      case BotStep.promo: {
        this.AppConfigService.promos.map((promo, index) => {
          range.text(label({ text: promo.translation[locale] }), async (ctx) => {
            await this.globalService.updatePromo(ctx.from.id, promo.id);
            ctx.session.step = BotStep.name;
            ctx.menu.close();
            await ctx.editMessageText(ctx.i18n.t('start'));
            await ctx.reply(ctx.i18n.t('askName'));
          });
          index % 2 === 0 && range.row();
        });
        break;
      }
    }
    return range;
  });
  @Command('start')
  start = async (ctx: BotContext) => {
    ctx.session.step = BotStep.default;
    const user = await this.globalService.getUser(ctx);
    ctx.session.isRegistered = user.registered;
    ctx.i18n.locale(user.locale);
    if (ctx.session.isRegistered) {
      await ctx.reply(ctx.i18n.t('mainMenu'), { reply_markup: mainKeyboard(ctx) });
    } else {
      await ctx.replyWithMediaGroup([
        {
          type: 'photo',
          media: new InputFile('./dist/public/assets/start_ru.png'),
        },
        {
          type: 'photo',
          media: new InputFile('./dist/public/assets/start_uz.png'),
        },
      ]);
      await ctx.reply(i18n.t('ru', 'start') + '\n\n' + i18n.t('uz', 'start') + '\n\n' + ctx.i18n.t('chooseLang'), {
        reply_markup: this.menu,
      });
    }
  };
  @On(':contact')
  contact = async (ctx: BotContext) => {
    if (ctx.session.step == BotStep.phone) {
      await this.globalService.updateUser(ctx.from.id, { phone: ctx.message.contact.phone_number, registered: true });
      ctx.session.step = BotStep.default;
      ctx.session.isRegistered = true;
      await ctx.reply(ctx.i18n.t('registered'), { reply_markup: mainKeyboard(ctx) });
    }
  };

  @Use()
  router = new Router<BotContext>((ctx: BotContext) => ctx.session.step).route(
    BotStep.name,
    async (ctx: BotContext) => {
      await this.globalService.updateUser(ctx.from.id, { credentials: ctx.message.text });
      ctx.session.step = BotStep.phone;
      // await ctx.reply(ctx.i18n.t('askPhone'), {
      //   reply_markup: new Keyboard().requestContact(ctx.i18n.t('contact')),
      // });
      await ctx.replyWithPhoto(new InputFile(`./dist/public/assets/phone_${ctx.i18n.locale()}.png`), {
        reply_markup: new Keyboard().requestContact(ctx.i18n.t('contact')),
      });
    },
  );
}
