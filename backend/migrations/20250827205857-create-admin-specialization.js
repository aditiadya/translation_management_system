export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("admin_specializations", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
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
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
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

  await queryInterface.addIndex("admin_specializations", ["admin_id"]);
  await queryInterface.addIndex("admin_specializations", ["admin_id", "name"], {
    unique: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("admin_specializations");
}
