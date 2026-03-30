export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("vendor_profile_images", {
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
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("vendor_profile_images");
}
