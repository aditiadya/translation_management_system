"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("Languages", null, {});
}

export async function down(queryInterface, Sequelize) {
  return Promise.resolve();
}
