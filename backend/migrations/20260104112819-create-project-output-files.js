export default {
  async up(queryInterface, Sequelize) {
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
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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

      job_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      job_service: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      job_language_pair: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      job_vendor: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      job_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      uploaded_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      uploadedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("project_output_file");
  },
};