import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Translation } from '../entities/Translation';
import { TranslationValue } from '../entities/TranslationValue';
import { Locale } from '../entities/User';

export class TranslationValueSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const promo_1 = await em.findOneOrFail(Translation, { name: 'PROMO_1' });
    const promo_2 = await em.findOneOrFail(Translation, { name: 'PROMO_2' });
    const promo_3 = await em.findOneOrFail(Translation, { name: 'PROMO_3' });
    const promo_4 = await em.findOneOrFail(Translation, { name: 'PROMO_4' });

    em.create(TranslationValue, { value: 'Социальные сети (инстаграм)', code: Locale.RU, translation: promo_1.id });
    em.create(TranslationValue, { value: 'Ijtimoiy tarmoqlar (instagram)', code: Locale.UZ, translation: promo_1.id });

    em.create(TranslationValue, { value: 'В магазине', code: Locale.RU, translation: promo_2.id });
    em.create(TranslationValue, { value: 'Magazinda', code: Locale.UZ, translation: promo_2.id });

    em.create(TranslationValue, { value: 'Рекламный материал', code: Locale.RU, translation: promo_3.id });
    em.create(TranslationValue, { value: 'Reklama materiallari', code: Locale.UZ, translation: promo_3.id });

    em.create(TranslationValue, { value: 'От продавца в магазине', code: Locale.RU, translation: promo_4.id });
    em.create(TranslationValue, { value: "Ro'yxatdan tanlash ", code: Locale.UZ, translation: promo_4.id });

    const city_1 = await em.findOneOrFail(Translation, { name: 'CITY_1' });
    const city_2 = await em.findOneOrFail(Translation, { name: 'CITY_2' });
    const city_3 = await em.findOneOrFail(Translation, { name: 'CITY_3' });
    const city_4 = await em.findOneOrFail(Translation, { name: 'CITY_4' });
    const city_5 = await em.findOneOrFail(Translation, { name: 'CITY_5' });
    const city_6 = await em.findOneOrFail(Translation, { name: 'CITY_6' });
    const city_7 = await em.findOneOrFail(Translation, { name: 'CITY_7' });
    const city_8 = await em.findOneOrFail(Translation, { name: 'CITY_8' });
    const city_9 = await em.findOneOrFail(Translation, { name: 'CITY_9' });

    em.create(TranslationValue, { value: 'Джизакская обл.', code: Locale.RU, translation: city_1.id });
    em.create(TranslationValue, { value: 'JIZZAX VILOYATI', code: Locale.UZ, translation: city_1.id });

    em.create(TranslationValue, { value: 'Ферганская обл.', code: Locale.RU, translation: city_2.id });
    em.create(TranslationValue, { value: 'FARG‘ONA VILOYATI', code: Locale.UZ, translation: city_2.id });

    em.create(TranslationValue, { value: 'Самаркандская обл.', code: Locale.RU, translation: city_3.id });
    em.create(TranslationValue, { value: 'SAMARQAND VILOYATI', code: Locale.UZ, translation: city_3.id });

    em.create(TranslationValue, { value: 'Кашкадарьинская обл.', code: Locale.RU, translation: city_4.id });
    em.create(TranslationValue, { value: 'Кашкадарьинская обл. - ПЕРЕВОД', code: Locale.UZ, translation: city_4.id });

    em.create(TranslationValue, { value: 'Респ. Каракалпакстан', code: Locale.RU, translation: city_5.id });
    em.create(TranslationValue, { value: 'Респ. Каракалпакстан - ПЕРЕВОД', code: Locale.UZ, translation: city_5.id });

    em.create(TranslationValue, { value: 'Ташкент', code: Locale.RU, translation: city_6.id });
    em.create(TranslationValue, { value: 'TOSHKENT SHAHRI', code: Locale.UZ, translation: city_6.id });

    em.create(TranslationValue, { value: 'Ташкентская обл.', code: Locale.RU, translation: city_7.id });
    em.create(TranslationValue, { value: 'TOSHKENT VILOYATI', code: Locale.UZ, translation: city_7.id });

    em.create(TranslationValue, { value: 'Андижанская обл.', code: Locale.RU, translation: city_8.id });
    em.create(TranslationValue, { value: 'ANDIJON VILOYATI', code: Locale.UZ, translation: city_8.id });

    em.create(TranslationValue, { value: 'Бухарская обл.', code: Locale.RU, translation: city_9.id });
    em.create(TranslationValue, { value: 'BUXORO VILOYATI', code: Locale.UZ, translation: city_9.id });

    const reject_1 = await em.findOneOrFail(Translation, { name: 'REJECT_REASON_1' }); //ранее загружен
    const reject_2 = await em.findOneOrFail(Translation, { name: 'REJECT_REASON_2' }); //отсутствует продукция
    const reject_3 = await em.findOneOrFail(Translation, { name: 'REJECT_REASON_3' }); // не чек
    const reject_4 = await em.findOneOrFail(Translation, { name: 'REJECT_REASON_4' }); // четко отображаться
    const reject_5 = await em.findOneOrFail(Translation, { name: 'REJECT_REASON_5' }); // чеки только из сети
    const approved = await em.findOneOrFail(Translation, { name: 'STATUS_APPROVED' });
    const rejected = await em.findOneOrFail(Translation, { name: 'STATUS_REJECTED' });
    const moderated = await em.findOneOrFail(Translation, { name: 'STATUS_MODERATED' });

    em.create(TranslationValue, { value: 'На модерации', code: Locale.RU, translation: moderated.id });
    em.create(TranslationValue, { value: "Moderatsiyadan o'tmoqda", code: Locale.UZ, translation: moderated.id });

    em.create(TranslationValue, { value: 'Отклонен', code: Locale.RU, translation: rejected.id });
    em.create(TranslationValue, { value: 'Rad etildi', code: Locale.UZ, translation: rejected.id });

    em.create(TranslationValue, { value: 'Подтвержден', code: Locale.RU, translation: approved.id });
    em.create(TranslationValue, { value: "Qa'bul qilindi", code: Locale.UZ, translation: approved.id });

    em.create(TranslationValue, { value: 'Ранее загружен', code: Locale.RU, translation: reject_1.id });
    em.create(TranslationValue, { value: 'REJECT_REASON_1_UZ', code: Locale.UZ, translation: reject_1.id });

    em.create(TranslationValue, { value: 'Отсутствует SKU', code: Locale.RU, translation: reject_2.id });
    em.create(TranslationValue, { value: 'REJECT_REASON_2_UZ', code: Locale.UZ, translation: reject_2.id });

    em.create(TranslationValue, { value: 'Не чек', code: Locale.RU, translation: reject_3.id });
    em.create(TranslationValue, { value: 'REJECT_REASON_3_UZ', code: Locale.UZ, translation: reject_3.id });

    em.create(TranslationValue, { value: 'Загрузился не полностью', code: Locale.RU, translation: reject_4.id });
    em.create(TranslationValue, { value: 'Загрузился не полностью', code: Locale.UZ, translation: reject_4.id });

    em.create(TranslationValue, { value: 'Чек не из сети Корзинка', code: Locale.RU, translation: reject_5.id });
    em.create(TranslationValue, { value: 'Чек не из сети Корзинка', code: Locale.UZ, translation: reject_5.id });

    const lottery_status_1 = await em.findOneOrFail(Translation, { name: 'LOTTERY_ENDED' });
    const lottery_status_2 = await em.findOneOrFail(Translation, { name: 'LOTTERY_PENDING' });

    em.create(TranslationValue, { value: 'Ожидание', code: Locale.RU, translation: lottery_status_2.id });
    em.create(TranslationValue, { value: 'LOTTERY_PENDING_UZ', code: Locale.UZ, translation: lottery_status_2.id });

    em.create(TranslationValue, { value: 'Проведена', code: Locale.RU, translation: lottery_status_1.id });
    em.create(TranslationValue, { value: 'LOTTERY_ENDED_UZ', code: Locale.UZ, translation: lottery_status_1.id });

    const prize_1 = await em.findOneOrFail(Translation, { name: 'PRIZE_WEEKLY' });
    const prize_2 = await em.findOneOrFail(Translation, { name: 'PRIZE_MAIN' });

    em.create(TranslationValue, { value: 'Еженедельный приз', code: Locale.RU, translation: prize_1.id });
    em.create(TranslationValue, { value: 'Haftalik sovrin', code: Locale.UZ, translation: prize_1.id });

    em.create(TranslationValue, { value: 'Главный приз', code: Locale.RU, translation: prize_2.id });
    em.create(TranslationValue, { value: 'Asosiy sovrin', code: Locale.UZ, translation: prize_2.id });
  }
}
