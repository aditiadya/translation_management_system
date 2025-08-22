export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('admin_auth', 'terms_accepted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('admin_auth', 'terms_accepted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('admin_auth', 'terms_accepted');
    await queryInterface.removeColumn('admin_auth', 'terms_accepted_at');
  },
};
