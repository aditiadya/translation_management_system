export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("unit_based_receivables", {
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
      onDelete: "RESTRICT",
    },

    po_number: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    service_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    language_pair_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },

    unit_amount: {
      type: Sequelize.DECIMAL(12, 3),
      allowNull: false,
    },

    unit_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "admin_units",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    price_per_unit: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    },

    subtotal: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },

    currency_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    file_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "project_input_file",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },

    internal_note: {
      type: Sequelize.TEXT,
      allowNull: true,
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
}

export async function down(queryInterface) {
  await queryInterface.dropTable("unit_based_receivables");
}