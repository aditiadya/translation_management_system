"use strict";

import { all } from "locale-codes";

export async function up(queryInterface, Sequelize) {
  const seenCodes = new Set();
  const seenNames = new Set();

  const inserts = all
    .filter(locale => locale.tag && locale.location && locale.name)
    .map(locale => ({
      name: `${locale.name} - ${locale.location}`,
      code: locale.tag,
    }))
    .filter(entry => {
      if (seenCodes.has(entry.code) || seenNames.has(entry.name)) {
        return false; 
      }
      seenCodes.add(entry.code);
      seenNames.add(entry.name);
      return true;
    });

  return queryInterface.bulkInsert("languages", inserts, {});
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete("languages", null, {});
}
