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
    }
];

export default SidebarItems;
