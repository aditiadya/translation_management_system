export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("job_status_history", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
    old_status: {
      type: Sequelize.ENUM(
        "Draft",
        "Offered to Vendor",
        "Offer Accepted",
        "Offer Rejected",
        "Started",
        "Completed",
        "Hold",
        "Completion Accepted",
        "Completion Rejected",
        "Cancelled"
      ),
      allowNull: true,
    },
    new_status: {
      type: Sequelize.ENUM(
        "Draft",
        "Offered to Vendor",
        "Offer Accepted",
        "Offer Rejected",
        "Started",
        "Completed",
        "Hold",
        "Completion Accepted",
        "Completion Rejected",
        "Cancelled"
      ),
      allowNull: false,
    },
    changed_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    changed_by: {
      type: Sequelize.ENUM("admin", "vendor"),
      allowNull: false,
      defaultValue: "admin",
    },
    comment: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    auto_transitioned: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("job_status_history");
}