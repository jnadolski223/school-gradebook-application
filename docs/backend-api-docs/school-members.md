POST `/api/v1/school-members` - tworzy nowego członka szkoły i zwraca jego dane.
Zwracany status w przypadku powodzenia: `201`
`Body` wymagane do zapytania:

```json
{
	"userId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
	"schoolId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
	"firstName": "Jan",
	"lastName": "Kowalski"
}
```

Format zwracanych danych:

```json
{
	"status": 201,
	"message": "School member created successfully",
	"data": {
		"userId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"schoolId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"firstName": "Jan",
		"lastName": "Kowalski"
	}
}
```

---

GET `/api/v1/school-members` - zwraca listę wszystkich członków szkół.
Zwracany status w przypadku powodzenia: `200`
Format zwracanych danych:

```json
{
	"status": 200,
	"message": "All school members fetched successfully",
	"data": [
		{
			"userId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
			"schoolId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
			"firstName": "Jan",
			"lastName": "Kowalski"
		},
		...
	]
}
```

---

GET `/api/v1/school-members?schoolId=X` - zwraca listę wszystkich członków wybranej szkoły.
Zwracany status w przypadku powodzenia: `200`
Format zwracanych danych:

```json
{
	"status": 200,
	"message": "All school members fetched successfully",
	"data": [
		{
			"userId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
			"schoolId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
			"firstName": "Jan",
			"lastName": "Kowalski"
		},
		...
	]
}
```

---

GET `/api/v1/school-members/:id` - zwraca dane członka szkoły o danym `id`.
Zwracany status w przypadku powodzenia: `200`
Format zwracanych danych:

```json
{
	"status": 200,
	"message": "School member fetched successfully",
	"data": {
		"userId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"schoolId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"firstName": "Jan",
		"lastName": "Kowalski"
	}
}
```

---

PATCH `/api/v1/school-members/:id` - aktualizuje dane członka szkoły o danym `id` i zwraca zaktualizowanego członka szkoły.
Zwracany status w przypadku powodzenia: `200`
`Body` wymagane do zapytania:

```json
{
	"firstName": "Anna",
	"lastName": "Nowak"
}
```

Format zwracanych danych:

```json
{
	"status": 200,
	"message": "School member fetched successfully",
	"data": {
		"userId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"schoolId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"firstName": "Anna",
		"lastName": "Nowak"
	}
}
```

---

DELETE `/api/v1/school-members/:id` - usuwa członka szkoły o danym `id` i nic nie zwraca.
WAŻNE: Po usunięciu, użytkownik dalej istnieje, tylko nie jest członkiem szkoły.
Zwracany status w przypadku powodzenia: `204`
