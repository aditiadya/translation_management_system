export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("currencies", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(25),
        allowNull: false,
        unique: true,
      },
      symbol: {
        type: Sequelize.STRING(10),
        allowNull: false,
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("currencies");
  },
};
