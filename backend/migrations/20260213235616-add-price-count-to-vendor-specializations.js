export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("vendor_specializations", "price_count", {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: "Cached count of price list entries for this specialization",
  });

  console.log("Added price_count column to vendor_specializations");

  // Populate initial counts
  await queryInterface.sequelize.query(`
    UPDATE vendor_specializations vs
    SET price_count = (
      SELECT COUNT(*)
      FROM vendor_price_list vpl
      WHERE vpl.vendor_id = vs.vendor_id
      AND vpl.specialization_id = vs.specialization_id
    )
  `);

  console.log("Populated initial price_count values for vendor_specializations");
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("vendor_specializations", "price_count");
}
