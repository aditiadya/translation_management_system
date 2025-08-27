export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("admin_details", {
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
    account_type: {
      type: Sequelize.ENUM("enterprise", "freelance"),
      allowNull: false,
    },
    company_name: {
      type: Sequelize.STRING(128),
      allowNull: true,
    },
    country: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    time_zone: {
      type: Sequelize.STRING(64),
      allowNull: false,
    },
    first_name: {
      type: Sequelize.STRING(64),
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING(64),
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING(64),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: Sequelize.STRING(32),
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

  await queryInterface.addIndex("admin_details", ["admin_id"]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("admin_details");
}
