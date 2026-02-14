export async function up(queryInterface, Sequelize) {
  try {
    // Drop the old specialization constraint if it still exists
    await queryInterface.removeConstraint(
      "vendor_price_list",
      "vendor_price_list_ibfk_4"
    );
    console.log("✓ Dropped vendor_price_list_ibfk_4");
  } catch (error) {
    console.log("vendor_price_list_ibfk_4 might already be dropped or doesn't exist");
  }

  // Check if the correct constraint already exists, if not add it
  try {
    await queryInterface.addConstraint("vendor_price_list", {
      fields: ["specialization_id"],
      type: "foreign key",
      name: "vendor_price_list_specialization_fk",
      references: {
        table: "admin_specializations",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    console.log("✓ Added vendor_price_list_specialization_fk");
  } catch (error) {
    console.log("vendor_price_list_specialization_fk already exists");
  }
}

export async function down(queryInterface, Sequelize) {
  // Rollback: restore old constraint
  try {
    await queryInterface.removeConstraint(
      "vendor_price_list",
      "vendor_price_list_specialization_fk"
    );
  } catch (error) {
    console.log("Could not remove vendor_price_list_specialization_fk");
  }

  try {
    await queryInterface.addConstraint("vendor_price_list", {
      fields: ["specialization_id"],
      type: "foreign key",
      name: "vendor_price_list_ibfk_4",
      references: {
        table: "vendor_specializations",
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  } catch (error) {
    console.log("Could not restore vendor_price_list_ibfk_4");
  }
}
