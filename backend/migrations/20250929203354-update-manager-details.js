'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.removeColumn('manager_details', 'client_pool');

  await queryInterface.addColumn('manager_details', 'client_pool_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'client_pools',
      key: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeIndex('manager_details', ['client_pool_id']);
  await queryInterface.removeColumn('manager_details', 'client_pool_id');

  await queryInterface.addColumn('manager_details', 'client_pool', {
    type: Sequelize.STRING,
    allowNull: true,
  });
}