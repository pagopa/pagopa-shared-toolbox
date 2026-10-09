const SidebarItems = [
  {
    name: "Archetypes and schema",
    route: "/mocker/archetypes",
    domain: "mocker",
    is_active: false,
  },
  {
    name: "Resources",
    route: "/mocker/mock-resources",
    domain: "mocker",
    is_active: true,
  },
  {
    name: "Simulate Mocker Behavior",
    route: "/mocker/simulation",
    domain: "mocker",
    is_active: true,
  },
  {
    name: "Operations",
    route: "/authorizer/operation",
    domain: "authorizer",
    is_active: false,
  },
  {
    name: "Partner",
    route: "/partner",
    domain: "demo",
    is_active: true,
  },
  {
    name: "Pagamento andato a buon fine",
    route: "/demo/payment/success",
    domain: "demo",
    is_active: true,
  },
  {
    name: "Pagamento cancellato",
    route: "/demo/payment/cancel",
    domain: "demo",
    is_active: true,
  },
  {
    name: "Pagamento andato in errore",
    route: "/demo/payment/error",
    domain: "demo",
    is_active: true,
  },
  {
    name: "Pagamento in attesa",
    route: "/demo/payment/waiting",
    domain: "demo",
    is_active: true,
  },
];

export default SidebarItems;
