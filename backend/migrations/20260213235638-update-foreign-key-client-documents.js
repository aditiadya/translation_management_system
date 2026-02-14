export default {
  async up(queryInterface, Sequelize) {
    // Add foreign key constraint using changeColumn
    await queryInterface.changeColumn("client_documents", "uploaded_by", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "admin_details",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove foreign key constraint by changing back to simple column
    await queryInterface.changeColumn("client_documents", "uploaded_by", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
