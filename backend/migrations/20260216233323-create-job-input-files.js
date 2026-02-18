export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("job_input_files", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    project_id: {  // ← THIS WAS MISSING
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
      allowNull: false,
      references: {
        model: "job_details",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    project_input_file_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "project_input_file",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      comment: "If linked from project input files",
    },
    file_code: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    file_name: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "Only if directly uploaded",
    },
    original_file_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    file_path: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    file_size: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    file_type: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    output_from_job: {
      type: Sequelize.STRING,
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
    is_linked: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "True if linked from project files, false if directly uploaded",
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
  await queryInterface.dropTable("job_input_files");
}