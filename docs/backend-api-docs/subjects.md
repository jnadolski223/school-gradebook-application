POST `/api/v1/subjects` - tworzy nowy przedmiot szkolny w bazie danych i zwraca nowo utworzony przedmiot szkolny. Przedmiot ten jest powiązany ze szkołą, której ID (`schoolId`) się podało.
Zwracany status w przypadku powodzenia: `201`
`Body` wymagane do zapytania:

```json
{
	"schoolId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
	"name": "Matematyka"
}
```

Format zwracanych danych:

```json
{
	"status": 201,
	"message": "Subject created successfully",
	"data": {
		"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"schoolId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"name": "Matematyka"
	}
}
```

---

GET `/api/v1/subjects?schoolId=X` - zwraca listę wszystkich przedmiotów szkolnych dla danej szkoły, której ID (`schoolId`) się podało.
Zwracany status w przypadku powodzenia: `200`
Format zwracanych danych:

```json
{
	"status": 200,
	"message": "All subjects for school with ID X fetched successfully",
	"data": [
		{
			"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
			"schoolId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
			"name": "Matematyka"
		},
		...
	]
}
```

---

GET `/api/v1/subjects/:id` - zwraca dane przedmiotu szkolnego o podanym `id`.
Zwracany status w przypadku powodzenia: `200`
Format zwracanych danych:

```json
{
	"status": 200,
	"message": "Subject fetched successfully",
	"data": {
		"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"schoolId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"name": "Matematyka"
	}
}
```

---

PATCH `/api/v1/subjects/:id` - aktualizuje nazwę przedmiotu szkolnego o podanym `id`.
Zwracany status w przypadku powodzenia: `200`
`Body` wymagane do zapytania:

```json
{
	"name": "Matematyka rozszerzona"
}
```

Format zwracanych danych:

```json
{
	"status": 200,
	"message": "Subject updated successfully",
	"data": {
		"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"schoolId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"name": "Matematyka rozszerzona"
	}
}
```

---

DELETE `/api/v1/subjects/:id` - usuwa przedmiot szkolny o podanym `id` i nic nie zwraca.
Zwracany status w przypadku powodzenia: `204`
