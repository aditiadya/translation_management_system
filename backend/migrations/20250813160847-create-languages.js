export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("languages", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(200), allowNull: false, unique: true },
      code: { type: Sequelize.STRING(25), allowNull: false, unique: true },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("languages");
  },
};
