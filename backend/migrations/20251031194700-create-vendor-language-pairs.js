export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("vendor_language_pairs", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "vendor_details",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      language_pair_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "admin_language_pairs",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    await queryInterface.addConstraint("vendor_language_pairs", {
      fields: ["vendor_id", "language_pair_id"],
      type: "unique",
      name: "unique_vendor_language_pair",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("vendor_language_pairs");
  },
};
