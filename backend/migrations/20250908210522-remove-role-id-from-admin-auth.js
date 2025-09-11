'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('admin_auth', 'role_id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('admin_auth', 'role_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
  }
};
