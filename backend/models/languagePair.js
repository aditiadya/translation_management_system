export default (sequelize, DataTypes) => {
  const LanguagePair = sequelize.define('LanguagePair', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    source_language: { type: DataTypes.STRING(10), allowNull: false },
    target_language: { type: DataTypes.STRING(10), allowNull: false }
  }, { tableName: 'language_pairs', timestamps: false });

  LanguagePair.removeAttribute('id'); // if you want composite unique primary key, else keep id

  return LanguagePair;
};
