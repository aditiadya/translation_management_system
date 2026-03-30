export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("vendor_profile", {
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
    gender: {
      type: Sequelize.ENUM("Male", "Female", "Other"),
      allowNull: true,
    },
    teams_id: {
      type: Sequelize.STRING(128),
      allowNull: true,
    },
    zoom_id: {
      type: Sequelize.STRING(128),
      allowNull: true,
    },
    language_email: {
      type: Sequelize.STRING(64),
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
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("vendor_profile");
}
