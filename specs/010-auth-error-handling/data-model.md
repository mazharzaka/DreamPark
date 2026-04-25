# Data Model: User

## Entity: User
Represents an individual who can interact with the system securely.

### Fields
- `name` (String): Required. User's full name.
- `email` (String): Required, Unique. User's email address.
- `password` (String): Required. Hashed password (omitted from API responses).
- `phoneNumber` (String): Required. User's phone number.
- `profilePicture` (String): User's profile picture.
- `gender` (String): Required. User's gender.
- `dateOfBirth` (String): Required. User's date of birth.
- `address` (String): Required. User's address.
- `role` (String): Required. Enum: `['customer', 'admin', 'staff']`. Defaults to `'customer'`.

### Timestamps
- `createdAt`: Automatically generated on creation.
- `updatedAt`: Automatically updated on modification.
