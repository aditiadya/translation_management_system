export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("roles", {
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
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    }
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("roles");
}
