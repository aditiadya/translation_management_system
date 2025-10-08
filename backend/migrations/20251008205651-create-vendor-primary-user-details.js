export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("vendor_primary_user_details", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    timezone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    zoom_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    teams_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    gender: {
      type: Sequelize.ENUM("Male", "Female", "Other"),
      allowNull: true,
    },
    nationality: {
      type: Sequelize.STRING,
      allowNull: false,
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
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("vendor_primary_user_details");
}