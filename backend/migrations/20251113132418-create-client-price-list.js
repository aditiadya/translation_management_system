export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("client_price_list", {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    client_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "client_details",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    service_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "admin_services",
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
    specialization_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "admin_specializations",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    unit: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    price_per_unit: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    currency_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "admin_currencies",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    note: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("client_price_list");
}