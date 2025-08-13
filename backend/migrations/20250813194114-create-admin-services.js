export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("admin_services", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: "admin_auth",
          key: "email",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      active_flag: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true, 
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("admin_services");
  },
};
