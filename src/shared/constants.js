export const perms = [
    {
        pageid: 2 ,
        actions: '' ,
    },
    {
        pageid: 3 ,
        actions: '' ,
    },
    {
        pageid: 4 ,
        actions: '' ,
    },
    {
        pageid: 5 ,
        actions: '' ,
    },
    {
        pageid: 6 ,
        actions: '' ,
    },
    {
        pageid: 7 ,
        actions: '' ,
    },
    {
        pageid: 8 ,
        actions: '' ,
    },
    {
        pageid: 9 ,
        actions: '' ,
    },
    {
        pageid: 10 ,
        actions: '' ,
    },
    {
        pageid: 11 ,
        actions: '' ,
    },
    {
        pageid: 12 ,
        actions: '' ,
    },
    {
        pageid: 13 ,
        actions: '' ,
    },
    {
        pageid: 14 ,
        actions: '' ,
    },
]

export const permissionsStructure = [
  {
    title: "Sales",
    items: [
      {id: 2, name: "Inventory", actions: [{id: 1, name: 'Read'},{id: 2, name: 'Create'},{id: 3, name: 'Update'},{id: 4, name: 'Delete'}] },
      {id:3, name: "Orders", actions: [{id: 1, name: 'Read'},{id: 2, name: 'Create'},{id: 3, name: 'Update'},{id: 4, name: 'Delete'},{id: 5, name: 'Assign'}] },
      {id: 4, name: "Analytics", actions: [{id: 1, name: 'Read'}] }
    ]
  },
  {
    title: "Overview",
    items: [
      {id: 5, name: "Tasks", actions: [{id: 1, name: 'Read'},{id: 2, name: 'Create'},{id: 3, name: 'Update'},{id: 4, name: 'Delete'},{id: 5, name: 'Assign'}] },
      {id: 6, name: "Projects", actions: [{id: 1, name: 'Read'},{id: 2, name: 'Create'},{id: 3, name: 'Update'}] },
      {id: 7, name: "Tickets", actions: [{id: 1, name: 'Read'},{id: 2, name: 'Create'},{id: 3, name: 'Update'},{id: 4, name: 'Delete'},{id: 5, name: 'Assign'}] },
      {id: 8, name: "Leave", actions: [{id: 1, name: 'Read'},{id: 2, name: 'Create'},{id: 3, name: 'Update'},{id: 4, name: 'Delete'},{id: 5, name: 'Assign'}] }
    ]
  },
  {
    title: "Management",
    items: [
      {id: 9, name: "Employees", actions: [{id: 1, name: 'Read'},{id: 2, name: 'Create'},{id: 3, name: 'Update'},{id: 4, name: 'Delete'}] },
      {id: 10, name: "Clients", actions: [{id: 1, name: 'Read'},{id: 2, name: 'Create'},{id: 3, name: 'Update'},{id: 4, name: 'Delete'}] },
      {id: 11, name: "Departments", actions: [{id: 1, name: 'Read'},{id: 2, name: 'Create'},{id: 3, name: 'Update'},{id: 4, name: 'Delete'}] },
      {id: 12, name: "Groups", actions: [{id: 1, name: 'Read'},{id: 2, name: 'Create'},{id: 3, name: 'Update'},{id: 4, name: 'Delete'}] },
      {id: 13, name: "Permissions", actions: [{id: 1, name: 'Read'},{id: 2, name: 'Create'},{id: 3, name: 'Update'},{id: 4, name: 'Delete'}] },
      {id: 14, name: "Company Profile", actions: [{id: 1, name: 'Read'},{id: 2, name: 'Create'},{id: 3, name: 'Update'},{id: 4, name: 'Delete'}] }
    ]
  }
];