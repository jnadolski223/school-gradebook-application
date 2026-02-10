**!!!UWAGA!!!**
Dane użytkowników nie będą szyfrowane i nie ma tokenów JWT na obecnym etapie projektu. Dane są przesyłane czystym tekstem i nie zawierają hasła użytkownika.

---

POST `/api/v1/users/register` - rejestruje nowego użytkownika w bazie danych i zwraca nowo utworzonego użytkownika.
Zwracany status w przypadku powodzenia: `201`
Lista poprawnych nazw ról:
- STUDENT
- PARENT
- TEACHER
- SCHOOL_ADMINISTRATOR
- APP_ADMINISTRATOR

`Body` wymagane do zapytania:

```json
{
	"login": "jkowalski123",
	"password": "AlaMaKota%123&",
	"role": "STUDENT"
}
```

Format zwracanych danych:

```json
{
	"status": 201,
	"message": "User registered successfully",
	"data": {
		"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"login": "jkowalski123",
		"role": "STUDENT",
		"createdAt": "2026-02-09T02:53:44.142401500Z",
		"modifiedAt": "2026-02-09T02:53:44.142401500Z",
		"isActive": true
	}
}
```

---

POST `/api/v1/users/login` - loguje użytkownika i zwraca jego dane w wersji skróconej.
Zwracany status w przypadku powodzenia: `200`
`Body` wymagane do zapytania:

```json
{
	"login": "jkowalski123",
	"password": "AlaMaKota%123&"
}
```

Format zwracanych danych:

```json
{
	"status": 200,
	"message": "User logged in successfully",
	"data": {
		"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"login": "jkowalski123",
		"role": "STUDENT"
	}
}
```

---

GET `/api/v1/users` - zwraca listę wszystkich użytkowników w bazie danych.
Zwracany status w przypadku powodzenia: `200`

Format zwracanych danych:

```json
{
	"status": 200,
	"message": "All users fetched successfully",
	"data": [
		{
			"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
			"login": "jkowalski123",
			"role": "STUDENT",
			"createdAt": "2026-02-09T02:53:44.142401500Z",
			"modifiedAt": "2026-02-09T02:53:44.142401500Z",
			"isActive": X // true, false
		},
		...
	]
}
```

---

GET `/api/v1/users?active=X` - zwraca listę wszystkich aktywnych/nieaktywnych użytkowników w bazie danych.
Zwracany status w przypadku powodzenia: `200`
Parametr `active` w URL przyjmuje `true` albo `false`.
Format zwracanych danych:

```json
{
	"status": 200,
	"message": "All users fetched successfully",
	"data": [
		{
			"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
			"login": "jkowalski123",
			"role": "STUDENT",
			"createdAt": "2026-02-09T02:53:44.142401500Z",
			"modifiedAt": "2026-02-09T02:53:44.142401500Z",
			"isActive": true
		},
		...
	]
}
```

---

PATCH `/api/v1/users/:id` - aktualizuje dane użytkownika o podanym `id`.
Zwracany status w przypadku powodzenia: `200`
Lista poprawnych nazw ról:
- STUDENT
- PARENT
- TEACHER
- SCHOOL_ADMINISTRATOR
- APP_ADMINISTRATOR

`Body` wymagane do zapytania:

```json
{
	"login": "jkowalski123",
	"password": "AlaMaKota%123&",
	"role": "STUDENT"
}
```

Do zapytania nie są wymagane wszystkie pola.

Format zwracanych danych:

```json
{
	"status": 200,
	"message": "User updateds successfully",
	"data": {
		"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"login": "jkowalski123",
		"role": "STUDENT",
		"createdAt": "2026-02-09T02:53:44.142401500Z",
		"modifiedAt": "2026-02-09T02:53:44.142401500Z",
		"isActive": true
	}
}
```

---

PATCH `/api/v1/users/:id/activate` - aktywuje użytkownika o podanym `id` (ustawia pole `isActive` na `true`) i nic nie zwraca.
Zwracany status w przypadku powodzenia: `204`

---

PATCH `/api/v1/users/:id/deactivate` - deaktywuje użytkownika o podanym `id` (ustawia pole `isActive` na `false`) i nic nie zwraca.
Zwracany status w przypadku powodzenia: `204`

---

DELETE `/api/v1/users/:id` - usuwa użytkownika z bazy danych o podanym `id` i nic nie zwraca.
Zwracany status w przypadku powodzenia: `204`
