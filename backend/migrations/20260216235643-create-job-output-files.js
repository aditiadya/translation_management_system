export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("job_output_files", {
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
      allowNull: false,
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
    file_type: {
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
    uploaded_by_vendor: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "vendor_details",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      comment: "If uploaded by vendor",
    },
    input_for_job: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    is_project_output: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
  await queryInterface.dropTable("job_output_files");
}