
# Hierarchy Data Manager

<img width="2559" height="1252" alt="image" src="https://github.com/user-attachments/assets/2efff389-c2ec-4a47-b73f-d93d073f6d14" />
A React application that loads hierarchical data from a JSON file and allows users to view and manage it. Nodes can be removed recursively while maintaining reference-based deletion to handle non-unique IDs safely.

## Features

- Load hierarchical data from a JSON file
- Display nested nodes with their children
- Remove individual nodes without affecting duplicates with the same ID
- Context-based state management with `DataContext`
- Safe recursive deletion logic
