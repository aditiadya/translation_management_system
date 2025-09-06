export async function up(queryInterface) {
  const roles = [
    "Administrator",
    "Operations Manager",
    "Account Manager",
    "Project Manager",
    "Sales Manager",
    "Vendor Manager",
    "Finance Manager",
    "Accountant",
    "Office Admin",
    "Language Quality Manager",
    "Language Lead",
  ];

  const data = roles.map((name) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, "_"),
    description: "",
  }));

  await queryInterface.bulkInsert("roles", data, {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("roles", null, {});
}
