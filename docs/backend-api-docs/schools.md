POST `/api/v1/schools` - tworzy nową szkołę w bazie danych i zwraca nowo utworzoną szkołę.
Zwracany status w przypadku powodzenia: `201`
`Body` wymagane do zapytania:
```json
{
	"name": "Szkoła Podstawowa nr 1 w Warszawie",
	"street": "Przykładowa 42",
	"postalCode": "00-000",
	"city": "Warszawa",
	"phoneNumber": "+48123456789", // Argument może być pusty
	"email": "sp.warszawa@example.com", // Argument może być pusty
	"rspoNumber": "123456",
}
```

Argumenty `phoneNumber` i `email` nie są wymagane, w takim przypadku należy dać pusty napis.

Format zwracanych danych:

```json
{
	"status": 201,
	"message": "School created successfully",
	"data": {
		"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"name": "Szkoła Podstawowa nr 1 w Warszawie",
		"street": "Przykładowa 42",
		"postalCode": "00-000",
		"city": "Warszawa",
		"phoneNumber": "+48123456789",
		"email": "sp.warszawa@example.com",
		"rspoNumber": "123456",
		"createdAt": "2026-02-09T02:53:44.142401500Z",
		"modifiedAt": "2026-02-09T02:53:44.142401500Z",
		"isActive": true
	}
}
```

---

GET `/api/v1/schools` - zwraca listę wszystkich szkół w bazie danych w formie skróconej.
Zwracany status w przypadku powodzenia: `200`
Format zwracanych danych:

```json
{
	"status": 200,
	"message": "All schools fetched successfully",
	"data": [
		{
			"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
			"schoolName": "Szkoła Podstawowa nr 1 w Warszawie",
			"createdAt": "2026-02-09T02:53:44.142402Z",
			"modifiedAt": "2026-02-09T02:53:44.142401500Z",
			"isActive": true
		},
		...
	]
}
```

---

GET `/api/v1/schools?active=X` - zwraca listę wszystkich aktywnych/nieaktywnych szkół w bazie danych w formie skróconej.
Zwracany status w przypadku powodzenia: `200`
Parametr `active` w URL przyjmuje `true` albo `false`.
Format zwracanych danych:

```json
{
	"status": 200,
	"message": "All active/inactive schools fetched successfully",
	"data": [
		{
			"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
			"schoolName": "Szkoła Podstawowa nr 1 w Warszawie",
			"createdAt": "2026-02-09T02:53:44.142402Z",
			"modifiedAt": "2026-02-09T02:53:44.142401500Z",
			"isActive": X // true, false
		},
		...
	]
}
```

---

GET `/api/v1/schools/:id` - zwraca szkołę o podanym `id`.
Zwracany status w przypadku powodzenia: `200`
Format zwracanych danych:

```json
{
	"status": 200,
	"message": "School fetched successfully",
	"data": {
		"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"name": "Szkoła Podstawowa nr 1 w Warszawie",
		"street": "Przykładowa 42",
		"postalCode": "00-000",
		"city": "Warszawa",
		"phoneNumber": "+48123456789",
		"email": "sp.warszawa@example.com",
		"rspoNumber": "123456",
		"createdAt": "2026-02-09T02:53:44.142401500Z",
		"modifiedAt": "2026-02-09T02:53:44.142401500Z",
		"isActive": true
	}
}
```

---

PUT `/api/v1/schools/:id` - aktualizuje dane szkoły o podanym `id` i zwraca zaktualizowane dane szkoły.
Zwracany status w przypadku powodzenia: `200`
`Body` wymagane do zapytania:

```json
{
	"name": "Szkoła Podstawowa nr 1 w Warszawie",
	"street": "Przykładowa 42",
	"postalCode": "00-000",
	"city": "Warszawa",
	"phoneNumber": "+48123456789", // Argument może być pusty
	"email": "sp.warszawa@example.com", // Argument może być pusty
	"rspoNumber": "123456",
}
```

Argumenty `phoneNumber` i `email` nie są wymagane, w takim przypadku należy dać pusty napis.

Format zwracanych danych:

```json
{
	"status": 200,
	"message": "School updated successfully",
	"data": {
		"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"name": "Szkoła Podstawowa nr 1 w Warszawie",
		"street": "Przykładowa 42",
		"postalCode": "00-000",
		"city": "Warszawa",
		"phoneNumber": "+48123456789",
		"email": "sp.warszawa@example.com",
		"rspoNumber": "123456",
		"createdAt": "2026-02-09T02:53:44.142401500Z",
		"modifiedAt": "2026-02-09T02:53:44.142401500Z",
		"isActive": true
	}
}
```

---

PATCH `/api/v1/schools/:id/activate` - aktywuje szkołę o podanym `id` (ustawia pole `isActive` na `true`) i nic nie zwraca.
Zwracany status w przypadku powodzenia: `204`

---

PATCH `/api/v1/schools/:id/activate` - deaktywuje szkołę o podanym `id` (ustawia pole `isActive` na `false`) i nic nie zwraca.
Zwracany status w przypadku powodzenia: `204`

---

DELETE `/api/v1/schools/:id/` - usuwa szkołę z bazy danych o podanym `id` i nic nie zwraca.
Zwracany status w przypadku powodzenia: `204`