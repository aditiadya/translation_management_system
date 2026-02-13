import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const JobDetails = sequelize.define(
  "JobDetails",
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

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "project_details",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vendor_details",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    vendor_contact_person_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "vendor_contact_persons",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_services",
        key: "id",
      },
      onDelete: "CASCADE",
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

    deadline_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    free_of_charge: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    auto_start_on_vendor_acceptance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    note_for_vendor: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    internal_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    pdf_template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    checklist_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "job_details",
    timestamps: true,
  }
);

JobDetails.associate = (models) => {
  JobDetails.belongsTo(models.AdminAuth, {
    foreignKey: "admin_id",
    as: "admin",
    onDelete: "CASCADE",
  });

  JobDetails.belongsTo(models.ProjectDetails, {
    foreignKey: "project_id",
    as: "project",
    onDelete: "CASCADE",
  });

  JobDetails.belongsTo(models.VendorDetails, {
    foreignKey: "vendor_id",
    as: "vendor",
    onDelete: "CASCADE",
  });

  JobDetails.belongsTo(models.VendorContactPersons, {
    foreignKey: "vendor_contact_person_id",
    as: "vendorContactPerson",
    onDelete: "CASCADE",
  });

  JobDetails.belongsTo(models.AdminService, {
    foreignKey: "service_id",
    as: "service",
    onDelete: "CASCADE",
  });

  JobDetails.belongsTo(models.AdminLanguagePair, {
    foreignKey: "language_pair_id",
    as: "languagePair",
    onDelete: "CASCADE",
  });
};

export default JobDetails;