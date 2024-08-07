export const statusOptions = [
  { id: 1, label: "Waiting" },
  { id: 2, label: "In Progress" },
  { id: 3, label: "Done" },
];

export const mockUsers = [
  { id: 1, type: 1, user_name: "John" },
  { id: 2, type: 2, user_name: "Jane" },
  { id: 3, type: 3, user_name: "Abdurrahman" },
  { id: 4, type: 3, user_name: "Jill" },
  { id: 5, type: 4, user_name: "Admin" }
];

// type:1 customer
// type:2 router
// type:3 worker
// type:4 admin

export const initialRows = [
  {
    id: 1,
    location_id: "2F Bathroom",
    compliant: "There is no soap",
    photo_url: "https://via.placeholder.com/150",
    assigned_user_id: null,
    status_id: 1,
    created_at: "2021-10-01",
    finished_at: null,
  },
  {
    id: 2,
    location_id: "3F Admin",
    compliant: "The place is messy",
    photo_url: "https://via.placeholder.com/150",
    assigned_user_id: "4",
    status_id: 2,
    created_at: "2021-07-04",
    finished_at: null,
  },
  {
    id: 3,
    location_id: "1F Lobby",
    compliant: "There is no trash bin",
    photo_url: "https://via.placeholder.com/150",
    assigned_user_id: "3",
    status_id: 3,
    created_at: "2021-11-02",
    finished_at: "2021-11-02",
  },
  {
    id: 4,
    location_id: "4F Library",
    compliant: "The place is dirty",
    photo_url: "https://via.placeholder.com/150",
    assigned_user_id: null,
    status_id: 1,
    created_at: "2021-07-04",
    finished_at: null,
  },
];
