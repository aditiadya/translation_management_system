export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('admin_profile', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    admin_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'admin_auth',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    gender: {
      type: Sequelize.ENUM('male', 'female', 'other'),
      allowNull: true,
    },
    teams_id: {
      type: Sequelize.STRING(128),
      allowNull: true,
    },
    zoom_id: {
      type: Sequelize.STRING(128),
      allowNull: true,
    },
    language_email: {
      type: Sequelize.STRING(64),
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('admin_profile', { transaction });
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_admin_profile_gender";', { transaction });
  });
}
