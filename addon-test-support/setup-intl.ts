import addTranslations from './add-translations';
import { missingMessage } from './-private/serialize-translation';
import type { TestContext as BaseTestContext } from 'ember-test-helpers';
import type IntlService from 'pilas-bloques-ember-intl/services/intl';
import type { TOptions } from 'pilas-bloques-ember-intl/services/intl';
import type { Translations } from 'pilas-bloques-ember-intl/-private/store/translation';

export interface IntlTestContext {
  intl: IntlService;
}

export interface TestContext extends IntlTestContext, BaseTestContext {}

export interface SetupIntlOptions {
  /**
   * Whether to install the special `missing-message` handler.
   *
   * @defaultValue true
   */
  missingMessage?: boolean | ((key: string, locales: string[], options: TOptions) => string);

  formats?: IntlService['formats'];
}

/**
 * Calling this helper will install a special `missing-message` util that will
 * serialize all missing translations in a deterministic manner, including
 * variables you've passed for interpolation. This means that you do not have
 * to explicitly add any translations and can just rely on the implicit
 * serialization. See the docs for detailed examples.
 *
 * Besides the `hooks` object you can also pass a `locale` string or array to
 * set the locale, as well as an object of `translations`, if you do want to
 * bootstrap translations. Both arguments are optional.
 *
 * @param {object} hooks
 * @param {string} [localeOrTranslations]
 * @param {object} [translations]
 * @param {object} [options]
 */
export default function setupIntl(
  hooks: NestedHooks,
  locale: string | string[],
  translations?: Translations,
  options?: SetupIntlOptions
): void;
export default function setupIntl(hooks: NestedHooks, translations?: Translations, options?: SetupIntlOptions): void;
export default function setupIntl(
  hooks: NestedHooks,
  localeOrTranslations?: string | string[] | Translations,
  translationsOrOptions?: Translations | SetupIntlOptions,
  options?: SetupIntlOptions
) {
  let locale: string | string[] | undefined;
  let translations: Translations | undefined;
  if (typeof localeOrTranslations === 'object' && !Array.isArray(localeOrTranslations)) {
    translations = localeOrTranslations;
    localeOrTranslations = undefined;
    if (typeof translationsOrOptions === 'object') {
      options = translationsOrOptions;
    }
  } else {
    locale = localeOrTranslations;
    translations = translationsOrOptions as Translations | undefined;
  }

  hooks.beforeEach(function (this: TestContext) {
    if (typeof options?.missingMessage === 'function') {
      this.owner.register('util:intl/missing-message', options.missingMessage);
    } else if ((options?.missingMessage ?? true) === true) {
      this.owner.register('util:intl/missing-message', missingMessage);
    }

    this.intl = this.owner.lookup('service:intl');

    if (options?.formats) {
      this.intl.set('formats', options.formats);
    }
  });

  if (locale) {
    hooks.beforeEach(function (this: TestContext) {
      this.intl.setLocale(locale!);
    });
  }

  if (translations) {
    hooks.beforeEach(() => addTranslations(translations!));
  }
}
