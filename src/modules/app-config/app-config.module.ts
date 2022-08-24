import { EntityManager, MikroORM } from '@mikro-orm/core';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions, ConfigService } from '@nestjs/config';
import { Config } from 'src/modules/mikroorm/entities/Config';
import { TranslatableConfig } from 'src/types/interfaces';
import { City } from '../mikroorm/entities/City';
import { Promo } from '../mikroorm/entities/Promo';
import { AppConfigService } from './app-config.service';

@Global()
@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {
  constructor(private readonly em: EntityManager) {}
  public static async forRootAsync(options: ConfigModuleOptions = {}): Promise<DynamicModule> {
    const ConfigProvider: Provider = {
      provide: 'any',
      useFactory: async (orm: MikroORM) => {
        const configs = await orm.em.find(Config, {});
        configs.map((config) => (process.env[config.name] = config.value));
        const cities = await orm.em.find(City, {}, { populate: ['translation.values'] });
        Reflect.defineMetadata(
          'cities',
          cities.map((city) => new TranslatableConfig(city)),
          AppConfigService,
        );
        const promos = await orm.em.find(Promo, {}, { populate: ['translation.values'] });
        Reflect.defineMetadata(
          'promos',
          promos.map((promo) => new TranslatableConfig(promo)),
          AppConfigService,
        );
        return {};
      },
      inject: [MikroORM],
    };
    return {
      module: AppConfigModule,
      imports: [ConfigModule.forRoot()],
      providers: [ConfigProvider],
      exports: [ConfigModule],
    };
  }
}
