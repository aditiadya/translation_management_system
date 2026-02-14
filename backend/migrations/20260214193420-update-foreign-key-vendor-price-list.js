export async function up(queryInterface, Sequelize) {
  console.log("Updating vendor_price_list foreign keys...");

  /** ✅ Remove OLD foreign keys **/

  await queryInterface.removeConstraint(
    "vendor_price_list",
    "vendor_price_list_ibfk_2" // service_id FK
  );

  await queryInterface.removeConstraint(
    "vendor_price_list",
    "vendor_price_list_ibfk_3" // language_pair_id FK
  );

  /** ✅ Add NEW foreign keys **/

  await queryInterface.addConstraint("vendor_price_list", {
    fields: ["service_id"],
    type: "foreign key",
    name: "vendor_price_list_service_fk",
    references: {
      table: "admin_services",
      field: "id",
    },
    onDelete: "CASCADE",
  });

  await queryInterface.addConstraint("vendor_price_list", {
    fields: ["language_pair_id"],
    type: "foreign key",
    name: "vendor_price_list_language_fk",
    references: {
      table: "admin_language_pairs",
      field: "id",
    },
    onDelete: "CASCADE",
  });

  console.log("Foreign keys updated successfully.");
}

export async function down(queryInterface, Sequelize) {
  console.log("Reverting vendor_price_list foreign keys...");

  /** Remove NEW keys **/

  await queryInterface.removeConstraint(
    "vendor_price_list",
    "vendor_price_list_service_fk"
  );

  await queryInterface.removeConstraint(
    "vendor_price_list",
    "vendor_price_list_language_fk"
  );

  /** Restore OLD keys **/

  await queryInterface.addConstraint("vendor_price_list", {
    fields: ["service_id"],
    type: "foreign key",
    name: "vendor_price_list_ibfk_2",
    references: {
      table: "vendor_services",
      field: "id",
    },
    onDelete: "CASCADE",
  });

  await queryInterface.addConstraint("vendor_price_list", {
    fields: ["language_pair_id"],
    type: "foreign key",
    name: "vendor_price_list_ibfk_3",
    references: {
      table: "vendor_language_pairs",
      field: "id",
    },
    onDelete: "CASCADE",
  });

  console.log("Foreign keys reverted.");
}