export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("client_documents", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "client_details",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    document_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    file_name: {
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
    file_path: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    uploaded_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    uploaded_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("client_documents");
}