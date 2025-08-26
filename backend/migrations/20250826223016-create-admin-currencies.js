export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("admin_currencies", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    admin_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "admin_auth",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    currency_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "currencies",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    active_flag: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

  await queryInterface.addIndex("admin_currencies", ["admin_id"]);
  await queryInterface.addIndex("admin_currencies", ["currency_id"]);
  await queryInterface.addConstraint("admin_currencies", {
    fields: ["admin_id", "currency_id"],
    type: "unique",
    name: "unique_admin_currency",
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("admin_currencies");
}
