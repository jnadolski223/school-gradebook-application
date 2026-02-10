POST `/api/v1/school-applications` - tworzy nowy wniosek w bazie danych i zwraca nowo utworzony wniosek.
Zwracany status w przypadku powodzenia: `201`
`Body` wymagane do zapytania:

```json
{
	"senderFirstName": "Jan",
	"senderLastName": "Kowalski",
	"senderEmail": "jan.kowalski@example.com",
	"schoolName": "Szkoła Podstawowa nr 1 w Warszawie",
	"schoolStreet": "Przykładowa 42",
	"schoolPostalCode": "00-000",
	"schoolCity": "Warszawa",
	"rspoNumber": "123456",
	"description": "Przykładowy opis"
}
```

Format zwracanych danych:

```json
{
	"status": 201,
	"message": "School application created successfully",
	"data": {
		"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"senderFirstName": "Jan",
		"senderLastName": "Kowalski",
		"senderEmail": "jan.kowalski@example.com",
		"schoolName": "Szkoła Podstawowa nr 1 w Warszawie",
		"schoolStreet": "Przykładowa 42",
		"schoolPostalCode": "00-000",
		"schoolCity": "Warszawa",
		"rspoNumber": "123456",
		"description": "Przykładowy opis",
		"createdAt": "2026-02-09T02:53:44.142401500Z",
		"status": "PENDING"
	}
}
```

---

GET `/api/v1/school-applications` - zwraca listę wszystkich wniosków w bazie danych w formie skróconej.
Zwracany status w przypadku powodzenia: `200`
Format zwracanych danych:

```json
{
	"status": 200,
	"message": "All school applications fetched successfully",
	"data": [
		{
			"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
			"schoolName": "Szkoła Podstawowa nr 1 w Warszawie",
			"createdAt": "2026-02-09T02:53:44.142402Z",
			"status": "PENDING"
		},
		...
	]
}
```

---

GET `/api/v1/school-applications?status=X` - zwraca listę wszystkich wniosków w bazie danych o podanym statusie w formie skróconej.
Zwracany status w przypadku powodzenia: `200`
Lista poprawnych nazw statusów:
- PENDING
- APPROVED
- REJECTED

Format zwracanych danych:

```json
{
	"status": 200,
	"message": "All school applications with X status fetched successfully",
	"data": [
		{
			"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
			"schoolName": "Szkoła Podstawowa nr 1 w Warszawie",
			"createdAt": "2026-02-09T02:53:44.142402Z",
			"status": "X" // PENDING, APPROVED, REJECTED
		},
		...
	]
}
```

---

GET `/api/v1/school-applications/:id` - zwraca wniosek o podanym `id`.
Zwracany status w przypadku powodzenia: `200`
Format zwracanych danych:

```json
{
	"status": 200,
	"message": "School application fetched successfully",
	"data": {
		"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"senderFirstName": "Jan",
		"senderLastName": "Kowalski",
		"senderEmail": "jan.kowalski@example.com",
		"schoolName": "Szkoła Podstawowa nr 1 w Warszawie",
		"schoolStreet": "Przykładowa 42",
		"schoolPostalCode": "00-000",
		"schoolCity": "Warszawa",
		"rspoNumber": "123456",
		"description": "Przykładowy opis",
		"createdAt": "2026-02-09T02:53:44.142401500Z",
		"status": "PENDING"
	}
}
```

---

PATCH `/api/v1/school-applications/:id` - aktualizuje status wniosku o podanym `id` i zwraca zaktualizowany wniosek.
Zwracany status w przypadku powodzenia: `200`
Lista poprawnych nazw statusów:
- PENDING
- APPROVED
- REJECTED

`Body` wymagane do zapytania:

```json
{
	"status": "X" // PENDING, APPROVED, REJECTED
}
```

Format zwracanych danych:

```json
{
	"status": 200,
	"message": "School application status updated successfully",
	"data": {
		"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"senderFirstName": "Jan",
		"senderLastName": "Kowalski",
		"senderEmail": "jan.kowalski@example.com",
		"schoolName": "Szkoła Podstawowa nr 1 w Warszawie",
		"schoolStreet": "Przykładowa 42",
		"schoolPostalCode": "00-000",
		"schoolCity": "Warszawa",
		"rspoNumber": "123456",
		"description": "Przykładowy opis",
		"createdAt": "2026-02-09T02:53:44.142401500Z",
		"status": "X"
	}
}
```

---

DELETE `/api/v1/school-applications/:id` - usuwa z bazy danych wniosek o podanym `id` i nic nie zwraca.
Zwracany status w przypadku powodzenia: `204`
