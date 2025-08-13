export default (sequelize, DataTypes) => {
  const Language = sequelize.define(
    "Language",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(200), allowNull: false, unique: true }, 
      code: { type: DataTypes.STRING(25), allowNull: false, unique: true }
    },
    { tableName: "languages", timestamps: false }
  );

  return Language;
};
