export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("vendor_services", "price_count", {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: "Cached count of price list entries for this service",
  });

  // Populate existing counts
  await queryInterface.sequelize.query(`
    UPDATE vendor_services vs
    SET price_count = (
      SELECT COUNT(*)
      FROM vendor_price_list vpl
      WHERE vpl.vendor_id = vs.vendor_id
        AND vpl.service_id = vs.service_id
    )
  `);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("vendor_services", "price_count");
}
