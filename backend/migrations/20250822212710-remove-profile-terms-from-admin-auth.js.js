"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.removeColumn("admin_auth", "setup_completed");
  await queryInterface.removeColumn("admin_auth", "terms_accepted");
  await queryInterface.removeColumn("admin_auth", "terms_accepted_at");
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.addColumn("admin_auth", "setup_completed", {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
  await queryInterface.addColumn("admin_auth", "terms_accepted", {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
  await queryInterface.addColumn("admin_auth", "terms_accepted_at", {
    type: Sequelize.DATE,
    allowNull: true,
  });
}
