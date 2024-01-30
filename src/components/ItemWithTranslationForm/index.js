import CommonForm from 'Components/CommonForm';

export default class ItemWithTranslationForm extends CommonForm {
  updateMethod = 'put';
  validators = {
    translationName: ({ default_language_id }) => {
      const { translations } = this.state;
      const res = translations.reduce((res, { translation, language, }) => {
        if (language.id === default_language_id && !translation.name.length) {
          res[default_language_id] = 'Name of default value should not be blank';
        };
        return res;
      }, {});
      return !!Object.values(res).length ? res : null;
    }
  };

  changeTranslationKey = (translationId, key, val) => {
    const { translations } = this.state;
    const translationIndex = translations.findIndex(({ translation }) => translation.language_id === translationId);
    if (translationIndex === -1) {
      return;
    }
    const changedTranslation = {
      ...translations[translationIndex],
      translation: { ...translations[translationIndex].translation, [key]: val, },
    };
    this.setState({
      translations: [].concat(
        translations.slice(0, translationIndex),
        changedTranslation,
        translations.slice(translationIndex + 1)
      )
    });
  }

  handleChangeDefaultLanguageId = ({ target }) => this.changeValue('default_language_id', Number(target.value));

  handleChangeTranslationName = (translationId, name) => this.changeTranslationKey(translationId, 'name', name);

  get serializedItem() {
    const { translations, item, } = this.state;
    return {
      ...item,
      translations_attributes: translations.map(({ translation, language }) => { return { ...translation, language } }),
    };
  }

}
