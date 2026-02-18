export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("project_output_file", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    project_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "project_details",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    job_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "job_details",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    file_code: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    file_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    original_file_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    file_path: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    file_size: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    uploaded_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "admin_auth",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    uploaded_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("project_output_file");
}