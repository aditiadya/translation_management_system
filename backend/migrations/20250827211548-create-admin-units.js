export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("admin_units", {
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
    in_use: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_word: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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

  await queryInterface.addIndex("admin_units", ["admin_id"]);
  await queryInterface.addIndex("admin_units", ["admin_id", "name"], {
    unique: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("admin_units");
}
