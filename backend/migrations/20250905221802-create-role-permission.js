export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("role_permissions", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    permission_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "permissions",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });

  await queryInterface.addConstraint("role_permissions", {
    fields: ["role_id", "permission_id"],
    type: "unique",
    name: "unique_role_permission",
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("role_permissions");
}
