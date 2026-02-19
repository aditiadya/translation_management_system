"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("admin_payment_methods", "is_default", {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    after: "active_flag",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("admin_payment_methods", "is_default");
}