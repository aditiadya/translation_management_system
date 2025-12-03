import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ProjectDetails = sequelize.define(
  "ProjectDetails",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_auth",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "client_details",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    client_contact_person_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "client_contact_persons",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    project_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    language_pair_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "admin_language_pairs",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    specialization_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "admin_specializations",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    start_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    deadline_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    legal_entity: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    internal_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    primary_manager_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "manager_details",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    secondary_manager_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "manager_details",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    status: {
      type: DataTypes.ENUM("Pending", "In Progress", "Completed", "Rejected"),
      allowNull: false,
      defaultValue: "In Progress",
    },
  },
  {
    tableName: "project_details",
    timestamps: true,
  }
);

ProjectDetails.associate = (models) => {
  ProjectDetails.belongsTo(models.AdminAuth, {
    foreignKey: "admin_id",
    as: "admin",
    onDelete: "CASCADE",
  });

  ProjectDetails.belongsTo(models.ClientDetails, {
    foreignKey: "client_id",
    as: "client",
    onDelete: "CASCADE",
  });

  ProjectDetails.belongsTo(models.ClientContactPersons, {
    foreignKey: "contact_person_id",
    as: "contactPerson",
    onDelete: "CASCADE",
  });

  ProjectDetails.belongsTo(models.AdminLanguagePair, {
    foreignKey: "language_pair_id",
    as: "languagePair",
    onDelete: "CASCADE",
  });

  ProjectDetails.belongsTo(models.VendorSpecialization, {
    foreignKey: "specialization_id",
    as: "specialization",
    onDelete: "CASCADE",
  });

  ProjectDetails.belongsTo(models.ManagerDetails, {
    foreignKey: "primary_manager_id",
    as: "primaryManagers",
    onDelete: "CASCADE",
  });

  ProjectDetails.belongsTo(models.ManagerDetails, {
    foreignKey: "secondary_manager_id",
    as: "secondaryManagers",
    onDelete: "CASCADE",
  });
};

export default ProjectDetails;