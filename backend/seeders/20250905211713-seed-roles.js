export async function up(queryInterface) {
  const roles = [
    { name: "Administrator", category: "admin" },
    { name: "Operations Manager", category: "manager" },
    { name: "Account Manager", category: "manager" },
    { name: "Project Manager", category: "manager" },
    { name: "Sales Manager", category: "manager" },
    { name: "Vendor Manager", category: "manager" },
    { name: "Finance Manager", category: "manager" },
    { name: "Accountant", category: "manager" },
    { name: "Office Admin", category: "manager" },
    { name: "Language Quality Manager", category: "manager" },
    { name: "Language Lead", category: "manager" },
    { name: "Vendor", category: "vendor" },
    { name: "Client", category: "client" },
  ];

  const data = roles.map(({ name, category }) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, "_"),
    description: "",
    category,
  }));

  await queryInterface.bulkInsert("roles", data, {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("roles", null, {});
}