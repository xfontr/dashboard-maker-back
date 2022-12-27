# Dashboard maker back

## Endpoints

`🔹 POST ➡️ .../users/`  
Creates a new user.

```json
		{
			"name": "John",
			"firstSurname": "Doe",
			"secondSurname": "Dao",
			"email": "johndoe@mail.com",
			"mobileNumber": 674 251 833,
			"phoneNumber": 93 419 77 11,
			"role": "user",
			"address": "",
			"postalCode": 08033,
			"city": "Barcelona",
		}

		{
			"userRoles": [
				"user",
				"admin"
			]
		}
```

`🔹 DELETE ➡️ .../users?user=userId`
Deletes user that matches the specified param.

`🔹 PATCH ➡️ .../users?user=userId`
Edits the specified user data.
