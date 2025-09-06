export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("permissions", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    module: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    action: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("permissions");
}
