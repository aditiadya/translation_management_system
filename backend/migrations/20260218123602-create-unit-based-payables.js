export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("unit_based_payables", {
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

    job_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "job_details",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
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
      references: {
        model: "admin_currencies",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    file_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "job_input_files",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },

    note_for_vendor: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    internal_note: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },

    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("unit_based_payables");
}
