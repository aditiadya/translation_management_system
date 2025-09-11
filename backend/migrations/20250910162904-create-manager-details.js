export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("manager_details", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    auth_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "admin_auth",
        key: "id",
      },
      onDelete: "CASCADE",
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

    client_pool: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    gender: {
      type: Sequelize.ENUM("male", "female", "other"),
      allowNull: true,
    },

    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    teams_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    zoom_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    timezone: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    can_login: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },

    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("manager_details");
}
