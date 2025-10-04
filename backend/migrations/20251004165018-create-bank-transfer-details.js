export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("bank_transfer_details", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    payment_method_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "admin_payment_methods",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    payment_method_name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    beneficiary_name: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    beneficiary_address: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    bank_name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    account_number: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    ifsc_code: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },
    swift: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },
    iban: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    sort_code: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },
    bank_address: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    country: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    state_region: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    city: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    postal_code: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("bank_transfer_details");
}