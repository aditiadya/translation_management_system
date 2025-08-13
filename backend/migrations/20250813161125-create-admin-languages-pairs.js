export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('admin_language_pairs', {
      id: { 
        type: Sequelize.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
      },
      email: { 
        type: Sequelize.STRING(255), 
        allowNull: false,
        references: { model: 'admin_auth', key: 'email' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      source_language_id: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: { model: 'languages', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      target_language_id: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: { model: 'languages', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      active_flag: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('admin_language_pairs');
  }
};
