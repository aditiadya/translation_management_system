export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("vendor_contact_persons", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gender: {
      type: Sequelize.ENUM("Male", "Female", "Other"),
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
    position: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    notes: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
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

  await queryInterface.addIndex("vendor_contact_persons", ["vendor_id"]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("vendor_contact_persons");
}
