import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { City } from '../entities/City';
import { Prize } from '../entities/Prize';
import { Translation } from '../entities/Translation';

export class CitySeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const city_1 = await em.findOneOrFail(Translation, { name: 'CITY_1' });
    const city_2 = await em.findOneOrFail(Translation, { name: 'CITY_2' });
    const city_3 = await em.findOneOrFail(Translation, { name: 'CITY_3' });
    const city_4 = await em.findOneOrFail(Translation, { name: 'CITY_4' });
    const city_5 = await em.findOneOrFail(Translation, { name: 'CITY_5' });
    const city_6 = await em.findOneOrFail(Translation, { name: 'CITY_6' });
    const city_7 = await em.findOneOrFail(Translation, { name: 'CITY_7' });
    const city_8 = await em.findOneOrFail(Translation, { name: 'CITY_8' });
    const city_9 = await em.findOneOrFail(Translation, { name: 'CITY_9' });
    em.create(City, { name: 'CITY_1', translation: city_1 });
    em.create(City, { name: 'CITY_2', translation: city_2 });
    em.create(City, { name: 'CITY_3', translation: city_3 });
    em.create(City, { name: 'CITY_4', translation: city_4 });
    em.create(City, { name: 'CITY_5', translation: city_5 });
    em.create(City, { name: 'CITY_6', translation: city_6 });
    em.create(City, { name: 'CITY_7', translation: city_7 });
    em.create(City, { name: 'CITY_8', translation: city_8 });
    em.create(City, { name: 'CITY_9', translation: city_9 });
  }
}
