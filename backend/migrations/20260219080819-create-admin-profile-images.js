export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("admin_profile_images", {
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
    file_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    file_size: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    file_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    file_path: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    uploaded_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    },
  });

}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("admin_profile_images");
}