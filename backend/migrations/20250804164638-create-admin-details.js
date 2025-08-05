export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('admin_details', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'admin_auth',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      account_type: {
        type: Sequelize.ENUM('enterprise', 'freelance'),
        allowNull: false
      },
      company_name: {
        type: Sequelize.STRING(128),
        allowNull: false
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      time_zone: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      username: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(32),
        allowNull: false
      }
      // add timestamps here if needed
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('admin_details');
  }
};
