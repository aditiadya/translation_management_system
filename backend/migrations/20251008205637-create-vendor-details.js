export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("vendor_details", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
    type: {
      type: Sequelize.ENUM("Company", "Freelance", "In-House"),
      allowNull: false,
    },
    company_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    legal_entity: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    state_region: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    postal_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    address: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    pan_tax_number: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    gstin_vat_number: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    website: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    note: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    can_login: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    assignable_to_jobs: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    finances_visible: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("vendor_details");
}