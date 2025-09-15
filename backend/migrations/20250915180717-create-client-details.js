import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("client_details", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    auth_id: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.ENUM("Company", "Individual"),
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    legal_entity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state_region: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pan_tax_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gstin_vat_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    can_login: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

}

export async function down(queryInterface) {
  await queryInterface.dropTable("client_details");
}
