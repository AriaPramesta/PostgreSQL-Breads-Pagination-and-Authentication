# 📝 PostgreSQL BREAD, Pagination, and Authentication App

A simple TODO web app built with **Node.js**, **Express**, **PostgreSQL**, and **EJS**, featuring:

- 🔒 User Authentication (Login & Register)
- 📦 BREAD Operations (Browse, Read, Edit, Add, Delete)
- 📅 Deadline Filtering (with date range)
- 🔁 Pagination
- 📤 Avatar Upload with File Handling
- 📄 Flash Messaging (Success & Error)
- 🧠 Session Handling with `express-session`
- 📷 Profile Avatar support (file upload)

---

## 🚀 Tech Stack

- Node.js
- Express
- PostgreSQL (pg)
- EJS Templating
- express-session
- connect-flash
- express-fileupload
- moment.js
- Bootstrap (for UI styling)

---

## 📂 Features

- ✅ Register/Login using email & password
- 🔐 Passwords hashed before storing (via bcrypt)
- 📃 Todos list with:
  - Title
  - Completion status
  - Deadline (with time)
- 🔎 Filter Todos by:
  - Title
  - Date range (start & end)
  - Completion status
  - Operation (`AND` / `OR`)
- 🖼️ Upload and display user avatars
- 📄 Pagination with sorting
