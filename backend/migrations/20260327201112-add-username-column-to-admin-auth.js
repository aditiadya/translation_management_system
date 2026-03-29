'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('admin_auth', 'username', {
      type: Sequelize.STRING(64),
      allowNull: true,
      unique: true,
    });

    await queryInterface.removeColumn('admin_details', 'username');

    await queryInterface.removeColumn('vendor_primary_user_details', 'username');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('admin_details', 'username', {
      type: Sequelize.STRING(64),
      allowNull: true,
      unique: true,
    });

    await queryInterface.addColumn('vendor_primary_user_details', 'username', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    await queryInterface.removeColumn('admin_auth', 'username');
  },
};