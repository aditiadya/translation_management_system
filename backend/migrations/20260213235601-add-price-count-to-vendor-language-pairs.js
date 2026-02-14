export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("vendor_language_pairs", "price_count", {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: "Cached count of price list entries for this language pair",
  });

  // Populate existing counts from vendor_price_list
  await queryInterface.sequelize.query(`
    UPDATE vendor_language_pairs vlp
    SET price_count = (
      SELECT COUNT(*)
      FROM vendor_price_list vpl
      WHERE vpl.vendor_id = vlp.vendor_id
        AND vpl.language_pair_id = vlp.language_pair_id
    )
  `);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("vendor_language_pairs", "price_count");
}
